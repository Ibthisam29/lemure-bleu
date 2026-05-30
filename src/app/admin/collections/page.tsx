"use client";
import { useState, useEffect } from "react";
import type { Collection } from "@/types";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    collection_name: "", description: "", launch_date: "",
    quantity_total: "", quantity_available: "", price_range: "",
    image_url: "", stripe_price_id: "", status: "draft",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/admin/collections")
      .then(r => r.json())
      .then(d => { setCollections(d.collections || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity_total: parseInt(form.quantity_total) || 0,
          quantity_available: parseInt(form.quantity_available) || 0,
        }),
      });
      const d = await res.json();
      if (d.collection) {
        setCollections(prev => [d.collection, ...prev]);
        setForm(emptyForm);
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(184,138,114,0.2)",
    color: "var(--ivory)",
    padding: "0.5rem 0.75rem",
    fontSize: "0.8rem",
    width: "100%",
    outline: "none",
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="label-luxury mb-2" style={{ color: "rgba(184,138,114,0.7)" }}>CMS</p>
          <h1 className="heading-display text-3xl" style={{ color: "var(--ivory)" }}>
            Collections ({collections.length})
          </h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-5 text-xs">
          + Add Collection
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,138,114,0.15)" }}>
          <h3 className="text-sm mb-6" style={{ color: "var(--ivory)" }}>New Collection</h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Collection Name *" value={form.collection_name}
              onChange={e => setForm(p => ({ ...p, collection_name: e.target.value }))} style={inputStyle} className="col-span-2" />
            <textarea placeholder="Description" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3} className="col-span-2 resize-none" style={inputStyle} />
            <input placeholder="Launch Date" type="date" value={form.launch_date}
              onChange={e => setForm(p => ({ ...p, launch_date: e.target.value }))} style={inputStyle} />
            <input placeholder="Price Range (e.g. SGD 5,000 – 50,000)" value={form.price_range}
              onChange={e => setForm(p => ({ ...p, price_range: e.target.value }))} style={inputStyle} />
            <input placeholder="Total Quantity" type="number" value={form.quantity_total}
              onChange={e => setForm(p => ({ ...p, quantity_total: e.target.value }))} style={inputStyle} />
            <input placeholder="Available Quantity" type="number" value={form.quantity_available}
              onChange={e => setForm(p => ({ ...p, quantity_available: e.target.value }))} style={inputStyle} />
            <input placeholder="Image URL" value={form.image_url}
              onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} style={inputStyle} />
            <input placeholder="Stripe Price ID (optional)" value={form.stripe_price_id}
              onChange={e => setForm(p => ({ ...p, stripe_price_id: e.target.value }))} style={inputStyle} />
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="sold_out">Sold Out</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-6 text-xs">
              {saving ? "Saving..." : "Save Collection"}
            </button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
              className="btn-outline py-2 px-6 text-xs"
              style={{ color: "rgba(248,243,234,0.6)", borderColor: "rgba(248,243,234,0.2)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: "rgba(248,243,234,0.4)" }}>Loading...</p>
      ) : (
        <div className="space-y-4">
          {collections.map(col => (
            <div key={col.id} className="p-5 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,138,114,0.1)" }}>
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: "var(--ivory)" }}>{col.collection_name}</h3>
                <p className="text-xs" style={{ color: "rgba(248,243,234,0.4)" }}>
                  {col.quantity_available}/{col.quantity_total} available · {col.price_range}
                </p>
              </div>
              <span className="px-2 py-1 text-xs"
                style={{
                  background: col.status === "published" ? "#7eca8e20" : "#88888820",
                  color: col.status === "published" ? "#7eca8e" : "#aaa",
                  border: `1px solid ${col.status === "published" ? "#7eca8e40" : "#88888840"}`,
                }}>
                {col.status}
              </span>
            </div>
          ))}
          {collections.length === 0 && (
            <p className="text-center py-16 text-sm" style={{ color: "rgba(248,243,234,0.3)" }}>
              No collections yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
