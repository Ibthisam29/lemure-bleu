import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

function genInvoiceNumber(): string {
  const d = new Date();
  const yr = d.getFullYear().toString().slice(-2);
  const mo = String(d.getMonth()+1).padStart(2,"0");
  const rand = Math.floor(Math.random()*9000)+1000;
  return `LB${yr}${mo}-${rand}`;
}

export async function GET() {
  try {
    const { data } = await createAdminClient().from("invoices").select("*").order("created_at",{ascending:false});
    return NextResponse.json({ invoices: data||[] });
  } catch { return NextResponse.json({ invoices:[] }); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const invoice_number = genInvoiceNumber();
    const sb = createAdminClient();
    const { data, error } = await sb.from("invoices").insert({
      ...body,
      invoice_number,
      updated_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;

    // Auto-create purchase record
    if (data && body.line_items?.length > 0) {
      const items = body.line_items as {description:string;quantity:number;unit_price:number}[];
      for (const item of items) {
        await sb.from("purchases").insert({
          client_name: body.client_name,
          client_email: body.client_email,
          client_phone: body.client_phone,
          item_type: "custom",
          item_title: item.description,
          amount: item.quantity * item.unit_price,
          currency: body.currency || "SGD",
          payment_status: body.status === "paid" ? "paid" : "pending",
          invoice_id: data.id,
        });
      }
    }

    // Send invoice email
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lemurebleu.com";
      await resend.emails.send({
        from: "Lemure Bleu <noreply@lemurebleu.com>",
        to: body.client_email,
        subject: `Lemure Bleu Invoice #${invoice_number} — SGD ${body.total?.toLocaleString()}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F7F2E8;">
            <h1 style="font-size:28px;font-weight:300;color:#1C3D35;margin-bottom:8px;">Lemure Bleu</h1>
            <p style="color:#C4965A;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:24px;">Invoice #${invoice_number}</p>
            <p style="color:#555;line-height:1.8;margin-bottom:8px;">Dear ${body.client_name},</p>
            <p style="color:#555;line-height:1.8;margin-bottom:24px;">Please find your invoice below. Total due: <strong style="color:#1C3D35;">SGD ${body.total?.toLocaleString()}</strong></p>
            <a href="${siteUrl}/pay/${data.id}" style="display:inline-block;padding:14px 32px;background:#C4965A;color:white;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">View Invoice & Pay</a>
            ${body.due_date ? `<p style="color:#888;font-size:12px;margin-top:16px;">Due by: ${new Date(body.due_date).toLocaleDateString()}</p>` : ""}
            ${body.notes ? `<p style="color:#555;margin-top:16px;font-size:13px;">${body.notes}</p>` : ""}
            <p style="color:#aaa;font-size:11px;margin-top:40px;border-top:1px solid #D8D2C8;padding-top:20px;">Lemure Bleu · hello@lemurebleu.com</p>
          </div>
        `,
      });
    } catch { /* non-critical */ }

    return NextResponse.json({ invoice: data });
  } catch(e) { return NextResponse.json({ error: String(e) }, { status:500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const action = url.searchParams.get("action");
    const sb = createAdminClient();

    if (action === "mark_paid") {
      const { data, error } = await sb.from("invoices").update({ status:"paid", paid_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id",id!).select().single();
      if (error) throw error;
      // Update related purchases
      await sb.from("purchases").update({ payment_status:"paid" }).eq("invoice_id",id!);
      return NextResponse.json({ invoice: data });
    }

    const body = await req.json();
    const { data, error } = await sb.from("invoices").update({ ...body, updated_at: new Date().toISOString() }).eq("id",id!).select().single();
    if (error) throw error;
    return NextResponse.json({ invoice: data });
  } catch(e) { return NextResponse.json({ error: String(e) }, { status:500 }); }
}
