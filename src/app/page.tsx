import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import VipForm from "@/components/ui/VipForm";
import Link from "next/link";

const STONES = [
  { name: "Blue Sapphire", origin: "Kashmir, India", carat: "5.20 ct", gem: "#1B3A5C" },
  { name: "Colombian Emerald", origin: "Muzo, Colombia", carat: "3.80 ct", gem: "#1A4232" },
  { name: "Burmese Ruby", origin: "Mogok, Myanmar", carat: "2.40 ct", gem: "#7A1E2E" },
  { name: "Mahenge Spinel", origin: "Tanzania", carat: "4.10 ct", gem: "#7A2850" },
  { name: "Tanzanite", origin: "Merelani Hills", carat: "7.60 ct", gem: "#2E1E60" },
  { name: "Paraíba Tourmaline", origin: "Brazil", carat: "1.90 ct", gem: "#0A6B7A" },
];

const TRUST = ["Bespoke Jewellery", "Rare Gemstones", "Private Appointments", "Limited Editions", "Heirloom Redesign", "VIP Preorders"];

export default function HomePage() {
  return (
    <main>
      <Navigation />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: "linear-gradient(155deg, var(--emerald) 0%, #122C25 55%, #0D2020 100%)" }}
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 60% at 65% 45%, rgba(196,150,90,0.08) 0%, transparent 65%)",
        }} />
        {/* Decorative corner lines */}
        <div className="absolute top-32 left-12 w-px h-40 opacity-20" style={{ background: "linear-gradient(to bottom, transparent, var(--champagne), transparent)" }} />
        <div className="absolute top-32 left-12 w-40 h-px opacity-20" style={{ background: "linear-gradient(to right, transparent, var(--champagne), transparent)" }} />
        <div className="absolute bottom-24 right-12 w-px h-40 opacity-20" style={{ background: "linear-gradient(to bottom, transparent, var(--champagne), transparent)" }} />
        <div className="absolute bottom-24 right-12 w-40 h-px opacity-20" style={{ background: "linear-gradient(to left, transparent, var(--champagne), transparent)" }} />

        <div className="container pt-36 pb-24 relative z-10">
          <div className="max-w-3xl">
            <p className="eyebrow fade-up mb-8" style={{ color: "rgba(196,150,90,0.9)" }}>
              Private Jewellery Maison · Singapore
            </p>

            <h1 className="display fade-up-2 mb-4" style={{ fontSize: "clamp(4rem, 9vw, 8rem)", color: "var(--ivory)" }}>
              Rare Gems.
            </h1>
            <h1 className="display-italic fade-up-3 mb-10" style={{ fontSize: "clamp(4rem, 9vw, 8rem)", color: "var(--champ-lt)" }}>
              Refined Legacy.
            </h1>

            <div className="fade-up-4 flex items-center gap-4 mb-10">
              <span className="rule-champagne" style={{ opacity: 0.6 }} />
              <p className="text-sm" style={{ color: "rgba(247,242,232,0.55)", fontWeight: 300, maxWidth: "420px", lineHeight: "1.8" }}>
                A private jewellery maison for bespoke heirlooms, limited-edition gemstone pieces, and collectible rare stone ownership.
              </p>
            </div>

            <div className="fade-up-4 flex flex-col sm:flex-row gap-4">
              <Link href="/vip" className="btn-gold">Join VIP List</Link>
              <Link href="/appointment" className="btn-outline-ivory">Book Private Appointment</Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-14" style={{ background: "linear-gradient(to bottom, transparent, rgba(196,150,90,0.6))" }} />
          <p className="eyebrow" style={{ fontSize: "0.48rem", color: "rgba(196,150,90,0.5)" }}>Scroll</p>
        </div>
      </section>

      {/* ── TRUST MARQUEE ── */}
      <section style={{ background: "var(--ivory-deep)", borderTop: "1px solid var(--stone)", borderBottom: "1px solid var(--stone)", overflow: "hidden" }}>
        <div className="py-5 flex" style={{ animation: "marquee 22s linear infinite" }}>
          {[...TRUST, ...TRUST].map((item, i) => (
            <div key={i} className="flex items-center flex-shrink-0 px-10">
              <span className="eyebrow" style={{ color: "var(--champagne)", whiteSpace: "nowrap", fontSize: "0.58rem" }}>{item}</span>
              <span className="ml-10 w-1 h-1 flex-shrink-0 rotate-45" style={{ background: "var(--champagne)", opacity: 0.4 }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── MAISON INTRO ── */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Text */}
            <div>
              <p className="eyebrow-dark mb-6">The Maison</p>
              <h2 className="display mb-6" style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", color: "var(--emerald)" }}>
                The Maison of<br /><em style={{ color: "var(--champagne)" }}>Quiet Luxury</em>
              </h2>
              <span className="rule-emerald block mb-8" />
              <p className="leading-loose mb-4" style={{ color: "var(--warm-grey)", fontWeight: 300, fontSize: "0.95rem" }}>
                Lemure Bleu creates jewellery designed not only to be worn, but to be inherited. Each piece begins with rarity, provenance, and personal legacy.
              </p>
              <p className="leading-loose" style={{ color: "var(--warm-grey)", fontWeight: 300, fontSize: "0.95rem" }}>
                Acquire beauty. Preserve legacy. Private access. Limited stones. Timeless value.
              </p>
            </div>

            {/* Decorative panel */}
            <div className="relative h-80 lg:h-[500px]" style={{ background: "var(--emerald)", border: "1px solid rgba(196,150,90,0.15)" }}>
              {/* Inner frame */}
              <div className="absolute inset-6" style={{ border: "1px solid rgba(196,150,90,0.15)" }} />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                {/* Diamond */}
                <div className="w-24 h-24 rotate-45" style={{ border: "1px solid rgba(196,150,90,0.3)", background: "rgba(196,150,90,0.05)" }}>
                  <div className="absolute inset-3" style={{ border: "1px solid rgba(196,150,90,0.2)" }} />
                </div>
                <p className="eyebrow mt-8" style={{ color: "rgba(196,150,90,0.6)", fontSize: "0.52rem" }}>
                  Est. Singapore
                </p>
              </div>
              {/* Corner accents */}
              {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((pos,i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4`} style={{
                  borderTop: i < 2 ? "1px solid rgba(196,150,90,0.4)" : "none",
                  borderBottom: i >= 2 ? "1px solid rgba(196,150,90,0.4)" : "none",
                  borderLeft: i % 2 === 0 ? "1px solid rgba(196,150,90,0.4)" : "none",
                  borderRight: i % 2 === 1 ? "1px solid rgba(196,150,90,0.4)" : "none",
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STONE VAULT PREVIEW ── */}
      <section className="section" style={{ background: "var(--ivory-deep)" }}>
        <div className="container">
          <div className="text-center mb-16">
            <p className="eyebrow-dark mb-4">Curated Rarities</p>
            <h2 className="display" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--emerald)" }}>
              The Stone Vault
            </h2>
            <span className="rule-champagne mx-auto block mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STONES.map((stone) => (
              <div key={stone.name} className="group overflow-hidden" style={{ background: "var(--ivory)", border: "1px solid var(--stone)", transition: "all 0.4s ease" }}>
                {/* Gem swatch */}
                <div className="h-52 relative flex items-center justify-center overflow-hidden" style={{ background: stone.gem }}>
                  <div className="w-20 h-20 rotate-45 transition-all duration-700 group-hover:rotate-90 group-hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <div className="absolute inset-2" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "radial-gradient(ellipse at center, rgba(196,150,90,0.12) 0%, transparent 70%)" }} />
                </div>
                {/* Info */}
                <div className="p-6">
                  <h3 className="display text-xl mb-1" style={{ color: "var(--emerald)" }}>{stone.name}</h3>
                  <p className="text-xs mb-1" style={{ color: "var(--champagne)", fontWeight: 300 }}>{stone.origin}</p>
                  <p className="text-xs mb-4" style={{ color: "var(--warm-grey)", fontWeight: 300 }}>{stone.carat} · Price on Request</p>
                  <Link href="/appointment" className="btn-outline-emerald w-full text-center block py-2.5" style={{ fontSize: "0.58rem", letterSpacing: "0.2em" }}>
                    Reserve Interest
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/stone-vault" className="btn-outline-emerald">View Full Vault</Link>
          </div>
        </div>
      </section>

      {/* ── LIMITED EDITION ── */}
      <section className="section relative overflow-hidden" style={{ background: "var(--emerald)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(196,150,90,0.06) 0%, transparent 60%)"
        }} />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow mb-6" style={{ color: "rgba(196,150,90,0.8)" }}>Limited Edition</p>
            <h2 className="display mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--ivory)" }}>
              The Blue Legacy<br /><em style={{ color: "var(--champ-lt)" }}>Collection</em>
            </h2>
            <span className="rule-champagne mx-auto block mb-8" style={{ opacity: 0.5 }} />
            <p className="mb-10 leading-loose" style={{ color: "rgba(247,242,232,0.6)", fontWeight: 300, fontSize: "0.9rem" }}>
              A limited preorder collection released only to VIP members before public access.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {[
                { n: "12", label: "Pieces Only" },
                { n: "VIP", label: "Members First" },
                { n: "COA", label: "Authenticated" },
              ].map((s) => (
                <div key={s.label} className="py-6 px-4" style={{ border: "1px solid rgba(196,150,90,0.2)", background: "rgba(196,150,90,0.04)" }}>
                  <p className="display text-3xl mb-1" style={{ color: "var(--champ-lt)" }}>{s.n}</p>
                  <p className="eyebrow" style={{ color: "rgba(247,242,232,0.45)", fontSize: "0.5rem" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <Link href="/vip-preorder" className="btn-gold">Register for VIP Preorder</Link>
          </div>
        </div>
      </section>

      {/* ── BESPOKE HEIRLOOM ── */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left panel */}
            <div className="relative h-72 lg:h-full min-h-80 order-2 lg:order-1" style={{ background: "var(--ivory-deep)", border: "1px solid var(--stone)" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="display" style={{ fontSize: "6rem", color: "var(--stone)", opacity: 0.5 }}>H</p>
                  <p className="eyebrow-dark mt-2" style={{ fontSize: "0.5rem" }}>Heirloom by Design</p>
                </div>
              </div>
              <div className="absolute inset-0" style={{ border: "8px solid var(--ivory)", outline: "1px solid var(--stone)" }} />
            </div>

            {/* Right content */}
            <div className="order-1 lg:order-2">
              <p className="eyebrow-dark mb-6">Bespoke & Heirloom</p>
              <h2 className="display mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--emerald)" }}>
                Commission<br /><em style={{ color: "var(--champagne)" }}>an Heirloom</em>
              </h2>
              <span className="rule-champagne block mb-8" />
              <p className="mb-10 leading-loose" style={{ color: "var(--warm-grey)", fontWeight: 300, fontSize: "0.9rem" }}>
                Jewellery designed not only to be worn, but to be inherited.
              </p>

              <div className="space-y-0 mb-10">
                {["Bespoke Rings", "Bridal Jewellery", "Heirloom Redesign", "Gemstone Sourcing", "Private Collection Pieces", "Legacy Gifts"].map((item) => (
                  <div key={item} className="flex items-center gap-4 py-3.5" style={{ borderBottom: "1px solid var(--stone)" }}>
                    <div className="w-1 h-1 rotate-45 flex-shrink-0" style={{ background: "var(--champagne)" }} />
                    <span className="text-sm" style={{ color: "var(--emerald)", fontWeight: 300 }}>{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/appointment" className="btn-gold">Book a Private Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIP PREORDER BANNER ── */}
      <section className="section-sm" style={{ background: "var(--champ-pale)", borderTop: "1px solid var(--stone)" }}>
        <div className="container">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="eyebrow-dark mb-3">VIP Gemstone Preorder</p>
              <h3 className="display text-3xl" style={{ color: "var(--emerald)" }}>
                Reserve Priority Access
              </h3>
            </div>
            <div className="flex-shrink-0">
              <Link href="/vip-preorder" className="btn-gold">Place Preorder Deposit</Link>
            </div>
          </div>
          <p className="text-xs text-center mt-8 leading-loose" style={{ color: "var(--warm-grey)", fontWeight: 300 }}>
            Collectible gemstone preorder · Not a financial investment product · Priority access only
          </p>
        </div>
      </section>

      {/* ── VIP FORM ── */}
      <section className="section relative overflow-hidden" style={{ background: "var(--emerald)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 30% 60%, rgba(196,150,90,0.07) 0%, transparent 65%)"
        }} />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-14">
              <p className="eyebrow mb-6" style={{ color: "rgba(196,150,90,0.8)" }}>Private Access</p>
              <h2 className="display mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--ivory)" }}>
                Join the Private Circle
              </h2>
              <span className="rule-champagne mx-auto block mb-8" style={{ opacity: 0.5 }} />
              <p className="text-sm" style={{ color: "rgba(247,242,232,0.5)", fontWeight: 300 }}>
                Private access. Limited stones. Timeless value.
              </p>
            </div>
            <VipForm dark />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
