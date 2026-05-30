import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import VipForm from "@/components/ui/VipForm";
import Link from "next/link";

const STONES = [
  { name: "Blue Sapphire", origin: "Kashmir, India", carat: "5.2 ct", colour: "#1a3a5c" },
  { name: "Colombian Emerald", origin: "Muzo, Colombia", carat: "3.8 ct", colour: "#1a4a2e" },
  { name: "Burmese Ruby", origin: "Mogok, Myanmar", carat: "2.4 ct", colour: "#8b1a2a" },
  { name: "Mahenge Spinel", origin: "Tanzania", carat: "4.1 ct", colour: "#9b3060" },
  { name: "Tanzanite", origin: "Merelani Hills, Tanzania", carat: "7.6 ct", colour: "#3d2060" },
  { name: "Paraíba Tourmaline", origin: "Brazil", carat: "1.9 ct", colour: "#007d8c" },
];

const TRUST_ITEMS = [
  "Bespoke Jewellery",
  "Rare Gemstones",
  "Private Appointments",
  "Limited Editions",
  "Heirloom Redesign",
  "VIP Preorders",
];

export default function HomePage() {
  return (
    <main>
      <Navigation />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 50%, #001828 100%)" }}
      >
        {/* Ambient orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 70% 40%, rgba(184,138,114,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 20% 70%, rgba(0,63,79,0.8) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center pt-32 pb-20">
          {/* Monogram */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-8 mx-auto"
            style={{
              border: "1px solid rgba(184,138,114,0.4)",
              background: "rgba(184,138,114,0.08)",
            }}
          >
            <span
              className="heading-display text-xl"
              style={{ color: "var(--champagne)" }}
            >
              L
            </span>
          </div>

          <p className="label-luxury mb-6" style={{ color: "rgba(184,138,114,0.9)" }}>
            Private Jewellery Maison · Est. Singapore
          </p>

          <h1
            className="heading-display mb-6"
            style={{
              color: "var(--ivory)",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
            }}
          >
            Rare Gems.
            <br />
            <em>Refined Legacy.</em>
          </h1>

          <div className="divider-champagne mx-auto mb-8" />

          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: "rgba(248,243,234,0.65)", fontFamily: "var(--font-body)" }}
          >
            A private jewellery maison for bespoke heirlooms, limited-edition gemstone pieces,
            and collectible rare stone ownership.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/vip" className="btn-primary">
              Join VIP List
            </Link>
            <Link href="/appointment" className="btn-outline">
              Book Private Appointment
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div
            className="w-px h-12 animate-pulse"
            style={{ background: "linear-gradient(to bottom, transparent, var(--champagne))" }}
          />
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section
        className="py-5 overflow-hidden"
        style={{ background: "var(--charcoal)", borderTop: "1px solid rgba(184,138,114,0.15)", borderBottom: "1px solid rgba(184,138,114,0.15)" }}
      >
        <div className="flex items-center gap-0 animate-[marquee_20s_linear_infinite]">
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center flex-shrink-0 px-10">
              <span className="label-luxury" style={{ color: "rgba(184,138,114,0.8)", whiteSpace: "nowrap" }}>
                {item}
              </span>
              <span className="ml-10 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--champagne)", opacity: 0.4 }} />
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── MAISON INTRO ── */}
      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="label-luxury mb-6">The Maison</p>
          <h2
            className="heading-display mb-8"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--charcoal)" }}
          >
            The Maison of Quiet Luxury
          </h2>
          <div className="divider-champagne mx-auto mb-8" />
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "rgba(21,21,21,0.65)", fontFamily: "var(--font-body)" }}
          >
            Lemure Blue creates jewellery designed not only to be worn, but to be inherited.
            Each piece begins with rarity, provenance, and personal legacy.
          </p>
        </div>
      </section>

      {/* ── STONE VAULT PREVIEW ── */}
      <section className="section-padding" style={{ background: "#F2EDE3" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="label-luxury mb-4">Curated Rarities</p>
            <h2
              className="heading-display"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--charcoal)" }}
            >
              The Stone Vault
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STONES.map((stone) => (
              <div
                key={stone.name}
                className="group relative overflow-hidden"
                style={{
                  background: "var(--ivory)",
                  border: "1px solid var(--stone)",
                  transition: "all 0.4s ease",
                }}
              >
                {/* Colour swatch */}
                <div
                  className="w-full h-52 flex items-center justify-center relative overflow-hidden"
                  style={{ background: stone.colour }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
                    }}
                  />
                  <div
                    className="w-20 h-20 rotate-45 group-hover:rotate-[90deg] transition-transform duration-700"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3
                    className="heading-display text-xl mb-1"
                    style={{ color: "var(--charcoal)" }}
                  >
                    {stone.name}
                  </h3>
                  <p className="text-xs mb-1" style={{ color: "var(--champagne)" }}>
                    {stone.origin}
                  </p>
                  <p className="text-xs mb-4" style={{ color: "rgba(21,21,21,0.5)" }}>
                    {stone.carat} · Price on Request
                  </p>
                  <Link
                    href="/appointment"
                    className="btn-outline-dark w-full text-center py-2.5 text-xs"
                    style={{ display: "block" }}
                  >
                    Reserve Interest
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/stone-vault" className="btn-outline-dark">
              View Stone Vault
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIMITED EDITION DROP ── */}
      <section
        className="section-padding"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="glass-dark p-10 md:p-16 text-center">
            <p className="label-luxury mb-6">Limited Edition</p>
            <h2
              className="heading-display mb-6"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--ivory)" }}
            >
              The Blue Legacy Collection
            </h2>
            <div className="divider-champagne mx-auto mb-8" />
            <p
              className="text-base mb-10 leading-relaxed"
              style={{ color: "rgba(248,243,234,0.65)" }}
            >
              A limited preorder collection released only to VIP members before public access.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {[
                "Limited Quantity",
                "Reservation Deposit",
                "Private Viewing",
                "Certificate of Authenticity",
                "Priority Stone Allocation",
              ].map((item) => (
                <div
                  key={item}
                  className="p-4 text-center"
                  style={{ border: "1px solid rgba(184,138,114,0.2)", background: "rgba(184,138,114,0.05)" }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(248,243,234,0.7)" }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <Link href="/vip-preorder" className="btn-primary">
              Register for VIP Preorder
            </Link>
          </div>
        </div>
      </section>

      {/* ── BESPOKE HEIRLOOM ── */}
      <section className="section-padding" style={{ background: "var(--ivory)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label-luxury mb-6">Bespoke & Heirloom</p>
              <h2
                className="heading-display mb-6"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--charcoal)" }}
              >
                Commission an Heirloom
              </h2>
              <div className="divider-champagne mb-8" />
              <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(21,21,21,0.6)" }}>
                Jewellery designed not only to be worn, but to be inherited.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-10">
                {[
                  "Bespoke Rings",
                  "Bridal Jewellery",
                  "Heirloom Redesign",
                  "Gemstone Sourcing",
                  "Private Collection",
                  "Legacy Gifts",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 py-3"
                    style={{ borderBottom: "1px solid var(--stone)" }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--champagne)" }}
                    />
                    <span className="text-sm" style={{ color: "rgba(21,21,21,0.7)" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/appointment" className="btn-primary">
                Book a Private Consultation
              </Link>
            </div>

            {/* Decorative panel */}
            <div
              className="relative h-96 lg:h-[600px] flex items-center justify-center"
              style={{ background: "var(--emerald)", border: "1px solid rgba(184,138,114,0.2)" }}
            >
              <div className="text-center">
                <p
                  className="heading-display text-7xl md:text-9xl opacity-10"
                  style={{ color: "var(--ivory)" }}
                >
                  L
                </p>
                <p className="label-luxury mt-4" style={{ color: "rgba(184,138,114,0.8)" }}>
                  Acquire beauty.
                  <br />
                  Preserve legacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIP PREORDER CTA ── */}
      <section className="section-padding" style={{ background: "var(--charcoal)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <p className="label-luxury mb-6">VIP Preorder</p>
          <h2
            className="heading-display mb-6"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--ivory)" }}
          >
            VIP Gemstone Preorder
          </h2>
          <div className="divider-champagne mx-auto mb-8" />
          <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(248,243,234,0.65)" }}>
            Clients may place a preorder deposit to receive priority access to a future gemstone or jewellery allocation.
          </p>
          <p className="text-xs mb-10 leading-relaxed" style={{ color: "rgba(248,243,234,0.4)" }}>
            This is a collectible gemstone preorder and reservation model. This is not a guaranteed investment product
            and does not promise financial returns.
          </p>
          <Link href="/vip-preorder" className="btn-primary">
            Place VIP Preorder Deposit
          </Link>
        </div>
      </section>

      {/* ── VIP REGISTRATION FORM ── */}
      <section
        id="vip-form"
        className="section-padding"
        style={{ background: "linear-gradient(160deg, #002030 0%, #003F4F 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="label-luxury mb-6">Private Access</p>
            <h2
              className="heading-display mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--ivory)" }}
            >
              Join the Private Circle
            </h2>
            <div className="divider-champagne mx-auto mb-8" />
            <p className="text-sm" style={{ color: "rgba(248,243,234,0.6)" }}>
              Private access. Limited stones. Timeless value.
            </p>
          </div>
          <VipForm dark />
        </div>
      </section>

      <Footer />
    </main>
  );
}
