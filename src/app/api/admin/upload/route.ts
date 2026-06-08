import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "image";
    const linkedTo = (formData.get("linked_to") as string) || null;
    if (!file) return NextResponse.json({ error:"No file" },{status:400});

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${type}s/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bucket = "lemure-media";
    const sb = createAdminClient();

    // Create bucket if not exists
    await sb.storage.createBucket(bucket,{public:true,allowedMimeTypes:["image/*","video/*"]}).catch(()=>{});

    const buf = await file.arrayBuffer();
    const { error: uploadError } = await sb.storage.from(bucket).upload(filename, buf, { contentType:file.type, upsert:false });
    if (uploadError) throw uploadError;

    const { data: urlData } = sb.storage.from(bucket).getPublicUrl(filename);

    // Save to media table
    const { data: mediaRow } = await sb.from("media").insert({
      filename: file.name,
      url: urlData.publicUrl,
      type,
      size_bytes: file.size,
      linked_to: linkedTo,
    }).select("id").single();

    return NextResponse.json({ url:urlData.publicUrl, id:mediaRow?.id });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error:String(e) },{status:500});
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error:"No id" },{status:400});
    const sb = createAdminClient();
    const { data } = await sb.from("media").select("url").eq("id",id).single();
    if (data?.url) {
      const path = data.url.split("/lemure-media/")[1];
      if (path) await sb.storage.from("lemure-media").remove([path]);
    }
    await sb.from("media").delete().eq("id",id);
    return NextResponse.json({ success:true });
  } catch (e) {
    return NextResponse.json({ error:String(e) },{status:500});
  }
}
