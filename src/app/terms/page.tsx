import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "Terms & Conditions | Lemure Blue" };

export default function TermsPage() {
  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20" style={{ background: "var(--charcoal)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <p className="label-luxury mb-4" style={{ color: "rgba(184,138,114,0.7)" }}>Legal</p>
          <h1 className="heading-display text-4xl" style={{ color: "var(--ivory)" }}>Terms & Conditions</h1>
        </div>
      </section>
      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-sm mb-8" style={{ color: "var(--champagne)" }}>Last updated: {new Date().toLocaleDateString()}</p>

          {[
            {
              title: "1. Website Use",
              body: "By accessing Lemurebleu.com, you agree to these terms. All content is for informational purposes and does not constitute financial advice or investment recommendation.",
            },
            {
              title: "2. VIP Registration",
              body: "Submitting a VIP registration expresses interest in Lemure Blue services. Registration does not guarantee allocation, appointment, or purchase. Lemure Blue reserves the right to decline any registration.",
            },
            {
              title: "3. Preorder Terms",
              body: "VIP preorder deposits provide priority access to future gemstone or jewellery allocations. Preorders are not guaranteed allocations. Final specifications, gemstone type, quality, and value may vary. Lemure Blue will notify clients before confirming any allocation.",
            },
            {
              title: "4. Gemstone Disclaimer",
              body: "Lemure Blue provides access to collectible gemstones and bespoke jewellery. Gemstones are not guaranteed financial investments. Lemure Blue does not guarantee appreciation, resale value, liquidity, profit, or investment return.",
            },
            {
              title: "5. Appointment Terms",
              body: "Appointment requests are subject to availability and confirmation by Lemure Blue. Private appointments are conducted in good faith. Lemure Blue reserves the right to reschedule or decline appointments.",
            },
            {
              title: "6. Cancellation Policy",
              body: "Clients may cancel appointment requests at any time before confirmation. Preorder deposit cancellations and refunds are governed by the Refund Policy.",
            },
            {
              title: "7. Governing Law",
              body: "These terms are governed by the laws of Singapore. Disputes shall be resolved in Singapore courts.",
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
