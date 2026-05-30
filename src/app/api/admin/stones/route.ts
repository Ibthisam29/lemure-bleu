import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("stones")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ stones: data });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch stones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("stones")
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ stone: data });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create stone" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("stones")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ stone: data });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update stone" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const supabase = createAdminClient();
    const { error } = await supabase.from("stones").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete stone" }, { status: 500 });
  }
}
