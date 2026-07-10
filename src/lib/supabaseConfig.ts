/**
 * Supabase client config — single source of truth.
 *
 * The ANON key is intentionally hardcoded as a fallback:
 *  - It is a PUBLIC key (safe to expose — identical to what browsers receive)
 *  - RLS policies control what anon can/cannot access
 *  - Service role key is NEVER hardcoded — lives only in Vercel env vars
 *
 * Security model:
 *  - /api/admin/* routes: protected by Basic Auth middleware (ADMIN_PASSWORD)
 *  - /admin/* pages:      protected by Basic Auth middleware (ADMIN_PASSWORD)
 *  - Public form APIs:    anon insert only, RLS WITH CHECK (true)
 *  - Admin DB operations: service_role key (env var only) bypasses RLS
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://xiikmczdaehbnalmhpdd.supabase.co";
// Public anon key — safe to commit (read-only by default, RLS enforced)
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";

/** Validate a key before use — prevents garbage env vars causing 401s */
function resolveKey(): string {
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  // Service role JWTs are always eyJ... and >200 chars
  return (svc.startsWith("eyJ") && svc.length > 200) ? svc : SUPABASE_ANON;
}

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(SUPABASE_URL, resolveKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _client;
}

export async function supabaseInsert(
  table: string,
  data: Record<string, unknown>
): Promise<true> {
  const { error } = await getClient().from(table).insert(data);
  if (error) {
    console.error(`[supabaseInsert:${table}]`, error.code, error.message);
    throw new Error(error.message || "Database insert failed");
  }
  return true;
}

// Named exports for legacy compat
export { SUPABASE_URL, SUPABASE_ANON as SUPABASE_ANON_KEY };
