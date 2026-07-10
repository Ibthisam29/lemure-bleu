import { createClient } from "@supabase/supabase-js";

const URL  = "https://xiikmczdaehbnalmhpdd.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaWttY3pkYWVoYm5hbG1ocGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTAzNjEsImV4cCI6MjA5NTcyNjM2MX0.crMSW0eIghUBa6-E4_ojEDKmAxgFmtbkoIXOYGA3ifI";

const db = () => createClient(URL, ANON);

export async function getSectionContent(key: string) {
  try { const { data } = await db().from("site_sections").select("*").eq("section_key", key).eq("visible", true).single(); return data; }
  catch { return null; }
}
export async function getAllSections() {
  try {
    const { data } = await db().from("site_sections").select("*").eq("visible", true);
    const map: Record<string, { section_key: string; title: string; subtitle: string; body: string; visible: boolean }> = {};
    (data || []).forEach((s: Record<string, string>) => { map[s.section_key] = s as unknown as { section_key: string; title: string; subtitle: string; body: string; visible: boolean }; });
    return map;
  } catch { return {}; }
}
export async function getFeaturedProducts() {
  try { const { data } = await db().from("products").select("*").eq("visible", true).limit(6); return data || []; }
  catch { return []; }
}
export async function getAllProducts() {
  try { const { data } = await db().from("products").select("*").eq("visible", true).order("created_at", { ascending: false }); return data || []; }
  catch { return []; }
}
export async function getVisibleStones() {
  try { const { data } = await db().from("stones").select("*").order("created_at", { ascending: false }); return data || []; }
  catch { return []; }
}
export async function getPublishedCollections() {
  try { const { data } = await db().from("collections").select("*").eq("status", "published"); return data || []; }
  catch { return []; }
}
export async function getEvents() {
  try { const { data } = await db().from("events").select("*").eq("visible", true).order("event_date"); return data || []; }
  catch { return []; }
}
export async function getAds(position: string) {
  try { const { data } = await db().from("ads").select("*").eq("visible", true).eq("position", position); return data || []; }
  catch { return []; }
}
