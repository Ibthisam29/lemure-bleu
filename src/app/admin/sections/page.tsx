"use client";
import { useState, useEffect } from "react";
import { A } from "@/lib/adminStyles";
import { PageHeader } from "@/components/admin/PageHeader";

type Section = { id:string; section_key:string; title:string; subtitle:string; body:string; visible:boolean; };
const LABELS: Record<string,{name:string;desc:string}> = {
  hero:       { name:"Hero Banner",          desc:"Main headline, subheadline, and CTA buttons" },
  maison:     { name:"Maison Introduction",  desc:"'The Maison of Quiet Luxury' section" },
  stone_vault:{ name:"Stone Vault Preview",  desc:"Gemstone cards on homepage" },
  limited_ed: { name:"Limited Edition Drop", desc:"Blue Legacy Collection section" },
  bespoke:    { name:"Bespoke Heirloom",     desc:"Commission an Heirloom section" },
  vip_preorder:{name:"VIP Preorder Banner",  desc:"Preorder call-to-action strip" },
  trust_bar:  { name:"Trust Bar Marquee",    desc:"Scrolling trust items strip" },
  footer:     { name:"Footer",               desc:"Contact, links, disclaimer" },
};

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
    await fetch(`/api/admin/sections?id=${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({visible})});
    setSections(p=>p.map(s=>s.id===id?{...s,visible}:s));
    setSaving(null);
  }

  async function saveEdit(id:string) {
    setSaving(id);
    await fetch(`/api/admin/sections?id=${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    setSections(p=>p.map(s=>s.id===id?{...s,...form}:s));
    setEditing(null); setSaving(null);
  }

  if (loading) return <div style={{color:A.warmGrey,fontSize:"0.8rem"}}>Loading…</div>;

  return (
    <div>
      <PageHeader eyebrow="Website CMS" title="Page Sections"
        sub="Toggle visibility or edit text content for each homepage section. Changes go live immediately." />

      <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
        {sections.map(s => {
          const meta = LABELS[s.section_key] || { name:s.section_key, desc:"" };
          const isEditing = editing === s.id;
          return (
            <div key={s.id} style={{ ...A.card, padding:0, overflow:"hidden", opacity:s.visible?1:0.6, transition:"opacity .2s" }}>
              {/* Header row */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1rem 1.25rem", borderBottom: isEditing?`1px solid ${A.stone}`:"none" }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, marginBottom:"0.2rem" }}>{meta.name}</div>
                  <div style={{ fontSize:"0.65rem", color:A.warmGrey, fontWeight:300, fontFamily:"'Jost',sans-serif" }}>
                    {meta.desc} {s.title && `· "${s.title.slice(0,40)}${s.title.length>40?"…":""}"`}
                  </div>
                </div>
                <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
                  {/* Toggle */}
                  <div onClick={()=>toggleVisible(s.id,!s.visible)}
                    style={{ width:"40px", height:"20px", borderRadius:"10px", background:s.visible?A.emerald:A.stone, position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:"3px", left:s.visible?"22px":"3px", width:"14px", height:"14px", borderRadius:"50%", background:"white", transition:"left .2s" }} />
                  </div>
                  <span style={{ fontSize:"0.6rem", color:s.visible?A.emerald:A.stone, fontFamily:"'Jost',sans-serif", width:"48px" }}>{s.visible?"Visible":"Hidden"}</span>
                  <button onClick={()=>{ if(isEditing){setEditing(null);}else{setForm({title:s.title||"",subtitle:s.subtitle||"",body:s.body||""});setEditing(s.id);} }}
                    style={{...A.btnOutline, padding:"0.3rem 0.8rem", fontSize:"0.54rem"}}>
                    {isEditing?"Cancel":"Edit Text"}
                  </button>
                </div>
              </div>

              {/* Edit form */}
              {isEditing && (
                <div style={{ padding:"1.25rem", backgroundColor:"#FDFAF5" }}>
                  <div style={{ display:"grid", gap:"1rem" }}>
                    <div>
                      <label style={A.label}>Section Headline / Title</label>
                      <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={A.input} />
                    </div>
                    <div>
                      <label style={A.label}>Subtitle / Eyebrow Label</label>
                      <input value={form.subtitle} onChange={e=>setForm(p=>({...p,subtitle:e.target.value}))} style={A.input} />
                    </div>
                    <div>
                      <label style={A.label}>Body Text / Description</label>
                      <textarea value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} rows={3} style={{...A.input,resize:"none",display:"block"}} />
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"0.75rem", marginTop:"1rem" }}>
                    <button onClick={()=>saveEdit(s.id)} disabled={saving===s.id} style={{...A.btnGold, opacity:saving===s.id?0.6:1}}>
                      {saving===s.id?"Saving…":"Save Changes"}
                    </button>
                    <button onClick={()=>setEditing(null)} style={A.btnOutline}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {sections.length===0 && (
          <div style={{ padding:"3rem", textAlign:"center", color:A.stone, fontSize:"0.8rem", border:`1px dashed ${A.stone}` }}>
            No sections found. Make sure the Supabase migration has been run.
          </div>
        )}
      </div>
    </div>
  );
}
