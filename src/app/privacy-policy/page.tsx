import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "Privacy Policy | Lemure Blue" };

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20" style={{ background: "var(--charcoal)" }}>
        <div className="max-w-2xl mx-auto px-6">
          <p className="label-luxury mb-4" style={{ color: "rgba(184,138,114,0.7)" }}>Legal</p>
          <h1 className="heading-display text-4xl" style={{ color: "var(--ivory)" }}>Privacy Policy</h1>
        </div>
      </section>
      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-2xl mx-auto px-6 prose" style={{ color: "rgba(21,21,21,0.7)", lineHeight: "1.8" }}>
          <p className="text-sm mb-2" style={{ color: "var(--champagne)" }}>Last updated: {new Date().toLocaleDateString()}</p>

          {[
            {
              title: "1. Data We Collect",
              body: "We collect personal information you provide when registering for VIP access, booking appointments, or making preorder payments. This includes: full name, email address, phone number, country of residence, and communication preferences. Payment data is processed securely by Stripe and never stored on our servers.",
            },
            {
              title: "2. How We Use Your Data",
              body: "Your data is used to: respond to VIP registration requests; confirm and manage appointment bookings; process preorder payments via Stripe; send relevant communications about Lemure Blue collections, drops, and services you have expressed interest in.",
            },
            {
              title: "3. Marketing Communications",
              body: "By submitting a VIP registration, you consent to receive marketing communications and private-client updates. You may unsubscribe at any time by contacting us at hello@lemurebleu.com.",
            },
            {
              title: "4. Data Security",
              body: "All data is stored securely using Supabase with row-level security. Payment transactions are processed by Stripe with 256-bit SSL encryption. We do not share your personal data with third parties except as required to fulfil services (e.g., email delivery, payment processing).",
            },
            {
              title: "5. Your Rights",
              body: "You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us at hello@lemurebleu.com.",
            },
            {
              title: "6. Contact",
              body: "Lemure Blue (Lemurebleu.com) · Singapore · hello@lemurebleu.com",
            },
          ].map((s) => (
            <div key={s.title} className="mb-8">
              <h2 className="heading-display text-xl mb-3" style={{ color: "var(--charcoal)" }}>{s.title}</h2>
              <p className="text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
