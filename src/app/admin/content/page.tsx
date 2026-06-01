"use client";
import { useState } from "react";

const CONTENT_FIELDS = [
  { key: "hero_headline", label: "Hero Headline", defaultValue: "Rare Gems. Refined Legacy." },
  { key: "hero_subheadline", label: "Hero Subheadline", defaultValue: "A private jewellery maison for bespoke heirlooms, limited-edition gemstone pieces, and collectible rare stone ownership." },
  { key: "hero_cta_primary", label: "Primary CTA Text", defaultValue: "Join VIP List" },
  { key: "hero_cta_secondary", label: "Secondary CTA Text", defaultValue: "Book Private Appointment" },
  { key: "maison_title", label: "Maison Section Title", defaultValue: "The Maison of Quiet Luxury" },
  { key: "maison_copy", label: "Maison Copy", defaultValue: "Lemure Bleu creates jewellery designed not only to be worn, but to be inherited." },
  { key: "footer_whatsapp", label: "WhatsApp Number", defaultValue: "+65 0000 0000" },
  { key: "footer_email", label: "Contact Email", defaultValue: "hello@lemurebleu.com" },
  { key: "footer_instagram", label: "Instagram Handle", defaultValue: "@lemureblue" },
];

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(CONTENT_FIELDS.map(f => [f.key, f.defaultValue]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: values }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
      <div className="mb-8">
        <p className="label-luxury mb-2" style={{ color: "rgba(184,138,114,0.7)" }}>CMS</p>
        <h1 className="heading-display text-3xl" style={{ color: "var(--ivory)" }}>Content Management</h1>
      </div>

      <div className="max-w-2xl space-y-5">
        {CONTENT_FIELDS.map(field => (
          <div key={field.key}>
            <label className="block text-xs mb-1.5" style={{ color: "var(--warm-grey)", letterSpacing: "0.05em" }}>
              {field.label}
            </label>
            {field.defaultValue.length > 80 ? (
              <textarea
                value={values[field.key]}
                onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
                rows={3}
                className="resize-none"
                style={inputStyle}
              />
            ) : (
              <input
                value={values[field.key]}
                onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
                style={inputStyle}
              />
            )}
          </div>
        ))}

        <div className="pt-4">
          <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-8 text-xs">
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
