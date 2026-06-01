import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const { data } = await createAdminClient().from("purchases").select("*").order("created_at",{ascending:false});
    return NextResponse.json({ purchases: data||[] });
  } catch { return NextResponse.json({ purchases:[] }); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await createAdminClient().from("purchases").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ purchase: data });
  } catch(e) { return NextResponse.json({ error: String(e) }, { status:500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    const body = await req.json();
    const { data, error } = await createAdminClient().from("purchases").update(body).eq("id",id!).select().single();
    if (error) throw error;
    return NextResponse.json({ purchase: data });
  } catch(e) { return NextResponse.json({ error: String(e) }, { status:500 }); }
}
