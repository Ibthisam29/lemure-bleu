import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
export default function PreorderCancelledPage() {
  return (
    <main>
      <Navigation />
      <section className="min-h-screen flex items-center justify-center" style={{ background:"var(--ivory)" }}>
        <div className="container text-center max-w-xl">
          <p className="eyebrow-dark mb-6">Payment Cancelled</p>
          <h1 className="display mb-6" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--emerald)" }}>Your preorder was not completed.</h1>
          <span className="rule-champagne mx-auto block mb-8" />
          <p className="text-sm leading-loose mb-10" style={{ color:"var(--warm-grey)", fontWeight:300 }}>No payment has been taken. You may return to try again or contact our concierge for assistance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/vip-preorder" className="btn-gold">Try Again</a>
            <a href="/appointment" className="btn-outline-emerald">Contact Concierge</a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
