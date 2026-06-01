import type { VipLead } from "@/types";

async function getLeads(): Promise<VipLead[]> {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
    const { createAdminClient } = await import("@/lib/supabase");
    const supabase = createAdminClient();
    const { data } = await supabase.from("vip_leads").select("*").order("created_at", { ascending: false });
    return (data as VipLead[]) || [];
  } catch { return []; }
}

const STATUS_COLORS: Record<string, string> = {
  new: "#7ec8e3", contacted: "#e3c87e", qualified: "#7eca8e",
  appointment_booked: "var(--champagne)", converted: "#a78eca", not_suitable: "#888",
};

export default async function AdminLeadsPage() {
  const leads = await getLeads();
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="label-luxury mb-2" style={{ color: "rgba(184,138,114,0.7)" }}>CRM</p>
          <h1 className="heading-display text-3xl" style={{ color: "var(--ivory)" }}>VIP Leads ({leads.length})</h1>
        </div>
        <a href="/api/admin/export-leads" className="btn-outline py-2 px-4 text-xs"
          style={{ borderColor: "rgba(184,138,114,0.4)", color: "rgba(28,61,53,0.8)" }}>Export CSV</a>
      </div>
      <div style={{ overflowX:"auto", background:"#FFFFFF", border:"1px solid #CFC8BC" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #CFC8BC" }}>
              {["Name", "Email", "Country", "Interest", "Budget", "Status", "Date"].map(h => (
                <th key={h} className="text-left py-3 px-3"
                  style={{ color: "#8C857A", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: "1px solid rgba(28,61,53,0.04)" }}>
                <td className="py-3 px-3">
                  <p className="text-sm" style={{ color: "var(--ivory)" }}>{lead.full_name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#8C857A" }}>{lead.phone}</p>
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(28,61,53,0.8)" }}>{lead.email}</td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(28,61,53,0.7)" }}>{lead.country}</td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(28,61,53,0.7)" }}>{lead.interest_type}</td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(28,61,53,0.7)" }}>{lead.budget_range}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 text-xs"
                    style={{ background: `${STATUS_COLORS[lead.status] || "#888"}20`, color: STATUS_COLORS[lead.status] || "#888", border: `1px solid ${STATUS_COLORS[lead.status] || "#888"}40` }}>
                    {lead.status.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: "#8C857A" }}>
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="text-center py-16 text-sm" style={{ color: "#CFC8BC" }}>No VIP leads yet.</p>
        )}
      </div>
    </div>
  );
}
