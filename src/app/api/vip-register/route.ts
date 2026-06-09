import { NextRequest, NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabaseConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, phone, country, preferred_contact, interest_type, budget_range, message } = body;

    if (!full_name || !email || !phone || !country) {
      return NextResponse.json({ error: "Please fill in Name, Email, Phone and Country." }, { status: 400 });
    }

    await supabaseInsert("vip_leads", {
      full_name, email, phone, country,
      preferred_contact: preferred_contact || null,
      interest_type: interest_type || null,
      budget_range: budget_range || null,
      message: message || null,
      status: "new",
    });

    // Email — never blocks the response
    try {
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const promises = [
          resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: email,
            subject: "Your Lemure Bleu VIP Request Has Been Received",
            html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;"><h1 style="font-size:26px;font-weight:300;color:#1C3D35;margin-bottom:12px;">Welcome, ${full_name}</h1><p style="color:#C4965A;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:20px;">Lemure Bleu · Private Jewellery Maison</p><p style="color:#555;line-height:1.8;margin-bottom:20px;">Thank you for requesting private access. Our concierge will review your request and contact you shortly.</p><p style="color:#aaa;font-size:12px;margin-top:40px;border-top:1px solid #CFC8BC;padding-top:20px;">Lemurebleu.com · Singapore</p></div>`,
          }),
        ];
        if (process.env.ADMIN_EMAIL) {
          promises.push(resend.emails.send({
            from: "Lemure Bleu <noreply@lemurebleu.com>",
            to: process.env.ADMIN_EMAIL,
            subject: `New VIP Lead: ${full_name}`,
            html: `<p><b>New VIP lead on lemurebleu.com</b></p><p>Name: ${full_name}<br>Email: ${email}<br>Phone: ${phone}<br>Country: ${country}<br>Interest: ${interest_type}<br>Budget: ${budget_range}</p><p><a href="https://lemurebleu.com/admin/leads">View in Admin →</a></p>`,
          }));
        }
        await Promise.allSettled(promises);
      }
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VIP register error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to save: ${msg}` }, { status: 500 });
  }
}
