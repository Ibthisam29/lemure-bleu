import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function ThankYouPreorderPage() {
  return (
    <main>
      <Navigation />
      <section
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}
      >
        <div className="max-w-xl mx-auto px-6 text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-8 mx-auto"
            style={{ border: "1px solid rgba(184,138,114,0.4)", background: "rgba(184,138,114,0.1)" }}
          >
            <span className="heading-display text-xl" style={{ color: "var(--champagne)" }}>✓</span>
          </div>
          <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.9)" }}>
            Preorder Confirmed
          </p>
          <h1 className="heading-display mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--ivory)" }}>
            Your Preorder Has Been Received
          </h1>
          <div className="divider-champagne mx-auto mb-8" />
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(248,243,234,0.65)" }}>
            Thank you for placing your VIP preorder deposit. Your priority allocation request has been confirmed.
            Our team will contact you within 48 hours regarding your next steps.
          </p>
          <p className="text-xs leading-relaxed mb-10" style={{ color: "rgba(248,243,234,0.4)" }}>
            A confirmation email has been sent. This preorder does not guarantee financial return or
            gemstone appreciation. Allocations are subject to availability and client approval.
          </p>
          <Link href="/" className="btn-outline">
            Return to Maison
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
