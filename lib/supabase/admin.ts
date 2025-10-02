import { createClient } from "@supabase/supabase-js"

/**
 * Creates a Supabase admin client that bypasses Row Level Security (RLS).
 * This should ONLY be used in server-side code for admin operations.
 *
 * IMPORTANT: Never expose the service role key to the client!
 */
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
