import type { ReactNode } from "react";
import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/leads", label: "VIP Leads", icon: "◉" },
  { href: "/admin/preorders", label: "Preorders", icon: "◆" },
  { href: "/admin/stones", label: "Stone Vault", icon: "◇" },
  { href: "/admin/collections", label: "Collections", icon: "◎" },
  { href: "/admin/appointments", label: "Appointments", icon: "◐" },
  { href: "/admin/content", label: "Content", icon: "◑" },
  { href: "/admin/settings", label: "Settings", icon: "◒" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#0d0d0d" }}>
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col"
        style={{
          background: "#111",
          borderRight: "1px solid rgba(184,138,114,0.12)",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div
          className="px-6 py-8"
          style={{ borderBottom: "1px solid rgba(184,138,114,0.12)" }}
        >
          <Link href="/admin" className="block">
            <p className="heading-display text-xl" style={{ color: "var(--ivory)" }}>
              Lemure Bleu
            </p>
            <p className="label-luxury mt-1" style={{ fontSize: "0.5rem", color: "rgba(184,138,114,0.7)" }}>
              Admin OS
            </p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="admin-sidebar-link">
              <span style={{ color: "var(--champagne)", fontSize: "0.9rem" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="px-6 py-4"
          style={{ borderTop: "1px solid rgba(184,138,114,0.12)" }}
        >
          <Link href="/" className="admin-sidebar-link px-0">
            <span style={{ color: "var(--champagne)" }}>←</span> View Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
