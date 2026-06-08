import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const sb = createAdminClient();
    const { data } = await sb.from("site_sections").select("*").in("section_key",["hero","trust_bar","hero_media"]);
    const map: Record<string,unknown> = {};
    (data||[]).forEach((s:{section_key:string}) => { map[s.section_key] = s; });
    // Get hero media
    const { data: media } = await sb.from("media").select("*").eq("linked_to","hero").order("created_at",{ascending:false});
    return NextResponse.json({ sections: map, media: media||[] });
  } catch(e) { return NextResponse.json({ error:String(e) },{status:500}); }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { section_key, ...fields } = body;
    const sb = createAdminClient();
    const { data, error } = await sb.from("site_sections")
      .upsert({ section_key, ...fields, updated_at: new Date().toISOString() }, { onConflict:"section_key" })
      .select().single();
    if (error) throw error;
    // Trigger revalidation
    try { await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({path:"/"}) }); } catch {}
    return NextResponse.json({ section: data });
  } catch(e) { return NextResponse.json({ error:String(e) },{status:500}); }
}
