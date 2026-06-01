import type { Appointment } from "@/types";

async function getAppointments(): Promise<Appointment[]> {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
    const { createAdminClient } = await import("@/lib/supabase");
    const supabase = createAdminClient();
    const { data } = await supabase.from("appointments").select("*").order("preferred_date", { ascending: true });
    return (data as Appointment[]) || [];
  } catch { return []; }
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#7ec8e3", approved: "#7eca8e", rejected: "#ca7e7e", completed: "#a78eca",
};

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments();
  return (
    <div>
      <div className="mb-8">
        <p className="label-luxury mb-2" style={{ color: "rgba(184,138,114,0.7)" }}>Calendar</p>
        <h1 className="heading-display text-3xl" style={{ color: "var(--ivory)" }}>Appointments ({appointments.length})</h1>
      </div>
      <div style={{ overflowX:"auto", background:"var(--ivory)", border:"1px solid var(--stone)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--stone)" }}>
              {["Client", "Date & Time", "Type", "Budget", "Status", "Contact"].map(h => (
                <th key={h} className="text-left py-3 px-3"
                  style={{ color: "var(--warm-grey)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt.id} style={{ borderBottom: "1px solid rgba(28,61,53,0.04)" }}>
                <td className="py-3 px-3">
                  <p className="text-sm" style={{ color: "var(--ivory)" }}>{appt.full_name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--warm-grey)" }}>{appt.phone}</p>
                </td>
                <td className="py-3 px-3">
                  <p className="text-xs" style={{ color: "rgba(28,61,53,0.8)" }}>{new Date(appt.preferred_date).toLocaleDateString()}</p>
                  {appt.preferred_time && <p className="text-xs" style={{ color: "var(--warm-grey)" }}>{appt.preferred_time}</p>}
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(28,61,53,0.75)" }}>{appt.appointment_type.replace("_", " ")}</td>
                <td className="py-3 px-3 text-xs" style={{ color: "var(--warm-grey)" }}>{appt.budget_range}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 text-xs"
                    style={{ background: `${STATUS_COLORS[appt.status] || "#888"}20`, color: STATUS_COLORS[appt.status] || "#888", border: `1px solid ${STATUS_COLORS[appt.status] || "#888"}40` }}>
                    {appt.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <a href={`mailto:${appt.email}`} className="text-xs hover:text-champagne transition-colors"
                    style={{ color: "rgba(184,138,114,0.7)" }}>{appt.email}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <p className="text-center py-16 text-sm" style={{ color: "var(--stone)" }}>No appointments yet.</p>
        )}
      </div>
    </div>
  );
}
