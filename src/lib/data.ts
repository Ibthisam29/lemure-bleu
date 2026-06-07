// Central data fetching — all frontend pages use these functions
// Falls back to sample data if Supabase unavailable

import { createAdminClient } from "./supabase";

export async function getSectionContent(key: string) {
  try {
    const { data } = await createAdminClient()
      .from("site_sections")
      .select("*")
      .eq("section_key", key)
      .single();
    return data;
  } catch { return null; }
}

export async function getAllSections() {
  try {
    const { data } = await createAdminClient()
      .from("site_sections")
      .select("*")
      .eq("visible", true);
    const map: Record<string, { title: string; subtitle: string; body: string; visible: boolean }> = {};
    (data || []).forEach((s: { section_key: string; title: string; subtitle: string; body: string; visible: boolean }) => { map[s.section_key] = s; });
    return map;
  } catch { return {}; }
}

export async function getFeaturedProducts() {
  try {
    const { data } = await createAdminClient()
      .from("products")
      .select("*")
      .eq("visible", true)
      .order("featured", { ascending: false })
      .order("sort_order")
      .limit(6);
    return data || [];
  } catch { return []; }
}

export async function getAllProducts() {
  try {
    const { data } = await createAdminClient()
      .from("products")
      .select("*")
      .eq("visible", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    return data || [];
  } catch { return []; }
}

export async function getVisibleStones() {
  try {
    const { data } = await createAdminClient()
      .from("stones")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  } catch { return []; }
}

export async function getPublishedCollections() {
  try {
    const { data } = await createAdminClient()
      .from("collections")
      .select("*")
      .eq("status", "published")
      .order("launch_date", { ascending: false });
    return data || [];
  } catch { return []; }
}

export async function getEvents() {
  try {
    const { data } = await createAdminClient()
      .from("events")
      .select("*")
      .eq("visible", true)
      .order("event_date");
    return data || [];
  } catch { return []; }
}

export async function getAds(position: string) {
  try {
    const { data } = await createAdminClient()
      .from("ads")
      .select("*")
      .eq("visible", true)
      .eq("position", position)
      .order("sort_order");
    return data || [];
  } catch { return []; }
}
