// Supabase credentials — hardcoded fallbacks so forms work without Vercel env vars
import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://xiikmczdaehbnalmhpdd.supabase.co";

// Both keys — new publishable + legacy anon
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NZlZin-KeRGDvXvZrAjczQ_3SMKBf4Y";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";

// Use publishable key for all client operations
function getClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || SUPABASE_ANON_KEY;
  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function supabaseInsert(table: string, data: Record<string, unknown>) {
  const sb = getClient();
  const { error } = await sb.from(table).insert(data);
  if (error) {
    console.error(`supabaseInsert error on ${table}:`, JSON.stringify(error));
    throw new Error(`Supabase error ${error.code}: ${error.message}`);
  }
  return true;
}
