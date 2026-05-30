"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "/stone-vault", label: "Stone Vault" },
    { href: "/limited-editions", label: "Limited Editions" },
    { href: "/appointment", label: "Appointments" },
    { href: "/vip", label: "VIP Access" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(21, 21, 21, 0.96)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(184,138,114,0.15)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span
              className="heading-display text-ivory text-2xl"
              style={{ color: "var(--ivory)" }}
            >
              Lemure Blue
            </span>
            <span className="label-luxury" style={{ fontSize: "0.5rem", marginTop: "2px" }}>
              Lemurebleu.com
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="label-luxury hover:text-ivory transition-colors duration-300"
                style={{ color: "rgba(248,243,234,0.7)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link href="/vip" className="hidden md:flex btn-primary py-2 px-6 text-xs">
              Join VIP
            </Link>
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span
                className="block w-6 h-px transition-all duration-300"
                style={{
                  background: "var(--ivory)",
                  transform: open ? "rotate(45deg) translate(3px, 3px)" : "none",
                }}
              />
              <span
                className="block w-6 h-px transition-all duration-300"
                style={{
                  background: "var(--ivory)",
                  opacity: open ? 0 : 1,
                }}
              />
              <span
                className="block w-6 h-px transition-all duration-300"
                style={{
                  background: "var(--ivory)",
                  transform: open ? "rotate(-45deg) translate(3px, -3px)" : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="md:hidden"
            style={{
              background: "rgba(21,21,21,0.98)",
              borderTop: "1px solid rgba(184,138,114,0.2)",
            }}
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="heading-display text-2xl"
                  style={{ color: "var(--ivory)" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/vip"
                onClick={() => setOpen(false)}
                className="btn-primary w-full text-center mt-4"
              >
                Join VIP List
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Sticky mobile bottom CTA */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{ borderTop: "1px solid rgba(184,138,114,0.2)" }}
      >
        <Link
          href="/vip"
          className="flex-1 py-4 text-center label-luxury text-ivory"
          style={{ background: "var(--emerald)" }}
        >
          Join VIP
        </Link>
        <a
          href="https://wa.me/6500000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-4 text-center label-luxury text-ivory"
          style={{ background: "var(--charcoal)", borderLeft: "1px solid rgba(184,138,114,0.2)" }}
        >
          WhatsApp
        </a>
        <Link
          href="/appointment"
          className="flex-1 py-4 text-center label-luxury"
          style={{
            background: "var(--champagne)",
            color: "var(--ivory)",
            borderLeft: "1px solid rgba(248,243,234,0.2)",
          }}
        >
          Book Appt
        </Link>
      </div>
    </>
  );
}
