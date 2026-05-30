import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
export default function ThankYouPreorderPage() {
  return (
    <main>
      <Navigation />
      <section className="min-h-screen flex items-center justify-center" style={{ background:"var(--ivory)" }}>
        <div className="container text-center max-w-xl">
          <div className="w-16 h-16 rotate-45 mx-auto mb-10" style={{ border:"1px solid rgba(196,150,90,0.4)", background:"rgba(196,150,90,0.06)" }}>
            <div className="absolute inset-0 flex items-center justify-center -rotate-45">
              <span style={{ color:"var(--champagne)", fontSize:"1.3rem" }}>✓</span>
            </div>
          </div>
          <p className="eyebrow-dark mb-6">Preorder Confirmed</p>
          <h1 className="display mb-6" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--emerald)" }}>Your Preorder Has Been Received</h1>
          <span className="rule-champagne mx-auto block mb-8" />
          <p className="text-sm leading-loose mb-4" style={{ color:"var(--warm-grey)", fontWeight:300 }}>
            Thank you for placing your VIP preorder deposit. Your priority allocation request has been confirmed. Our team will contact you within 48 hours.
          </p>
          <p className="text-xs leading-loose mb-10" style={{ color:"var(--stone)", fontWeight:300 }}>
            This preorder does not guarantee financial return or gemstone appreciation. Allocations are subject to availability and client approval.
          </p>
          <a href="/" className="btn-outline-emerald">Return to Maison</a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
