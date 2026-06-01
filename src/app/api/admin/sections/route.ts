import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const { data } = await createAdminClient().from("site_sections").select("*").order("section_key");
    return NextResponse.json({ sections: data || [] });
  } catch { return NextResponse.json({ sections:[] }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    const body = await req.json();
    const { data, error } = await createAdminClient().from("site_sections").update({ ...body, updated_at: new Date().toISOString() }).eq("id",id!).select().single();
    if (error) throw error;
    return NextResponse.json({ section: data });
  } catch(e) { return NextResponse.json({ error: String(e) }, { status:500 }); }
}
