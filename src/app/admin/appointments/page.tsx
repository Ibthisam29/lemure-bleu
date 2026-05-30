import { createAdminClient } from "@/lib/supabase";
import type { Appointment } from "@/types";

async function getAppointments(): Promise<Appointment[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("preferred_date", { ascending: true });
    return (data as Appointment[]) || [];
  } catch { return []; }
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#7ec8e3",
  approved: "#7eca8e",
  rejected: "#ca7e7e",
  completed: "#a78eca",
};

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div>
      <div className="mb-8">
        <p className="label-luxury mb-2" style={{ color: "rgba(184,138,114,0.7)" }}>Calendar</p>
        <h1 className="heading-display text-3xl" style={{ color: "var(--ivory)" }}>
          Appointments ({appointments.length})
        </h1>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(184,138,114,0.15)" }}>
              {["Client", "Date & Time", "Type", "Budget", "Status", "Contact"].map(h => (
                <th key={h} className="text-left py-3 px-3"
                  style={{ color: "rgba(248,243,234,0.4)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="py-3 px-3">
                  <p className="text-sm" style={{ color: "var(--ivory)" }}>{appt.full_name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(248,243,234,0.4)" }}>{appt.phone}</p>
                </td>
                <td className="py-3 px-3">
                  <p className="text-xs" style={{ color: "rgba(248,243,234,0.65)" }}>
                    {new Date(appt.preferred_date).toLocaleDateString()}
                  </p>
                  {appt.preferred_time && (
                    <p className="text-xs" style={{ color: "rgba(248,243,234,0.4)" }}>{appt.preferred_time}</p>
                  )}
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(248,243,234,0.6)" }}>
                  {appt.appointment_type.replace("_", " ")}
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: "rgba(248,243,234,0.5)" }}>
                  {appt.budget_range}
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 text-xs"
                    style={{
                      background: `${STATUS_COLORS[appt.status] || "#888"}20`,
                      color: STATUS_COLORS[appt.status] || "#888",
                      border: `1px solid ${STATUS_COLORS[appt.status] || "#888"}40`,
                    }}>
                    {appt.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <a href={`mailto:${appt.email}`}
                    className="text-xs hover:text-champagne transition-colors"
                    style={{ color: "rgba(184,138,114,0.7)" }}>
                    {appt.email}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <p className="text-center py-16 text-sm" style={{ color: "rgba(248,243,234,0.3)" }}>
            No appointments yet.
          </p>
        )}
      </div>
    </div>
  );
}
