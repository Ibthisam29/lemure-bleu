// SINGLE SOURCE OF TRUTH — no env var dependency for credentials
// Anon key is public/safe to commit. Service role key only used if explicitly valid.
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const URL  = "https://xiikmczdaehbnalmhpdd.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";

// Only use service role key if it's a real JWT (starts with eyJ)
function resolveKey(): string {
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (svcKey.startsWith("eyJ") && svcKey.length > 100) return svcKey;
  return ANON;
}

let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(URL, resolveKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _client;
}

export async function supabaseInsert(table: string, data: Record<string, unknown>): Promise<true> {
  const { error } = await getClient().from(table).insert(data);
  if (error) {
    console.error(`[supabaseInsert] ${table} error:`, error.code, error.message, error.hint);
    throw new Error(error.message || "Database insert failed");
  }
  return true;
}

// Legacy exports kept for compatibility
export const SUPABASE_URL = URL;
export const SUPABASE_ANON_KEY = ANON;
export const SUPABASE_SERVICE_KEY = "";
export const SUPABASE_WRITE_KEY = ANON;
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NZlZin-KeRGDvXvZrAjczQ_3SMKBf4Y";
