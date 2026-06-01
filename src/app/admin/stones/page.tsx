"use client";
import { useState, useEffect } from "react";
import type { Stone } from "@/types";

export default function AdminStonesPage() {
  const [stones, setStones] = useState<Stone[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    stone_name: "", stone_type: "", origin: "", carat: "", cut: "",
    colour: "", clarity: "", treatment: "", certificate_lab: "",
    certificate_number: "", description: "", image_url: "", price: "",
    price_visibility: "price_on_request", status: "available",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/admin/stones")
      .then(r => r.json())
      .then(d => { setStones(d.stones || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/stones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, carat: parseFloat(form.carat) || 0 }),
      });
      const d = await res.json();
      if (d.stone) {
        setStones(prev => [d.stone, ...prev]);
        setForm(emptyForm);
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    background: "rgba(28,61,53,0.05)",
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
            Stone Vault ({stones.length})
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary py-2 px-5 text-xs"
        >
          + Add Stone
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-8 p-6" style={{ background: "var(--ivory)", border: "1px solid var(--stone)" }}>
          <h3 className="text-sm mb-6" style={{ color: "var(--ivory)" }}>Add New Stone</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["stone_name", "Stone Name *"],
              ["stone_type", "Stone Type"],
              ["origin", "Origin"],
              ["carat", "Carat"],
              ["cut", "Cut"],
              ["colour", "Colour"],
              ["clarity", "Clarity"],
              ["treatment", "Treatment"],
              ["certificate_lab", "Certificate Lab"],
              ["certificate_number", "Certificate No."],
            ].map(([key, label]) => (
              <input
                key={key}
                placeholder={label}
                value={form[key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                style={inputStyle}
              />
            ))}
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="col-span-2 resize-none"
              style={inputStyle}
            />
            <input
              placeholder="Image URL"
              value={form.image_url}
              onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
              style={inputStyle}
            />
            <select
              value={form.status}
              onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="private_viewing_only">Private Viewing Only</option>
            </select>
            <select
              value={form.price_visibility}
              onChange={e => setForm(prev => ({ ...prev, price_visibility: e.target.value }))}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="price_on_request">Price on Request</option>
              <option value="starting_from">Starting From</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-6 text-xs">
              {saving ? "Saving..." : "Save Stone"}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm); }}
              className="btn-outline py-2 px-6 text-xs"
              style={{ color: "rgba(28,61,53,0.75)", borderColor: "rgba(248,243,234,0.2)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: "var(--warm-grey)" }}>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stones.map(stone => (
            <div
              key={stone.id}
              className="p-5"
              style={{ background: "var(--ivory)", border: "1px solid var(--stone)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium" style={{ color: "var(--ivory)" }}>{stone.stone_name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--warm-grey)" }}>{stone.origin}</p>
                </div>
                <span
                  className="px-2 py-1 text-xs"
                  style={{
                    background: stone.status === "available" ? "#7eca8e20" : "#88888820",
                    color: stone.status === "available" ? "#7eca8e" : "#aaa",
                    border: `1px solid ${stone.status === "available" ? "#7eca8e40" : "#88888840"}`,
                  }}
                >
                  {stone.status}
                </span>
              </div>
              <div className="flex gap-3 text-xs" style={{ color: "var(--warm-grey)" }}>
                {stone.carat && <span>{stone.carat} ct</span>}
                {stone.cut && <span>{stone.cut}</span>}
                {stone.certificate_lab && <span>{stone.certificate_lab}</span>}
              </div>
            </div>
          ))}
          {stones.length === 0 && (
            <p className="col-span-3 text-center py-16 text-sm" style={{ color: "var(--stone)" }}>
              No stones yet. Add your first gemstone.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
