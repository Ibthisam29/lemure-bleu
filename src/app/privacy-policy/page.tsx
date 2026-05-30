import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
export const metadata = { title: "Privacy Policy | Lemure Blue" };
export default function Page() {
  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-16" style={{ background:"var(--emerald)" }}>
        <div className="container">
          <p className="eyebrow mb-4" style={{ color:"rgba(196,150,90,0.7)" }}>Legal</p>
          <h1 className="display" style={{ fontSize:"clamp(2.5rem,5vw,4rem)", color:"var(--ivory)" }}>Privacy Policy</h1>
        </div>
      </section>
      <section className="section" style={{ background:"var(--ivory)" }}>
        <div className="container max-w-2xl">
          <p className="text-xs mb-10" style={{ color:"var(--champagne)", fontWeight:300 }}>Last updated: May 2026</p>
          <div className="space-y-10">
            <p className="text-sm leading-loose" style={{ color:"var(--warm-grey)", fontWeight:300 }}>
              Please contact hello@lemurebleu.com for the full legal document or any queries regarding this policy.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
