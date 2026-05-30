import type { Preorder } from "@/types";

async function getPreorders(): Promise<Preorder[]> {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
    const { createAdminClient } = await import("@/lib/supabase");
    const supabase = createAdminClient();
    const { data } = await supabase.from("preorders").select("*").order("created_at", { ascending: false });
    return (data as Preorder[]) || [];
  } catch { return []; }
}

const ALLOCATION_COLORS: Record<string, string> = {
  pending: "#7ec8e3", allocated: "#e3c87e", in_consultation: "var(--champagne)", fulfilled: "#7eca8e", refunded: "#888",
};
const TIER_LABELS: Record<string, string> = {
  blue_entry: "Blue Entry (SGD 300)", maison: "Maison (SGD 1,000)", legacy: "Legacy (SGD 3,000)",
};

export default async function AdminPreordersPage() {
  const preorders = await getPreorders();
  const totalRevenue = preorders.filter(p => p.payment_status === "paid").reduce((s, p) => s + p.amount, 0);
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="label-luxury mb-2" style={{ color: "rgba(184,138,114,0.7)" }}>Deposits</p>
          <h1 className="heading-display text-3xl" style={{ color: "var(--ivory)" }}>Preorders ({preorders.length})</h1>
        </div>
        <div className="text-right">
          <p className="label-luxury" style={{ fontSize: "0.55rem", color: "rgba(184,138,114,0.6)" }}>Confirmed Revenue</p>
          <p className="heading-display text-2xl" style={{ color: "var(--champagne)" }}>SGD {totalRevenue.toLocaleString()}</p>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(184,138,114,0.15)" }}>
              {["Client", "Email", "Tier", "Amount", "Payment", "Allocation", "Date"].map(h => (
                <th key={h} className="text-left py-3 px-3"
                  style={{ color: "rgba(248,243,234,0.4)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preorders.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="py-3 px-3 text-sm" style={{ color: "var(--ivory)" }}>{p.full_name}</td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(248,243,234,0.6)" }}>{p.email}</td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(248,243,234,0.6)" }}>{TIER_LABELS[p.preorder_tier] || p.preorder_tier}</td>
                <td className="py-3 px-3 text-xs font-medium" style={{ color: "var(--champagne)" }}>SGD {p.amount.toLocaleString()}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 text-xs"
                    style={{ background: p.payment_status === "paid" ? "#7eca8e20" : "#88888820", color: p.payment_status === "paid" ? "#7eca8e" : "#aaa", border: `1px solid ${p.payment_status === "paid" ? "#7eca8e40" : "#88888840"}` }}>
                    {p.payment_status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 text-xs"
                    style={{ background: `${ALLOCATION_COLORS[p.allocation_status] || "#888"}20`, color: ALLOCATION_COLORS[p.allocation_status] || "#888", border: `1px solid ${ALLOCATION_COLORS[p.allocation_status] || "#888"}40` }}>
                    {p.allocation_status.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(248,243,234,0.4)" }}>
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {preorders.length === 0 && (
          <p className="text-center py-16 text-sm" style={{ color: "rgba(248,243,234,0.3)" }}>No preorders yet.</p>
        )}
      </div>
    </div>
  );
}
