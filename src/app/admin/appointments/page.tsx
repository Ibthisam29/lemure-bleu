import { A, statusPill } from "@/lib/adminStyles";
import { PageHeader } from "@/components/admin/PageHeader";

async function getAppointments() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("appointments").select("*").order("preferred_date",{ascending:true});
    return data || [];
  } catch { return []; }
}

const TYPE_LABELS: Record<string,string> = { bespoke:"Bespoke Jewellery", bridal:"Bridal", gemstone_sourcing:"Gemstone Sourcing", heirloom:"Heirloom Redesign", vip_preorder:"VIP Preorder", private_auction:"Private Auction / Trade" };

export default async function AdminAppointmentsPage() {
  const appts = await getAppointments();
  const pending = appts.filter((a:{status:string})=>a.status==="pending").length;

  return (
    <div>
      <PageHeader eyebrow="Clients" title="Appointments" sub={`${appts.length} total · ${pending} pending review`} />

      <div style={{ ...A.card, padding:0, overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>{["Client","Date & Time","Type","Budget","Status","Actions"].map(h=><th key={h} style={A.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {appts.map((a:{id:string;full_name:string;email:string;phone:string;preferred_date:string;preferred_time:string;appointment_type:string;budget_range:string;status:string;message:string}) => (
              <tr key={a.id} >
                <td style={{ ...A.td, paddingLeft:"1rem" }}>
                  <div style={{ fontSize:"0.82rem", color:A.emerald, fontWeight:300 }}>{a.full_name}</div>
                  <a href={`mailto:${a.email}`} style={{ fontSize:"0.62rem", color:A.champagne, textDecoration:"none" }}>{a.email}</a>
                  {a.phone && <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{a.phone}</div>}
                </td>
                <td style={A.td}>
                  <div style={{ fontSize:"0.8rem", color:A.emerald, fontWeight:300 }}>{new Date(a.preferred_date).toLocaleDateString("en-SG",{day:"numeric",month:"short",year:"numeric"})}</div>
                  {a.preferred_time && <div style={{ fontSize:"0.65rem", color:A.warmGrey, fontWeight:300 }}>{a.preferred_time}</div>}
                </td>
                <td style={A.td}><div style={{ fontSize:"0.75rem", color:A.emerald, fontWeight:300 }}>{TYPE_LABELS[a.appointment_type]||a.appointment_type}</div></td>
                <td style={A.td}><div style={{ fontSize:"0.72rem", color:A.warmGrey, fontWeight:300 }}>{a.budget_range?.replace(/_/g," ")}</div></td>
                <td style={A.td}><span style={statusPill(a.status)}>{a.status}</span></td>
                <td style={{ ...A.td, paddingRight:"1rem" }}>
                  <a href={`mailto:${a.email}?subject=Re: Your Lemure Bleu Appointment Request`} style={{ fontSize:"0.6rem", color:A.champagne, textDecoration:"none", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>Contact →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appts.length===0 && <div style={{padding:"3rem",textAlign:"center",color:A.stone,fontSize:"0.8rem"}}>No appointments yet.</div>}
      </div>
    </div>
  );
}
