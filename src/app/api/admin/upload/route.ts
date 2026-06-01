import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "image";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = file.name.split(".").pop();
    const filename = `${type}s/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bucket = "lemure-media";

    const sb = createAdminClient();

    // Ensure bucket exists
    await sb.storage.createBucket(bucket, { public: true }).catch(() => {});

    const arrayBuffer = await file.arrayBuffer();
    const { error } = await sb.storage.from(bucket).upload(filename, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) throw error;

    const { data: urlData } = sb.storage.from(bucket).getPublicUrl(filename);

    // Save to media library
    await sb.from("media").insert({
      filename: file.name,
      url: urlData.publicUrl,
      type,
      size_bytes: file.size,
    });

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
