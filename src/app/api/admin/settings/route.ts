import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { settings } = await req.json();
    const supabase = createAdminClient();

    const upserts = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("settings")
      .upsert(upserts, { onConflict: "key" });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("settings").select("*");
    const settings: Record<string, string> = {};
    (data || []).forEach((row: { key: string; value: string }) => {
      settings[row.key] = row.value;
    });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
