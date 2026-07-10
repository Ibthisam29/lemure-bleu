import { createClient, SupabaseClient } from "@supabase/supabase-js";

const URL  = "https://xiikmczdaehbnalmhpdd.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";

function resolveKey(): string {
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return (svc.startsWith("eyJ") && svc.length > 200) ? svc : ANON;
}

// Public browser client
export const supabase: SupabaseClient = createClient(URL, ANON);

// Server-side admin client
export function createAdminClient(): SupabaseClient {
  return createClient(URL, resolveKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
