import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function PreorderCancelledPage() {
  return (
    <main>
      <Navigation />
      <section
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--charcoal)" }}
      >
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.7)" }}>
            Payment Cancelled
          </p>
          <h1 className="heading-display mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--ivory)" }}>
            Your preorder was not completed.
          </h1>
          <div className="divider-champagne mx-auto mb-8" />
          <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(248,243,234,0.55)" }}>
            No payment has been taken. You may return to try again or contact our concierge for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vip-preorder" className="btn-primary">Try Again</Link>
            <Link href="/appointment" className="btn-outline">Contact Concierge</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
