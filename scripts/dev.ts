#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env --allow-net

import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { serveDir } from "https://deno.land/std@0.220.1/http/file_server.ts";

const PORT = parseInt(Deno.env.get("PORT") || "5173");

console.log(`Development server running on http://localhost:${PORT}`);

// For development, serve the static files from the src directory
await serve(async (req) => {
  const url = new URL(req.url);
  
  // API routes would go here
  if (url.pathname.startsWith("/api/")) {
    return new Response("API endpoint", { status: 200 });
  }
  
  // Serve static files from the src directory
  return serveDir(req, {
    fsRoot: ".",
    urlRoot: "",
    showDirListing: false,
    enableCors: true,
  });
}, { port: PORT });