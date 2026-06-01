import Link from "next/link";
import { notFound } from "next/navigation";

async function getInvoice(id: string) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("invoices").select("*").eq("id",id).single();
    return data;
  } catch { return null; }
}

const STATUS_COLOR: Record<string,string> = { draft:"#aaa", unpaid:"#C4963A", paid:"#3D8B5E", partial:"#7A5FA0", cancelled:"#8B3A3A" };

export default async function InvoiceDetailPage({ params }:{ params:{ id:string } }) {
  const invoice = await getInvoice(params.id);
  if (!invoice) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lemurebleu.com";
  const payUrl = `${siteUrl}/pay/${invoice.id}`;

  return (
    <div style={{ maxWidth:"800px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
        <div>
          <p style={{ fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#C4965A", marginBottom:"0.4rem" }}>Invoice</p>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2rem", fontWeight:300, color:"#1C3D35" }}>#{invoice.invoice_number}</h1>
        </div>
        <div style={{ display:"flex", gap:"0.75rem", alignItems:"center" }}>
          <span style={{ padding:"0.3rem 0.75rem", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:STATUS_COLOR[invoice.status], border:`1px solid ${STATUS_COLOR[invoice.status]}40`, background:`${STATUS_COLOR[invoice.status]}10` }}>
            {invoice.status}
          </span>
          <Link href={`/pay/${invoice.id}`} target="_blank"
            style={{ padding:"0.5rem 1.25rem", background:"#C4965A", color:"var(--ivory)", fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", textDecoration:"none", fontFamily:"Jost,sans-serif" }}>
            Open QR Payment Page
          </Link>
          <Link href="/admin/invoices/new"
            style={{ padding:"0.5rem 1.25rem", border:"1px solid var(--emerald)", color:"#1C3D35", fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", textDecoration:"none", fontFamily:"Jost,sans-serif" }}>
            New Invoice
          </Link>
        </div>
      </div>

      {/* Invoice card */}
      <div style={{ background:"#FFFFFF", border:"1px solid #CFC8BC", padding:"2.5rem", marginBottom:"1.25rem" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"2rem", paddingBottom:"1.5rem", borderBottom:"1px solid #CFC8BC" }}>
          <div>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.8rem", color:"#1C3D35", fontWeight:300 }}>Lemure Bleu</p>
            <p style={{ fontSize:"0.65rem", color:"#8C857A", fontWeight:300 }}>Private Jewellery Maison · Singapore</p>
            <p style={{ fontSize:"0.65rem", color:"#8C857A", fontWeight:300 }}>hello@lemurebleu.com</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:"0.65rem", color:"#8C857A", fontWeight:300 }}>Invoice #{invoice.invoice_number}</p>
            <p style={{ fontSize:"0.65rem", color:"#8C857A", fontWeight:300 }}>Issued: {new Date(invoice.created_at).toLocaleDateString()}</p>
            {invoice.due_date && <p style={{ fontSize:"0.65rem", color:"#C4965A", fontWeight:300 }}>Due: {new Date(invoice.due_date).toLocaleDateString()}</p>}
          </div>
        </div>

        {/* Client */}
        <div style={{ marginBottom:"2rem" }}>
          <p style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#8C857A", fontWeight:300, marginBottom:"0.5rem" }}>Billed To</p>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.2rem", color:"#1C3D35", fontWeight:300 }}>{invoice.client_name}</p>
          <p style={{ fontSize:"0.75rem", color:"#8C857A", fontWeight:300 }}>{invoice.client_email}</p>
          {invoice.client_phone && <p style={{ fontSize:"0.75rem", color:"#8C857A", fontWeight:300 }}>{invoice.client_phone}</p>}
        </div>

        {/* Line items */}
        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"1.5rem" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid #CFC8BC" }}>
              {["Description","Qty","Unit Price","Amount"].map(h=>(
                <th key={h} style={{ textAlign:h==="Amount"||h==="Unit Price"||h==="Qty"?"right":"left", padding:"0.5rem 0", fontSize:"0.55rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"#8C857A", fontWeight:300 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(invoice.line_items||[]).map((item:{description:string;quantity:number;unit_price:number}, i:number) => (
              <tr key={i} style={{ borderBottom:"1px solid rgba(216,210,200,0.4)" }}>
                <td style={{ padding:"0.75rem 0", fontSize:"0.82rem", color:"#1C3D35", fontWeight:300 }}>{item.description}</td>
                <td style={{ padding:"0.75rem 0", fontSize:"0.82rem", color:"#8C857A", fontWeight:300, textAlign:"right" }}>{item.quantity}</td>
                <td style={{ padding:"0.75rem 0", fontSize:"0.82rem", color:"#8C857A", fontWeight:300, textAlign:"right" }}>{invoice.currency} {item.unit_price?.toLocaleString()}</td>
                <td style={{ padding:"0.75rem 0", fontSize:"0.82rem", color:"#1C3D35", fontWeight:300, textAlign:"right" }}>{invoice.currency} {(item.quantity*item.unit_price)?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"0.4rem" }}>
          <div style={{ display:"flex", gap:"3rem" }}>
            <span style={{ fontSize:"0.75rem", color:"#8C857A", fontWeight:300 }}>Subtotal</span>
            <span style={{ fontSize:"0.85rem", color:"#1C3D35", fontWeight:300 }}>{invoice.currency} {invoice.subtotal?.toLocaleString()}</span>
          </div>
          {invoice.tax>0 && (
            <div style={{ display:"flex", gap:"3rem" }}>
              <span style={{ fontSize:"0.75rem", color:"#8C857A", fontWeight:300 }}>Tax</span>
              <span style={{ fontSize:"0.85rem", color:"#1C3D35", fontWeight:300 }}>{invoice.currency} {invoice.tax?.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display:"flex", gap:"3rem", paddingTop:"0.5rem", borderTop:"1px solid #CFC8BC", marginTop:"0.25rem" }}>
            <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1rem", color:"#1C3D35" }}>Total</span>
            <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.5rem", color:"#C4965A" }}>{invoice.currency} {invoice.total?.toLocaleString()}</span>
          </div>
        </div>

        {invoice.notes && (
          <div style={{ marginTop:"1.5rem", paddingTop:"1rem", borderTop:"1px solid #CFC8BC" }}>
            <p style={{ fontSize:"0.65rem", color:"#8C857A", fontWeight:300, lineHeight:1.7 }}>{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* QR Payment link */}
      <div style={{ background:"#FFFFFF", border:"1px solid rgba(196,150,90,0.3)", padding:"1.75rem" }}>
        <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:"#1C3D35", marginBottom:"0.75rem" }}>Payment Page</p>
        <p style={{ fontSize:"0.72rem", color:"#8C857A", fontWeight:300, marginBottom:"1rem" }}>
          Share this link with your client. It shows the invoice and QR code for payment.
        </p>
        <div style={{ display:"flex", gap:"1rem", alignItems:"center", flexWrap:"wrap" }}>
          <code style={{ fontSize:"0.72rem", color:"#1C3D35", background:"#F7F2E8", padding:"0.5rem 1rem", border:"1px solid #CFC8BC", fontFamily:"monospace", flexShrink:1, wordBreak:"break-all" }}>
            {payUrl}
          </code>
          <Link href={`/pay/${invoice.id}`} target="_blank"
            style={{ padding:"0.5rem 1.25rem", background:"#1C3D35", color:"var(--ivory)", fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", textDecoration:"none", fontFamily:"Jost,sans-serif", flexShrink:0 }}>
            Open ↗
          </Link>
        </div>
      </div>

      {/* Mark paid */}
      {invoice.status !== "paid" && (
        <MarkPaidButton invoiceId={invoice.id} />
      )}
    </div>
  );
}

function MarkPaidButton({ invoiceId }:{ invoiceId:string }) {
  return (
    <form action={`/api/admin/invoices?id=${invoiceId}&action=mark_paid`} method="POST" style={{ marginTop:"1.25rem" }}>
      <button type="submit" style={{ padding:"0.75rem 2rem", background:"#3D8B5E", color:"white", fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>
        ✓ Mark as Paid
      </button>
    </form>
  );
}
