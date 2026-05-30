import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import VipForm from "@/components/ui/VipForm";

export const metadata = {
  title: "VIP Private Circle | Lemure Blue",
  description: "Enter the Lemure Blue Private Circle for early access to rare gemstones and limited-edition jewellery.",
};

export default function VipPage() {
  return (
    <main>
      <Navigation />

      {/* Header */}
      <section
        className="pt-40 pb-20"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.9)" }}>
            Exclusive Access
          </p>
          <h1
            className="heading-display mb-6"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", color: "var(--ivory)" }}
          >
            Enter the Lemure Blue
            <br />
            <em>Private Circle</em>
          </h1>
          <div className="divider-champagne mx-auto mb-8" />
          <p className="text-base leading-relaxed" style={{ color: "rgba(248,243,234,0.65)" }}>
            Gain early access to private gemstone previews, limited-edition jewellery drops,
            bespoke heirloom consultations, and auction invitations.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16" style={{ background: "var(--charcoal)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ borderColor: "rgba(184,138,114,0.15)" }}>
            {[
              { title: "Stone Previews", desc: "Private access before public release" },
              { title: "VIP Drops", desc: "Limited-edition jewellery first access" },
              { title: "Consultations", desc: "Bespoke heirloom appointment priority" },
              { title: "Auctions", desc: "Invitation-only private auction access" },
            ].map((b) => (
              <div
                key={b.title}
                className="p-8 text-center"
                style={{ background: "rgba(248,243,234,0.03)", border: "1px solid rgba(184,138,114,0.1)" }}
              >
                <h3 className="heading-display text-xl mb-3" style={{ color: "var(--ivory)" }}>
                  {b.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(248,243,234,0.5)" }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section
        className="section-padding"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}
      >
        <div className="max-w-2xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="heading-display text-3xl mb-4" style={{ color: "var(--ivory)" }}>
              Request Private Access
            </h2>
          </div>
          <VipForm dark />
        </div>
      </section>

      <Footer />
    </main>
  );
}
