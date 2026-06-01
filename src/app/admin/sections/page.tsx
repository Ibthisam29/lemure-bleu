"use client";
import { useState, useEffect } from "react";

type Section = { id:string; section_key:string; title:string; subtitle:string; body:string; visible:boolean; };

const LABELS: Record<string,string> = {
  hero:"Hero Banner", maison:"Maison Introduction", stone_vault:"Stone Vault Preview",
  limited_ed:"Limited Edition Drop", bespoke:"Bespoke Heirloom", vip_preorder:"VIP Preorder Banner",
  trust_bar:"Trust Bar", footer:"Footer",
};

const inputStyle = { width:"100%", padding:"0.6rem 0", background:"transparent", border:"none", borderBottom:"1px solid #CFC8BC", color:"#1C3D35", fontSize:"0.82rem", fontWeight:300, outline:"none", fontFamily:"Jost,sans-serif" };

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [editing, setEditing] = useState<string|null>(null);
  const [form, setForm] = useState({ title:"", subtitle:"", body:"" });
  const [saving, setSaving] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/sections").then(r=>r.json()).then(d=>{ setSections(d.sections||[]); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  async function toggleVisible(id:string, visible:boolean) {
    setSaving(id);
    await fetch(`/api/admin/sections?id=${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({visible}) });
    setSections(p=>p.map(s=>s.id===id?{...s,visible}:s));
    setSaving(null);
  }

  async function saveEdit(id:string) {
    setSaving(id);
    await fetch(`/api/admin/sections?id=${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    setSections(p=>p.map(s=>s.id===id?{...s,...form}:s));
    setEditing(null); setSaving(null);
  }

  function startEdit(s:Section) {
    setForm({ title:s.title||"", subtitle:s.subtitle||"", body:s.body||"" });
    setEditing(s.id);
  }

  return (
    <div>
      <div style={{ marginBottom:"2rem" }}>
        <p style={{ fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#C4965A", marginBottom:"0.4rem" }}>CMS</p>
        <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.2rem", fontWeight:300, color:"#1C3D35" }}>Site Sections</h1>
        <p style={{ fontSize:"0.75rem", color:"#8C857A", fontWeight:300, marginTop:"0.25rem" }}>Show, hide, or edit content sections on the website</p>
      </div>

      {loading ? <p style={{ color:"#8C857A", fontSize:"0.8rem" }}>Loading…</p> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          {sections.map(s => (
            <div key={s.id} style={{ background:"#FFFFFF", border:`1px solid ${s.visible?"var(--stone)":"rgba(196,150,90,0.3)"}`, padding:"1.5rem", transition:"all 0.2s", opacity:s.visible?1:0.55 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: editing===s.id?"1.5rem":"0" }}>
                <div>
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.2rem", color:"#1C3D35", fontWeight:300 }}>{LABELS[s.section_key]||s.section_key}</p>
                  {s.title && <p style={{ fontSize:"0.72rem", color:"#8C857A", fontWeight:300, marginTop:"0.2rem" }}>{s.title.slice(0,60)}{s.title.length>60?"…":""}</p>}
                </div>
                <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
                  {/* Visible toggle */}
                  <label style={{ display:"flex", alignItems:"center", gap:"0.4rem", cursor:"pointer" }}>
                    <div onClick={()=>toggleVisible(s.id,!s.visible)}
                      style={{ width:"36px", height:"18px", borderRadius:"9px", background:s.visible?"var(--emerald)":"var(--stone)", position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                      <div style={{ position:"absolute", top:"2px", left:s.visible?"18px":"2px", width:"14px", height:"14px", borderRadius:"50%", background:"white", transition:"left 0.2s" }} />
                    </div>
                    <span style={{ fontSize:"0.65rem", color:"#8C857A", fontWeight:300 }}>{s.visible?"Visible":"Hidden"}</span>
                  </label>
                  <button onClick={()=>editing===s.id?setEditing(null):startEdit(s)}
                    style={{ padding:"0.35rem 0.75rem", border:"1px solid var(--emerald)", background:"transparent", color:"#1C3D35", fontSize:"0.6rem", cursor:"pointer", fontFamily:"Jost,sans-serif", letterSpacing:"0.1em" }}>
                    {editing===s.id?"Cancel":"Edit"}
                  </button>
                </div>
              </div>

              {editing===s.id && (
                <div>
                  <div style={{ display:"grid", gap:"1rem", marginBottom:"1rem" }}>
                    <div>
                      <label style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#8C857A", fontWeight:300, display:"block", marginBottom:"0.3rem" }}>Headline / Title</label>
                      <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#8C857A", fontWeight:300, display:"block", marginBottom:"0.3rem" }}>Subtitle / Eyebrow</label>
                      <input value={form.subtitle} onChange={e=>setForm(p=>({...p,subtitle:e.target.value}))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#8C857A", fontWeight:300, display:"block", marginBottom:"0.3rem" }}>Body Text</label>
                      <textarea value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} rows={4} style={{...inputStyle, resize:"none"}} />
                    </div>
                  </div>
                  <button onClick={()=>saveEdit(s.id)} disabled={saving===s.id}
                    style={{ padding:"0.6rem 1.5rem", background:"#C4965A", color:"var(--ivory)", fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"Jost,sans-serif", opacity:saving===s.id?0.6:1 }}>
                    {saving===s.id?"Saving…":"Save Changes"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
