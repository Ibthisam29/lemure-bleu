import { createAdminClient } from "@/lib/supabase";

export default async function WaitlistAdminPage() {
  let rows: any[] = [];
  try { const { data } = await createAdminClient().from("guest_waitlist").select("*").order("created_at", { ascending: false }); rows = data || []; } catch {}

  const P = { ivory:"#F7F2E8", ivoryDeep:"#EDE6D6", stone:"#CFC8BC", champagne:"#C4965A", emerald:"#1C3D35", warmGrey:"#8C857A", white:"#FFFFFF" };
  const thStyle: React.CSSProperties = { padding:"0.7rem 1rem", fontFamily:"Jost,sans-serif", fontSize:"0.48rem", letterSpacing:"0.18em", textTransform:"uppercase", color:P.warmGrey, fontWeight:400, textAlign:"left", borderBottom:`1px solid ${P.stone}`, whiteSpace:"nowrap" };
  const tdStyle: React.CSSProperties = { padding:"0.85rem 1rem", fontFamily:"Jost,sans-serif", fontSize:"0.75rem", fontWeight:300, color:P.emerald, borderBottom:`1px solid rgba(207,200,188,0.5)`, verticalAlign:"top" };

  return (
    <div>
      <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.52rem", letterSpacing:"0.25em", textTransform:"uppercase", color:P.champagne, marginBottom:"0.4rem" }}>CRM</p>
      <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.4rem", fontWeight:300, color:P.emerald, marginBottom:"1.75rem" }}>Guest Waitlist</h1>

      <div style={{ background:P.white, border:`1px solid ${P.stone}`, overflowX:"auto" }}>
        {rows.length === 0 ? (
          <div style={{ padding:"3rem", textAlign:"center" }}>
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.82rem", color:P.warmGrey }}>No waitlist registrations yet.</p>
            <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.72rem", color:P.stone, marginTop:"0.5rem" }}>Submissions from <a href="/waitlist" style={{ color:P.champagne }}>lemurebleu.com/waitlist</a> appear here.</p>
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:P.ivoryDeep }}>
                {["Name","Category","Email","Phone","Country","Interests","Budget","Appointment","Date"].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.id}>
                  <td style={tdStyle}>{r.full_name}</td>
                  <td style={tdStyle}><span style={{ padding:"0.2rem 0.6rem", background:"rgba(28,61,53,0.07)", fontSize:"0.65rem", color:P.emerald }}>{r.guest_category||"—"}</span></td>
                  <td style={{ ...tdStyle, color:P.champagne }}><a href={`mailto:${r.email}`} style={{ color:P.champagne, textDecoration:"none" }}>{r.email}</a></td>
                  <td style={{ ...tdStyle, color:P.warmGrey }}>{r.phone||"—"}</td>
                  <td style={{ ...tdStyle, color:P.warmGrey }}>{r.country_city||"—"}</td>
                  <td style={{ ...tdStyle, color:P.warmGrey, maxWidth:"180px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.interests||"—"}</td>
                  <td style={{ ...tdStyle, color:P.warmGrey }}>{r.purchase_interest||"—"}</td>
                  <td style={{ ...tdStyle }}><span style={{ padding:"0.15rem 0.5rem", background: r.open_to_appointment==="Yes" ? "rgba(28,61,53,0.1)" : "transparent", color: r.open_to_appointment==="Yes" ? P.emerald : P.warmGrey, fontSize:"0.65rem" }}>{r.open_to_appointment||"—"}</span></td>
                  <td style={{ ...tdStyle, color:P.stone, whiteSpace:"nowrap" }}>{new Date(r.created_at).toLocaleDateString("en-SG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.65rem", color:P.stone, marginTop:"0.75rem" }}>{rows.length} guest{rows.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
