"use client";
import { useState, useEffect } from "react";

type Ev = { id:string; title:string; description:string; event_date:string; location:string; event_type:string; image_url:string; cta_label:string; cta_link:string; visible:boolean; featured:boolean; sort_order:number; };
const P = { ivory:"#F7F2E8", stone:"#CFC8BC", emerald:"#1C3D35", champagne:"#C4965A", warmGrey:"#8C857A", white:"#FFFFFF" };
const inp:React.CSSProperties = { width:"100%", padding:"0.6rem 0.75rem", background:"white", border:`1px solid ${P.stone}`, color:P.emerald, fontSize:"0.82rem", fontWeight:300, outline:"none", fontFamily:"Jost,sans-serif", borderRadius:0 };
const lbl:React.CSSProperties = { fontSize:"0.52rem", letterSpacing:"0.15em", textTransform:"uppercase" as const, color:P.warmGrey, fontWeight:300, display:"block", marginBottom:"0.35rem", fontFamily:"Jost,sans-serif" };
const empty = { title:"", description:"", event_date:"", location:"", event_type:"private", image_url:"", cta_label:"Register Interest", cta_link:"/vip", visible:true, featured:false, sort_order:0 };

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string|null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/events").then(r=>r.json()).then(d=>{ setEvents(d.events||[]); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  async function save() {
    if (!form.title) return;
    setSaving(true);
    try {
      const url = editId ? `/api/admin/events?id=${editId}` : "/api/admin/events";
      const res = await fetch(url, { method: editId?"PATCH":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const d = await res.json();
      if (d.event) {
        if (editId) setEvents(p=>p.map(x=>x.id===editId?d.event:x));
        else setEvents(p=>[d.event,...p]);
        setForm(empty); setShowForm(false); setEditId(null);
      }
    } finally { setSaving(false); }
  }

  async function toggle(id:string, visible:boolean) {
    await fetch(`/api/admin/events?id=${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({visible}) });
    setEvents(p=>p.map(x=>x.id===id?{...x,visible}:x));
  }

  async function del(id:string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/admin/events?id=${id}`, { method:"DELETE" });
    setEvents(p=>p.filter(x=>x.id!==id));
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem" }}>
        <div>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.52rem", letterSpacing:"0.25em", textTransform:"uppercase", color:P.champagne, marginBottom:"0.4rem" }}>Events</p>
          <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"2.2rem", fontWeight:300, color:P.emerald }}>Events Management</h1>
          <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.72rem", color:P.warmGrey, fontWeight:300, marginTop:"0.25rem" }}>Events appear on the homepage automatically when published</p>
        </div>
        <button onClick={()=>{setShowForm(!showForm);setForm(empty);setEditId(null);}}
          style={{ padding:"0.6rem 1.5rem", background:P.champagne, color:P.ivory, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>
          {showForm ? "Cancel" : "+ Add Event"}
        </button>
      </div>

      {showForm && (
        <div style={{ background:P.white, border:`1px solid ${P.stone}`, padding:"1.75rem", marginBottom:"2rem" }}>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.2rem", color:P.emerald, marginBottom:"1.5rem" }}>{editId?"Edit Event":"New Event"}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
            <div style={{ gridColumn:"1/-1" }}><label style={lbl}>Event Title *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Private Gemstone Preview Evening" style={inp} /></div>
            <div><label style={lbl}>Event Date & Time</label><input type="datetime-local" value={form.event_date} onChange={e=>setForm(p=>({...p,event_date:e.target.value}))} style={inp} /></div>
            <div><label style={lbl}>Location</label><input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Private Atelier, Orchard" style={inp} /></div>
            <div><label style={lbl}>Event Type</label>
              <select value={form.event_type} onChange={e=>setForm(p=>({...p,event_type:e.target.value}))} style={{...inp,cursor:"pointer"}}>
                <option value="private">Private</option><option value="vip">VIP</option><option value="public">Public</option><option value="auction">Auction</option>
              </select>
            </div>
            <div><label style={lbl}>Image URL</label><input value={form.image_url} onChange={e=>setForm(p=>({...p,image_url:e.target.value}))} placeholder="https://..." style={inp} /></div>
            <div style={{ gridColumn:"1/-1" }}><label style={lbl}>Description</label><textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} style={{...inp,resize:"none",width:"100%"}} /></div>
            <div><label style={lbl}>CTA Button Label</label><input value={form.cta_label} onChange={e=>setForm(p=>({...p,cta_label:e.target.value}))} style={inp} /></div>
            <div><label style={lbl}>CTA Link</label><input value={form.cta_link} onChange={e=>setForm(p=>({...p,cta_link:e.target.value}))} style={inp} /></div>
          </div>
          <div style={{ display:"flex", gap:"2rem", marginTop:"1.25rem", marginBottom:"1.25rem" }}>
            {[["featured","Featured"],["visible","Published on website"]].map(([k,l])=>(
              <label key={k} style={{ display:"flex", alignItems:"center", gap:"0.5rem", cursor:"pointer" }}>
                <input type="checkbox" checked={form[k as "featured"|"visible"]} onChange={e=>setForm(p=>({...p,[k]:e.target.checked}))} style={{ accentColor:P.champagne }} />
                <span style={{ fontFamily:"Jost,sans-serif", fontSize:"0.75rem", color:P.warmGrey, fontWeight:300 }}>{l}</span>
              </label>
            ))}
          </div>
          <button onClick={save} disabled={saving||!form.title}
            style={{ padding:"0.7rem 2rem", background:P.champagne, color:P.ivory, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"Jost,sans-serif", opacity:saving?0.6:1 }}>
            {saving?"Saving…":editId?"Update Event":"Publish Event"}
          </button>
        </div>
      )}

      {loading ? <p style={{ color:P.warmGrey, fontSize:"0.8rem" }}>Loading…</p> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {events.map(ev => (
            <div key={ev.id} style={{ background:P.white, border:`1px solid ${P.stone}`, padding:"1.25rem 1.5rem", display:"flex", alignItems:"center", gap:"1.5rem", opacity:ev.visible?1:0.55 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.25rem" }}>
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:P.emerald, fontWeight:300 }}>{ev.title}</p>
                  <span style={{ fontSize:"0.5rem", letterSpacing:"0.1em", textTransform:"uppercase", color:P.champagne, border:`1px solid ${P.champagne}40`, padding:"0.15rem 0.4rem", fontFamily:"Jost,sans-serif" }}>{ev.event_type}</span>
                  {ev.featured && <span style={{ fontSize:"0.5rem", letterSpacing:"0.1em", textTransform:"uppercase", background:P.champagne, color:"white", padding:"0.15rem 0.4rem", fontFamily:"Jost,sans-serif" }}>Featured</span>}
                </div>
                <p style={{ fontFamily:"Jost,sans-serif", fontSize:"0.7rem", color:P.warmGrey, fontWeight:300 }}>
                  {ev.event_date ? new Date(ev.event_date).toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "Date TBC"}
                  {ev.location ? ` · ${ev.location}` : ""}
                </p>
              </div>
              <div style={{ display:"flex", gap:"0.5rem", flexShrink:0 }}>
                <button onClick={()=>{setForm({...ev,event_date:ev.event_date?.slice(0,16)||""});setEditId(ev.id);setShowForm(true);window.scrollTo({top:0,behavior:"smooth"});}}
                  style={{ padding:"0.35rem 0.75rem", border:`1px solid ${P.emerald}`, background:"transparent", color:P.emerald, fontSize:"0.6rem", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>Edit</button>
                <button onClick={()=>toggle(ev.id,!ev.visible)}
                  style={{ padding:"0.35rem 0.75rem", border:`1px solid ${P.stone}`, background:"transparent", color:P.warmGrey, fontSize:"0.6rem", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>
                  {ev.visible?"Hide":"Show"}
                </button>
                <button onClick={()=>del(ev.id)}
                  style={{ padding:"0.35rem 0.75rem", border:"1px solid #e07070", background:"transparent", color:"#e07070", fontSize:"0.6rem", cursor:"pointer", fontFamily:"Jost,sans-serif" }}>Delete</button>
              </div>
            </div>
          ))}
          {events.length===0 && <p style={{ textAlign:"center", padding:"3rem", color:P.stone, fontSize:"0.8rem" }}>No events yet. Add your first event above.</p>}
        </div>
      )}
    </div>
  );
}
