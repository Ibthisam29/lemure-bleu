import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "Refund Policy | Lemure Blue" };

export default function RefundPolicyPage() {
  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20" style={{ background: "var(--charcoal)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <p className="label-luxury mb-4" style={{ color: "rgba(184,138,114,0.7)" }}>Legal</p>
          <h1 className="heading-display text-4xl" style={{ color: "var(--ivory)" }}>Refund Policy</h1>
        </div>
      </section>
      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-sm mb-8" style={{ color: "var(--champagne)" }}>Last updated: {new Date().toLocaleDateString()}</p>

          {[
            {
              title: "1. Preorder Deposits",
              body: "VIP preorder deposits are refundable within 14 days of payment if no allocation has been initiated. After 14 days or upon allocation initiation, deposits are non-refundable. Refund requests must be submitted in writing to hello@lemurebleu.com.",
            },
            {
              title: "2. Non-Refundable Conditions",
              body: "Deposits are non-refundable once: (a) an allocation has been confirmed in writing; (b) a bespoke commission has been initiated; (c) sourcing costs have been incurred on behalf of the client.",
            },
            {
              title: "3. Refund Process",
              body: "Approved refunds are processed within 10 business days to the original payment method via Stripe. Lemure Blue is not responsible for delays caused by your financial institution.",
            },
            {
              title: "4. Bespoke & Commissioned Pieces",
              body: "Custom-made, commissioned, and bespoke jewellery pieces are non-refundable once production has commenced, as they are created to individual client specifications.",
            },
            {
              title: "5. Contact",
              body: "For refund requests or queries, contact: hello@lemurebleu.com · Lemure Blue, Singapore",
            },
          ].map((s) => (
            <div key={s.title} className="mb-8">
              <h2 className="heading-display text-xl mb-3" style={{ color: "var(--charcoal)" }}>{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(21,21,21,0.7)" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
