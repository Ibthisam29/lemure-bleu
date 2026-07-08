import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://xiikmczdaehbnalmhpdd.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";

function resolveKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || SUPABASE_ANON;
}

// Browser anon client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// Server client (service_role if available, else anon)
export function createAdminClient() {
  return createClient(SUPABASE_URL, resolveKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
