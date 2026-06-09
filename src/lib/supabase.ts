import { createClient } from "@supabase/supabase-js";

// Hardcoded public fallback — anon key is safe to expose (browser-accessible already)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xiikmczdaehbnalmhpdd.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xiikmczdaehbnalmhpdd.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
