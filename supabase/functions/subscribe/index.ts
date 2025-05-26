import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MAILCHIMP_API_KEY = "46d774aa1b75d6365b650c5fbb183bdb-us22";
const MAILCHIMP_AUDIENCE_ID = "2e7d2ccbc6";
const MAILCHIMP_SERVER = "us22"; // Extracted from the API key (us22)

const MAILCHIMP_API_URL = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      });
    }

    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Subscribe the user to MailChimp
    const response = await fetch(MAILCHIMP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed", // Use 'pending' if you want double opt-in
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle already subscribed case gracefully
      if (response.status === 400 && data.title === "Member Exists") {
        return new Response(JSON.stringify({ 
          success: true, 
          message: "You're already subscribed! We'll keep you updated." 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      throw new Error(data.detail || "Failed to subscribe");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Successfully subscribed to the waitlist!" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "An error occurred while processing your request" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});