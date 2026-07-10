import { NextRequest, NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabaseConfig";

const JOTFORM_WAITLIST_ID = "261890336888069";

async function submitToJotform(formId: string, data: Record<string, string>) {
  try {
    const body = new URLSearchParams();
    const map: Record<string, string> = {
      full_name:          "q2_fullName",
      email:              "q3_emailAddress",
      phone:              "q4_mobileWhatsapp",
      country_city:       "q5_countryCity",
      social_profile:     "q6_instagramOr",
      guest_category:     "q7_guestCategory",
      interests:          "q8_whatAre",
      attendance_type:    "q9_preferredAttendance",
      purchase_interest:  "q10_approximatePurchaseinvestment",
      open_to_appointment:"q11_areYou",
      referral_source:    "q12_howDid",
      message:            "q13_shortMessage",
    };
    for (const [k, jKey] of Object.entries(map)) {
      if (data[k]) body.append(`submission[${jKey}]`, data[k]);
    }
    await fetch(`https://api.jotform.com/form/${formId}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "APIKEY": process.env.JOTFORM_API_KEY || "" },
      body: body.toString(),
    });
  } catch (e) {
    console.warn("[waitlist] Jotform submit failed (non-critical):", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: Record<string, string> = await req.json();
    const { full_name, email, phone, country_city, guest_category } = data;

    if (!full_name || !email || !phone || !country_city || !guest_category) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    // 1. Save to Supabase
    await supabaseInsert("guest_waitlist", {
      full_name, email, phone, country_city,
      social_profile:     data.social_profile      || null,
      guest_category,
      interests:          data.interests            || null,
      attendance_type:    data.attendance_type      || null,
      purchase_interest:  data.purchase_interest    || null,
      open_to_appointment:data.open_to_appointment  || null,
      referral_source:    data.referral_source      || null,
      message:            data.message              || null,
      status: "new",
    });

    // 2. Mirror to Jotform
    await submitToJotform(JOTFORM_WAITLIST_ID, data);

    // 3. Admin email
    try {
      if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
        const { Resend } = await import("resend");
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: "Lemuré Bleu <noreply@lemurebleu.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `New Waitlist Guest: ${full_name} — ${guest_category}`,
          html: `<p><b>New guest waitlist registration</b><br>Name: ${full_name}<br>Email: ${email}<br>Phone: ${phone}<br>Category: ${guest_category}<br>Country: ${country_city}<br>Interests: ${data.interests||"—"}<br>Budget: ${data.purchase_interest||"—"}</p><p><a href="https://lemurebleu.com/admin/waitlist">View in Admin →</a></p>`,
        });
      }
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Submission failed";
    console.error("[waitlist-register]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
