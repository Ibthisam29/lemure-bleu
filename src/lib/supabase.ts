import { createClient } from "@supabase/supabase-js";

// Public keys hardcoded as fallback — anon key is browser-safe
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || "https://xiikmczdaehbnalmhpdd.supabase.co";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";

// Browser client — uses anon key, respects RLS
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// Server client — uses service_role when available, else anon
// RLS policies are set to allow anon for all admin operations as fallback
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON;
  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
