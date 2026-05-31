import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import VipForm from "@/components/ui/VipForm";

export const metadata = { title: "VIP Private Circle | Lemure Bleu" };

export default function VipPage() {
  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 relative overflow-hidden" style={{ background: "var(--emerald)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 70% at 70% 40%, rgba(196,150,90,0.07) 0%, transparent 60%)" }} />
        <div className="container relative z-10 text-center">
          <p className="eyebrow mb-6" style={{ color: "rgba(196,150,90,0.8)" }}>Exclusive Access</p>
          <h1 className="display mb-3" style={{ fontSize: "clamp(3rem,7vw,6rem)", color: "var(--ivory)" }}>Enter the</h1>
          <h1 className="display-italic mb-8" style={{ fontSize: "clamp(3rem,7vw,6rem)", color: "var(--champ-lt)" }}>Private Circle</h1>
          <span className="rule-champagne mx-auto block mb-8" style={{ opacity: 0.5 }} />
          <p className="text-sm leading-loose max-w-xl mx-auto" style={{ color: "rgba(247,242,232,0.55)", fontWeight: 300 }}>
            Gain early access to private gemstone previews, limited-edition jewellery drops, bespoke heirloom consultations, and auction invitations.
          </p>
        </div>
      </section>

      <section className="section-sm" style={{ background: "var(--ivory-deep)", borderBottom: "1px solid var(--stone)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "var(--stone)" }}>
            {[
              { title: "Stone Previews", desc: "Private access before public release" },
              { title: "VIP Drops", desc: "Limited-edition jewellery first" },
              { title: "Consultations", desc: "Bespoke heirloom priority" },
              { title: "Auctions", desc: "Invitation-only private access" },
            ].map((b) => (
              <div key={b.title} className="p-8 text-center" style={{ background: "var(--ivory)" }}>
                <h3 className="display text-xl mb-2" style={{ color: "var(--emerald)" }}>{b.title}</h3>
                <p className="text-xs leading-loose" style={{ color: "var(--warm-grey)", fontWeight: 300 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section relative overflow-hidden" style={{ background: "var(--emerald)" }}>
        <div className="container relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="display text-4xl mb-4" style={{ color: "var(--ivory)" }}>Request Private Access</h2>
              <span className="rule-champagne mx-auto block" style={{ opacity: 0.5 }} />
            </div>
            <VipForm dark />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
