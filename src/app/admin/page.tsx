import { createAdminClient } from "@/lib/supabase";

async function getStats() {
  try {
    const supabase = createAdminClient();
    const [leads, appointments, preorders, stones] = await Promise.all([
      supabase.from("vip_leads").select("id, status", { count: "exact" }),
      supabase.from("appointments").select("id, status", { count: "exact" }),
      supabase.from("preorders").select("id, amount, payment_status", { count: "exact" }),
      supabase.from("stones").select("id, status", { count: "exact" }),
    ]);

    const totalRevenue = (preorders.data || [])
      .filter((p: { payment_status: string }) => p.payment_status === "paid")
      .reduce((sum: number, p: { amount: number }) => sum + p.amount, 0);

    const pendingLeads = (leads.data || []).filter((l: { status: string }) => l.status === "new").length;
    const pendingAppts = (appointments.data || []).filter((a: { status: string }) => a.status === "pending").length;
    const reservedStones = (stones.data || []).filter((s: { status: string }) => s.status === "reserved").length;
    const soldStones = (stones.data || []).filter((s: { status: string }) => s.status === "sold").length;

    return {
      totalLeads: leads.count || 0,
      totalAppointments: appointments.count || 0,
      totalPreorders: preorders.count || 0,
      totalRevenue,
      pendingLeads,
      pendingAppts,
      reservedStones,
      soldStones,
    };
  } catch {
    return {
      totalLeads: 0, totalAppointments: 0, totalPreorders: 0,
      totalRevenue: 0, pendingLeads: 0, pendingAppts: 0,
      reservedStones: 0, soldStones: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "VIP Leads", value: stats.totalLeads, sub: `${stats.pendingLeads} pending`, color: "var(--champagne)" },
    { label: "Appointments", value: stats.totalAppointments, sub: `${stats.pendingAppts} pending`, color: "#7eca8e" },
    { label: "Preorders", value: stats.totalPreorders, sub: "Stripe payments", color: "#7ec8e3" },
    { label: "Revenue (SGD)", value: `$${stats.totalRevenue.toLocaleString()}`, sub: "From preorders", color: "var(--champagne)" },
    { label: "Reserved Stones", value: stats.reservedStones, sub: "Pending allocation", color: "#e3c87e" },
    { label: "Sold Stones", value: stats.soldStones, sub: "Fulfilled", color: "#7eca8e" },
  ];

  return (
    <div>
      <div className="mb-10">
        <p className="label-luxury mb-2" style={{ color: "rgba(184,138,114,0.7)" }}>
          Overview
        </p>
        <h1 className="heading-display text-3xl" style={{ color: "var(--ivory)" }}>
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(184,138,114,0.1)",
            }}
          >
            <p className="text-xs mb-2" style={{ color: "rgba(248,243,234,0.5)", letterSpacing: "0.1em" }}>
              {card.label}
            </p>
            <p className="heading-display text-3xl mb-1" style={{ color: card.color }}>
              {card.value}
            </p>
            <p className="text-xs" style={{ color: "rgba(248,243,234,0.3)" }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { href: "/admin/leads", title: "Manage VIP Leads", desc: "View, filter, and manage all VIP registrations" },
          { href: "/admin/preorders", title: "Manage Preorders", desc: "Track Stripe payments and allocations" },
          { href: "/admin/stones", title: "Stone Vault CMS", desc: "Add, edit, and manage gemstone listings" },
          { href: "/admin/appointments", title: "Appointments", desc: "Review and approve appointment requests" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block p-6 transition-all duration-200 hover:bg-white/5"
            style={{ border: "1px solid rgba(184,138,114,0.1)" }}
          >
            <h3 className="text-sm font-medium mb-1" style={{ color: "var(--ivory)" }}>
              {item.title}
            </h3>
            <p className="text-xs" style={{ color: "rgba(248,243,234,0.4)" }}>
              {item.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
