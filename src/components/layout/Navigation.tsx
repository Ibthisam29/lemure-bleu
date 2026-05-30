"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "/stone-vault", label: "Stone Vault" },
    { href: "/limited-editions", label: "Limited Editions" },
    { href: "/appointment", label: "Appointments" },
    { href: "/vip", label: "VIP Circle" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          background: scrolled ? "rgba(247,242,232,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(196,150,90,0.2)" : "none",
        }}
      >
        <div className="container flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className="display text-2xl transition-colors duration-300"
              style={{ color: scrolled ? "var(--emerald)" : "var(--ivory)" }}
            >
              Lemure Blue
            </span>
            <span
              className="eyebrow mt-0.5 transition-colors duration-300"
              style={{
                fontSize: "0.5rem",
                color: scrolled ? "var(--champagne)" : "rgba(240,224,196,0.8)",
              }}
            >
              Lemurebleu.com
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="eyebrow transition-colors duration-300 hover:opacity-100"
                style={{
                  color: scrolled ? "var(--emerald)" : "rgba(247,242,232,0.7)",
                  fontSize: "0.58rem",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/vip"
              className="hidden md:flex btn-gold py-2.5 px-6"
              style={{ fontSize: "0.58rem", letterSpacing: "0.22em" }}
            >
              Join VIP
            </Link>
            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Menu"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block w-5 h-px transition-all duration-400"
                  style={{
                    background: scrolled ? "var(--emerald)" : "var(--ivory)",
                    opacity: i === 1 && open ? 0 : 1,
                    transform:
                      i === 0 && open
                        ? "rotate(45deg) translate(3px,4px)"
                        : i === 2 && open
                        ? "rotate(-45deg) translate(3px,-4px)"
                        : "none",
                  }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="md:hidden"
            style={{
              background: "var(--ivory)",
              borderTop: "1px solid var(--stone)",
            }}
          >
            <div className="container py-10 flex flex-col gap-8">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display text-3xl"
                  style={{ color: "var(--emerald)" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/vip"
                onClick={() => setOpen(false)}
                className="btn-gold w-full text-center mt-2"
              >
                Join VIP List
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile sticky bottom */}
      <div className="mobile-cta">
        <Link
          href="/vip"
          className="flex-1 py-4 text-center eyebrow"
          style={{ background: "var(--emerald)", color: "var(--ivory)", fontSize: "0.55rem" }}
        >
          Join VIP
        </Link>
        <a
          href="https://wa.me/6500000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-4 text-center eyebrow"
          style={{ background: "var(--charcoal)", color: "var(--ivory)", fontSize: "0.55rem", borderLeft: "1px solid rgba(196,150,90,0.2)" }}
        >
          WhatsApp
        </a>
        <Link
          href="/appointment"
          className="flex-1 py-4 text-center eyebrow"
          style={{ background: "var(--champagne)", color: "var(--ivory)", fontSize: "0.55rem", borderLeft: "1px solid rgba(247,242,232,0.2)" }}
        >
          Book Appt
        </Link>
      </div>
    </>
  );
}
