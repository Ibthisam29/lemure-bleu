import { A, statusPill } from "@/lib/adminStyles";
import { PageHeader } from "@/components/admin/PageHeader";

async function getPreorders() {
  
  try {
    const { createAdminClient } = await import("@/lib/supabase");
    const { data } = await createAdminClient().from("preorders").select("*").order("created_at",{ascending:false});
    return data || [];
  } catch { return []; }
}

const TIER_LABELS: Record<string,string> = { blue_entry:"Blue Entry — SGD 300", maison:"Maison — SGD 1,000", legacy:"Legacy — SGD 3,000" };

export default async function AdminPreordersPage() {
  const preorders = await getPreorders();
  const totalRevenue = preorders.filter((p:{payment_status:string})=>p.payment_status==="paid").reduce((s,p:{amount:number})=>s+p.amount,0);

  return (
    <div>
      <PageHeader eyebrow="Payments" title="Preorders" sub={`${preorders.length} registrations · SGD ${totalRevenue.toLocaleString()} confirmed`} />

      <div style={{ ...A.card, padding:0, overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>{["Client","Email","Tier","Amount","Payment","Allocation","Date"].map(h=><th key={h} style={A.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {preorders.map((p:{id:string;full_name:string;email:string;phone:string;preorder_tier:string;amount:number;currency:string;payment_status:string;allocation_status:string;created_at:string}) => (
              <tr key={p.id} >
                <td style={{ ...A.td, paddingLeft:"1rem" }}>
                  <div style={{ fontSize:"0.82rem", color:A.emerald, fontWeight:300 }}>{p.full_name}</div>
                  {p.phone && <div style={{ fontSize:"0.62rem", color:A.warmGrey, fontWeight:300 }}>{p.phone}</div>}
                </td>
                <td style={A.td}><a href={`mailto:${p.email}`} style={{ fontSize:"0.72rem", color:A.champagne, textDecoration:"none" }}>{p.email}</a></td>
                <td style={A.td}><div style={{ fontSize:"0.72rem", color:A.emerald, fontWeight:300 }}>{TIER_LABELS[p.preorder_tier]||p.preorder_tier}</div></td>
                <td style={A.td}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.champagne }}>{p.currency} {p.amount.toLocaleString()}</div></td>
                <td style={A.td}><span style={statusPill(p.payment_status)}>{p.payment_status?.replace(/_/g," ")}</span></td>
                <td style={A.td}><span style={statusPill(p.allocation_status)}>{p.allocation_status?.replace(/_/g," ")}</span></td>
                <td style={{ ...A.td, paddingRight:"1rem", fontSize:"0.65rem", color:A.warmGrey, fontWeight:300 }}>
                  {new Date(p.created_at).toLocaleDateString("en-SG")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {preorders.length===0 && <div style={{padding:"3rem",textAlign:"center",color:A.stone,fontSize:"0.8rem"}}>No preorders yet.</div>}
      </div>
    </div>
  );
}
