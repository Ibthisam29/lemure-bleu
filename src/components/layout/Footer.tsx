import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="section-padding"
      style={{ background: "var(--charcoal)", borderTop: "1px solid rgba(184,138,114,0.15)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand */}
          <div>
            <h3 className="heading-display text-3xl mb-3" style={{ color: "var(--ivory)" }}>
              Lemure Blue
            </h3>
            <p className="label-luxury mb-6">Lemurebleu.com</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(248,243,234,0.5)" }}>
              A private jewellery maison for bespoke heirlooms and collectible rare stones.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="label-luxury mb-6">Maison</p>
            <div className="flex flex-col gap-3">
              {[
                { href: "/stone-vault", label: "Stone Vault" },
                { href: "/limited-editions", label: "Limited Editions" },
                { href: "/vip", label: "VIP Private Circle" },
                { href: "/vip-preorder", label: "VIP Preorder" },
                { href: "/appointment", label: "Book Appointment" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm transition-colors duration-300 hover:text-champagne"
                  style={{ color: "rgba(248,243,234,0.55)" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="label-luxury mb-6">Contact</p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@lemurebleu.com"
                className="text-sm transition-colors duration-300 hover:text-champagne"
                style={{ color: "rgba(248,243,234,0.55)" }}
              >
                hello@lemurebleu.com
              </a>
              <a
                href="https://wa.me/6500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors duration-300 hover:text-champagne"
                style={{ color: "rgba(248,243,234,0.55)" }}
              >
                WhatsApp Concierge
              </a>
              <a
                href="https://instagram.com/lemureblue"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors duration-300 hover:text-champagne"
                style={{ color: "rgba(248,243,234,0.55)" }}
              >
                @lemureblue
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="py-8 mb-8"
          style={{ borderTop: "1px solid rgba(184,138,114,0.1)", borderBottom: "1px solid rgba(184,138,114,0.1)" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "rgba(248,243,234,0.35)" }}>
            <strong style={{ color: "rgba(248,243,234,0.5)" }}>Disclaimer:</strong>{" "}
            Lemure Blue provides access to collectible gemstones and bespoke jewellery. Gemstones may carry rarity,
            beauty, provenance, and long-term collectible value; however, they are not guaranteed financial investments.
            Lemure Blue does not guarantee appreciation, resale value, liquidity, profit, or investment return. All
            gemstone purchases and preorders are subject to availability, sourcing, quality verification, certification,
            and client approval.
          </p>
        </div>

        {/* Legal + copyright */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(248,243,234,0.3)" }}>
            © {new Date().getFullYear()} Lemure Blue. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms & Conditions" },
              { href: "/refund-policy", label: "Refund Policy" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs transition-colors duration-300 hover:text-champagne"
                style={{ color: "rgba(248,243,234,0.35)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
