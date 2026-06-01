import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const { data } = await createAdminClient().from("products").select("*").order("sort_order").order("created_at",{ascending:false});
    return NextResponse.json({ products: data || [] });
  } catch { return NextResponse.json({ products:[] }); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await createAdminClient().from("products").insert({ ...body, updated_at: new Date().toISOString() }).select().single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch(e) { return NextResponse.json({ error: String(e) }, { status:500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    const body = await req.json();
    const { data, error } = await createAdminClient().from("products").update({ ...body, updated_at: new Date().toISOString() }).eq("id",id!).select().single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch(e) { return NextResponse.json({ error: String(e) }, { status:500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    const { error } = await createAdminClient().from("products").delete().eq("id",id!);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch(e) { return NextResponse.json({ error: String(e) }, { status:500 }); }
}
