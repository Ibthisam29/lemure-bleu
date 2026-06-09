// Public Supabase credentials — safe to commit (anon key, read-only by default)
// Service role key stays in Vercel env vars only
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xiikmczdaehbnalmhpdd.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Use service key if available, else anon key
export const SUPABASE_WRITE_KEY = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

export async function supabaseInsert(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_WRITE_KEY,
      "Authorization": `Bearer ${SUPABASE_WRITE_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase error ${res.status}: ${txt}`);
  }
  return true;
}
