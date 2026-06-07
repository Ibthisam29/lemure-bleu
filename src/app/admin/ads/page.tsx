"use client";
import { useState, useEffect } from "react";

type Ad = { id:string; title:string; body:string; image_url:string; cta_label:string; cta_link:string; position:string; bg_color:string; text_color:string; visible:boolean; sort_order:number; };
const P = { ivory:"#F7F2E8", stone:"#CFC8BC", emerald:"#1C3D35", champagne:"#C4965A", warmGrey:"#8C857A", white:"#FFFFFF" };
const inp:React.CSSProperties = { width:"100%", padding:"0.6rem 0.75rem", background:"white", border:`1px solid ${P.stone}`, color:P.emerald, fontSize:"0.82rem", fontWeight:300, outline:"none", fontFamily:"Jost,sans-serif", borderRadius:0 };
const lbl:React.CSSProperties = { fontSize:"0.52rem", letterSpacing:"0.15em", textTransform:"uppercase" as const, color:P.warmGrey, fontWeight:300, display:"block", marginBottom:"0.35rem", fontFamily:"Jost,sans-serif" };
const empty = { title:"", body:"", image_url:"", cta_label:"", cta_link:"", position:"homepage_banner", bg_color:"#1C3D35", text_color:"#F7F2E8", visible:true, sort_order:0 };

const POSITIONS: Record<string,string> = {
  homepage_banner: "Homepage Banner (full section)",
  global_top: "Global Top Bar (all pages)",
  stone_vault_top: "Stone Vault — Top",
  preorder_top: "VIP Preorder — Top",
  footer_promo: "Footer Promo",
};

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string|null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ads").then(r=>r.json()).then(d=>{ setAds(d.ads||[]); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  async function save() {
    if (!form.title) return;
    setSaving(true);
    try {
      const url = editId ? `/api/admin/ads?id=${editId}` : "/api/admin/ads";
      const res = await fetch(url, { method: editId?"PATCH":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const d = await res.json();
      if (d.ad) {
        if (editId) setAds(p=>p.map(x=>x.id===editId?d.ad:x));
        else setAds(p=>[d.ad,...p]);
        setForm(empty); setShowForm(false); setEditId(null);
      }
    } finally { setSaving(false); }
  }

  async function toggle(id:string, visible:boolean) {
    await fetch(`/api/admin/ads?id=${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({visible}) });
    setAds(p=>p.map(x=>x.id===id?{...x,visible}:x));
  }

  async function del(id:string) {
    if (!confirm("Delete this ad?")) return;
    await fetch(`/api/admin/ads?id=${id}`, { method:"DELETE" });
    setAds(p=>p.filter(x=>x.id!==id));
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem" }}>
        <div>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.52rem", letterSpacing:"0.25em", textTransform:"uppercase", color:P.champagne, marginBottom:"0.4rem" }}>Marketing</p>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.2rem", fontWeight:300, color:P.emerald }}>Ads & Banners</h1>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.72rem", color:P.warmGrey, fontWeight:300, marginTop:"0.25rem" }}>Place promotional banners on any page of the website</p>
        </div>
        <button onClick={()=>{setShowForm(!showForm);setForm(empty);setEditId(null);}}
          style={{ padding:"0.6rem 1.5rem", background:P.champagne, color:P.ivory, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>
          {showForm ? "Cancel" : "+ New Banner"}
        </button>
      </div>

      {showForm && (
        <div style={{ background:P.white, border:`1px solid ${P.stone}`, padding:"1.75rem", marginBottom:"2rem" }}>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.2rem", color:P.emerald, marginBottom:"1.5rem" }}>{editId?"Edit Banner":"New Banner"}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
            <div style={{ gridColumn:"1/-1" }}><label style={lbl}>Headline *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. New Collection Now Available" style={inp} /></div>
            <div style={{ gridColumn:"1/-1" }}><label style={lbl}>Body text (optional)</label><input value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} placeholder="Short description or offer details" style={inp} /></div>
            <div><label style={lbl}>Placement</label>
              <select value={form.position} onChange={e=>setForm(p=>({...p,position:e.target.value}))} style={{...inp,cursor:"pointer"}}>
                {Object.entries(POSITIONS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Image URL (optional)</label><input value={form.image_url} onChange={e=>setForm(p=>({...p,image_url:e.target.value}))} placeholder="https://..." style={inp} /></div>
            <div><label style={lbl}>CTA Button Label</label><input value={form.cta_label} onChange={e=>setForm(p=>({...p,cta_label:e.target.value}))} placeholder="e.g. View Collection" style={inp} /></div>
            <div><label style={lbl}>CTA Link</label><input value={form.cta_link} onChange={e=>setForm(p=>({...p,cta_link:e.target.value}))} placeholder="/stone-vault" style={inp} /></div>
            <div style={{ display:"flex", gap:"1rem", alignItems:"center" }}>
              <div style={{ flex:1 }}><label style={lbl}>Background Color</label><input type="color" value={form.bg_color} onChange={e=>setForm(p=>({...p,bg_color:e.target.value}))} style={{...inp,height:"42px",padding:"0.3rem",cursor:"pointer"}} /></div>
              <div style={{ flex:1 }}><label style={lbl}>Text Color</label><input type="color" value={form.text_color} onChange={e=>setForm(p=>({...p,text_color:e.target.value}))} style={{...inp,height:"42px",padding:"0.3rem",cursor:"pointer"}} /></div>
            </div>
            {/* Live preview */}
            <div style={{ gridColumn:"1/-1", padding:"1rem", background:form.bg_color, border:`1px solid ${P.stone}` }}>
              <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:form.text_color, opacity:0.6, marginBottom:"0.3rem" }}>Preview</p>
              <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.4rem", color:form.text_color, fontWeight:300 }}>{form.title || "Banner headline"}</p>
              {form.body && <p style={{ fontSize:"0.8rem", color:form.text_color, opacity:0.7, fontWeight:300, marginTop:"0.25rem" }}>{form.body}</p>}
              {form.cta_label && <div style={{ display:"inline-block", marginTop:"0.75rem", padding:"0.4rem 1rem", background:"rgba(255,255,255,0.15)", fontSize:"0.6rem", letterSpacing:"0.15em", textTransform:"uppercase", color:form.text_color, border:`1px solid ${form.text_color}40` }}>{form.cta_label}</div>}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <input type="checkbox" checked={form.visible} onChange={e=>setForm(p=>({...p,visible:e.target.checked}))} style={{ accentColor:P.champagne }} />
              <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.75rem", color:P.warmGrey, fontWeight:300 }}>Published on website</span>
            </div>
          </div>
          <button onClick={save} disabled={saving||!form.title}
            style={{ marginTop:"1.25rem", padding:"0.7rem 2rem", background:P.champagne, color:P.ivory, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"Jost,sans-serif", opacity:saving?0.6:1 }}>
            {saving?"Saving…":editId?"Update Banner":"Publish Banner"}
          </button>
        </div>
      )}

      {loading ? <p style={{ color:P.warmGrey, fontSize:"0.8rem" }}>Loading…</p> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {ads.map(ad => (
            <div key={ad.id} style={{ background:P.white, border:`1px solid ${P.stone}`, overflow:"hidden", opacity:ad.visible?1:0.5 }}>
              <div style={{ padding:"0.75rem 1.25rem", background:ad.bg_color, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:ad.text_color, fontWeight:300 }}>{ad.title}</p>
                  {ad.body && <p style={{ fontSize:"0.7rem", color:ad.text_color, opacity:0.65, fontWeight:300 }}>{ad.body.slice(0,60)}…</p>}
                </div>
                <span style={{ fontSize:"0.5rem", letterSpacing:"0.1em", textTransform:"uppercase", color:ad.text_color, opacity:0.6, fontFamily:"Jost,sans-serif" }}>{POSITIONS[ad.position]||ad.position}</span>
              </div>
              <div style={{ padding:"0.75rem 1.25rem", display:"flex", gap:"0.5rem", alignItems:"center", borderTop:`1px solid ${P.stone}` }}>
                <span style={{ flex:1, fontFamily:"Jost,sans-serif", fontSize:"0.65rem", color:P.warmGrey, fontWeight:300 }}>
                  {ad.visible ? "● Published" : "○ Hidden"} · {POSITIONS[ad.position]||ad.position}
                </span>
                <button onClick={()=>{setForm({...ad});setEditId(ad.id);setShowForm(true);window.scrollTo({top:0,behavior:"smooth"});}}
                  style={{ padding:"0.3rem 0.65rem", border:`1px solid ${P.emerald}`, background:"transparent", color:P.emerald, fontSize:"0.58rem", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>Edit</button>
                <button onClick={()=>toggle(ad.id,!ad.visible)}
                  style={{ padding:"0.3rem 0.65rem", border:`1px solid ${P.stone}`, background:"transparent", color:P.warmGrey, fontSize:"0.58rem", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>
                  {ad.visible?"Hide":"Show"}
                </button>
                <button onClick={()=>del(ad.id)}
                  style={{ padding:"0.3rem 0.65rem", border:"1px solid #e07070", background:"transparent", color:"#e07070", fontSize:"0.58rem", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>Delete</button>
              </div>
            </div>
          ))}
          {ads.length===0 && <p style={{ textAlign:"center", padding:"3rem", color:P.stone, fontSize:"0.8rem" }}>No banners yet. Create your first promotion above.</p>}
        </div>
      )}
    </div>
  );
}
