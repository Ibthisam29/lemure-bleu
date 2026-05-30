import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ collections: data });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("collections")
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ collection: data });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("collections")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ collection: data });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
