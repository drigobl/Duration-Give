# Admin Scripts

This directory contains administrative scripts for managing the Give Protocol platform.

## setup-admin.ts

A secure script to grant admin privileges to existing users.

### Prerequisites

1. You need the Supabase Service Role Key (not the anon key):
   - Go to your Supabase dashboard
   - Navigate to Settings > API
   - Copy the "service_role" key (keep this secret!)

2. Add the service role key to your `.env` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

### Usage

1. Install dependencies if needed:
   ```bash
   npm install
   ```

2. Run the script:
   ```bash
   npx tsx scripts/setup-admin.ts
   ```

3. Follow the prompts:
   - Enter the email address of the user you want to make admin
   - Confirm the action

4. The user will need to log out and log back in to see the admin panel.

### Security Notes

- **NEVER** commit the service role key to your repository
- This script bypasses Row Level Security (RLS) to update profiles
- Only run this script locally or in a secure environment
- Keep track of who has admin access

### Troubleshooting

If you get an error about missing environment variables:
1. Make sure your `.env` file exists in the project root
2. Ensure it contains both:
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

If the user is not found:
1. Make sure they have registered an account first
2. Check that their email is spelled correctly
3. Verify they have a profile in the database