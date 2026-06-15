import { A, statusPill } from "@/lib/adminStyles";
import { PageHeader } from "@/components/admin/PageHeader";
import Link from "next/link";

async function getLeads() {
  
  try {
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("vip_leads").select("*").order("created_at",{ascending:false});
    return data || [];
  } catch { return []; }
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();
  const counts = { new:0, contacted:0, qualified:0, converted:0 };
  leads.forEach((l:{status:string}) => { if(l.status in counts) counts[l.status as keyof typeof counts]++; });

  return (
    <div>
      <PageHeader eyebrow="Clients" title="VIP Leads" sub={`${leads.length} total · ${counts.new} new`}
        action={
          <Link href="/api/admin/export-leads" style={{ ...A.btnOutline, textDecoration:"none", display:"inline-block" }}>Export CSV</Link>
        }
      />

      {/* Summary pills */}
      <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} style={{ ...A.card, padding:"0.75rem 1.25rem", display:"flex", flex:"none", gap:"0.75rem", alignItems:"center" }}>
            <span style={statusPill(status)}>{status.replace(/_/g," ")}</span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", color:A.emerald, fontWeight:300 }}>{count}</span>
          </div>
        ))}
      </div>

      <div style={{ ...A.card, padding:0, overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              {["Client","Contact","Interest","Budget","Status","Date"].map(h=>(
                <th key={h} style={A.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((l:{id:string;full_name:string;email:string;phone:string;country:string;interest_type:string;budget_range:string;status:string;created_at:string;message:string}) => (
              <tr key={l.id} style={{ transition:"background .15s" }} >
                <td style={{ ...A.td, paddingLeft:"1rem" }}>
                  <div style={{ fontSize:"0.82rem", color:A.emerald, fontWeight:300 }}>{l.full_name}</div>
                  <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{l.country}</div>
                </td>
                <td style={A.td}>
                  <a href={`mailto:${l.email}`} style={{ fontSize:"0.72rem", color:A.champagne, textDecoration:"none" }}>{l.email}</a>
                  <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{l.phone}</div>
                </td>
                <td style={A.td}>
                  <div style={{ fontSize:"0.72rem", color:A.emerald, fontWeight:300 }}>{l.interest_type?.replace(/_/g," ")}</div>
                </td>
                <td style={A.td}>
                  <div style={{ fontSize:"0.72rem", color:A.warmGrey, fontWeight:300 }}>{l.budget_range?.replace(/_/g," ")}</div>
                </td>
                <td style={A.td}><span style={statusPill(l.status)}>{l.status?.replace(/_/g," ")}</span></td>
                <td style={{ ...A.td, paddingRight:"1rem", fontSize:"0.65rem", color:A.warmGrey, fontWeight:300 }}>
                  {new Date(l.created_at).toLocaleDateString("en-SG")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length===0 && <div style={{padding:"3rem",textAlign:"center",color:A.stone,fontSize:"0.8rem"}}>No leads yet. VIP registrations will appear here.</div>}
      </div>
    </div>
  );
}
