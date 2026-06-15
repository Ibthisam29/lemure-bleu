import { notFound } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

async function getInvoice(id: string) {
  try {
    
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("invoices").select("*").eq("id",id).single();
    return data;
  } catch { return null; }
}

export default async function PaymentPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoice(params.id);
  if (!invoice) notFound();

  const isPaid = invoice.status === "paid";
  // QR code pointing to PayNow/bank — use qr_payload if set, else show manual
  const qrUrl = invoice.qr_payload || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`PAY SGD ${invoice.total} TO LEMURE BLEU | INV#${invoice.invoice_number} | ${invoice.client_name}`)}`;

  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 text-center" style={{ background:"var(--emerald)" }}>
        <div className="container" style={{ maxWidth:"560px" }}>
          <p className="eyebrow mb-4" style={{ color:"rgba(196,150,90,0.8)" }}>Secure Payment</p>
          <h1 className="display mb-2" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--ivory)" }}>Payment Request</h1>
          <p style={{ fontSize:"0.75rem", color:"rgba(247,242,232,0.5)", fontWeight:300 }}>Invoice #{invoice.invoice_number}</p>
        </div>
      </section>

      <section className="section" style={{ background:"var(--ivory-deep)" }}>
        <div style={{ maxWidth:"560px", margin:"0 auto", padding:"0 1.5rem" }}>

          {/* Client & order summary */}
          <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", padding:"2rem", marginBottom:"1.25rem" }}>
            <p style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300, marginBottom:"1rem" }}>Order Summary</p>

            <div style={{ marginBottom:"1.25rem", paddingBottom:"1rem", borderBottom:"1px solid var(--stone)" }}>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.3rem", color:"var(--emerald)", fontWeight:300 }}>{invoice.client_name}</p>
              <p style={{ fontSize:"0.72rem", color:"var(--warm-grey)", fontWeight:300 }}>{invoice.client_email}</p>
            </div>

            {/* Line items */}
            <div style={{ marginBottom:"1.25rem" }}>
              {(invoice.line_items||[]).map((item:{description:string;quantity:number;unit_price:number}, i:number) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"0.6rem 0", borderBottom:"1px solid rgba(216,210,200,0.4)" }}>
                  <div>
                    <p style={{ fontSize:"0.82rem", color:"var(--emerald)", fontWeight:300 }}>{item.description}</p>
                    {item.quantity > 1 && <p style={{ fontSize:"0.65rem", color:"var(--warm-grey)", fontWeight:300 }}>Qty: {item.quantity}</p>}
                  </div>
                  <p style={{ fontSize:"0.85rem", color:"var(--emerald)", fontWeight:300, flexShrink:0 }}>
                    {invoice.currency} {(item.quantity*item.unit_price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            {invoice.tax > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.4rem" }}>
                <span style={{ fontSize:"0.72rem", color:"var(--warm-grey)", fontWeight:300 }}>GST</span>
                <span style={{ fontSize:"0.75rem", color:"var(--warm-grey)", fontWeight:300 }}>{invoice.currency} {invoice.tax?.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"0.75rem", borderTop:"1px solid var(--stone)" }}>
              <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1rem", color:"var(--emerald)" }}>Total Due</span>
              <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.5rem", color:"var(--champagne)" }}>
                {invoice.currency} {invoice.total?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment section */}
          {isPaid ? (
            <div style={{ background:"var(--ivory)", border:"1px solid #3D8B5E40", padding:"2rem", textAlign:"center" }}>
              <div style={{ width:"48px", height:"48px", borderRadius:"50%", background:"#3D8B5E20", border:"1px solid #3D8B5E", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem" }}>
                <span style={{ color:"#3D8B5E", fontSize:"1.2rem" }}>✓</span>
              </div>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.3rem", color:"#3D8B5E", marginBottom:"0.5rem" }}>Payment Received</p>
              <p style={{ fontSize:"0.72rem", color:"var(--warm-grey)", fontWeight:300 }}>Thank you. Your payment has been confirmed.</p>
            </div>
          ) : (
            <div style={{ background:"var(--ivory)", border:"1px solid var(--stone)", padding:"2rem" }}>
              <p style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300, marginBottom:"1.5rem", textAlign:"center" }}>
                Scan to Pay via PayNow / Bank Transfer
              </p>

              {/* QR Code */}
              <div style={{ display:"flex", justifyContent:"center", marginBottom:"1.5rem" }}>
                <div style={{ padding:"1rem", border:"1px solid var(--stone)", background:"white", display:"inline-block" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt="Payment QR Code"
                    width={180}
                    height={180}
                    style={{ display:"block" }}
                  />
                </div>
              </div>

              {/* Payment reference */}
              <div style={{ background:"var(--ivory-deep)", border:"1px solid var(--stone)", padding:"1.25rem", textAlign:"center", marginBottom:"1.25rem" }}>
                <p style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--warm-grey)", fontWeight:300, marginBottom:"0.5rem" }}>Payment Reference</p>
                <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.2rem", color:"var(--emerald)" }}>INV#{invoice.invoice_number}</p>
                <p style={{ fontSize:"0.7rem", color:"var(--warm-grey)", fontWeight:300, marginTop:"0.25rem" }}>
                  {invoice.currency} {invoice.total?.toLocaleString()} · {invoice.client_name}
                </p>
              </div>

              <p style={{ fontSize:"0.65rem", color:"var(--warm-grey)", fontWeight:300, textAlign:"center", lineHeight:1.7 }}>
                After payment, send proof to{" "}
                <a href="mailto:hello@lemurebleu.com" style={{ color:"var(--champagne)" }}>hello@lemurebleu.com</a>
                {" "}or WhatsApp our concierge. Your payment will be confirmed within 1 business day.
              </p>

              {invoice.due_date && (
                <p style={{ fontSize:"0.65rem", color:"var(--champagne)", fontWeight:300, textAlign:"center", marginTop:"0.75rem" }}>
                  Due by: {new Date(invoice.due_date).toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"})}
                </p>
              )}
            </div>
          )}

          {invoice.notes && (
            <div style={{ padding:"1.25rem", marginTop:"1rem" }}>
              <p style={{ fontSize:"0.65rem", color:"var(--warm-grey)", fontWeight:300, lineHeight:1.8, textAlign:"center" }}>{invoice.notes}</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
