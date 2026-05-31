import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--emerald)" }}>
      {/* Top ornament */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(196,150,90,0.5), transparent)" }} />

      <div className="container" style={{ padding: "5rem 2.5rem 3rem" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand */}
          <div>
            <h3 className="display mb-2" style={{ color: "var(--ivory)", fontSize: "2.2rem" }}>
              Lemure Bleu
            </h3>
            <p className="eyebrow mb-8" style={{ color: "rgba(196,150,90,0.8)", fontSize: "0.5rem" }}>
              Private Jewellery Maison · Singapore
            </p>
            <span className="rule-champagne block mb-8" style={{ opacity: 0.5 }} />
            <p className="text-sm leading-loose" style={{ color: "rgba(247,242,232,0.45)", fontWeight: 300 }}>
              Jewellery designed not only to be worn, but to be inherited.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="eyebrow mb-8" style={{ color: "rgba(196,150,90,0.7)", fontSize: "0.52rem" }}>
              Maison
            </p>
            <div className="flex flex-col gap-4">
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
                  className="text-sm transition-colors duration-300 hover:text-ivory w-fit"
                  style={{ color: "rgba(247,242,232,0.45)", fontWeight: 300 }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="eyebrow mb-8" style={{ color: "rgba(196,150,90,0.7)", fontSize: "0.52rem" }}>
              Contact
            </p>
            <div className="flex flex-col gap-4">
              <a href="mailto:hello@lemurebleu.com"
                className="text-sm transition-colors duration-300"
                style={{ color: "rgba(247,242,232,0.45)", fontWeight: 300 }}>
                hello@lemurebleu.com
              </a>
              <a href="https://wa.me/6500000000" target="_blank" rel="noopener noreferrer"
                className="text-sm transition-colors duration-300"
                style={{ color: "rgba(247,242,232,0.45)", fontWeight: 300 }}>
                WhatsApp Concierge
              </a>
              <a href="https://instagram.com/lemureblue" target="_blank" rel="noopener noreferrer"
                className="text-sm transition-colors duration-300"
                style={{ color: "rgba(247,242,232,0.45)", fontWeight: 300 }}>
                @lemureblue
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-8 mb-8" style={{ borderTop: "1px solid rgba(196,150,90,0.12)", borderBottom: "1px solid rgba(196,150,90,0.12)" }}>
          <p className="text-xs leading-loose" style={{ color: "rgba(247,242,232,0.28)", fontWeight: 300 }}>
            <strong style={{ color: "rgba(247,242,232,0.4)", fontWeight: 400 }}>Disclaimer:</strong>{" "}
            Lemure Bleu provides access to collectible gemstones and bespoke jewellery. Gemstones are not guaranteed financial investments.
            Lemure Bleu does not guarantee appreciation, resale value, liquidity, profit, or investment return.
          </p>
        </div>

        {/* Legal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(247,242,232,0.25)", fontWeight: 300 }}>
            © {new Date().getFullYear()} Lemure Bleu. All rights reserved.
          </p>
          <div className="flex gap-8">
            {[
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms" },
              { href: "/refund-policy", label: "Refund Policy" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="text-xs transition-colors duration-300 hover:text-ivory"
                style={{ color: "rgba(247,242,232,0.28)", fontWeight: 300 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
