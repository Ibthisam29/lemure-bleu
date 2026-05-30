"use client";
import { useState } from "react";

export default function VipForm({ dark = false }: { dark?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fieldClass = dark ? "input-field-dark" : "input-field";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/vip-register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please contact hello@lemurebleu.com");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rotate-45 mx-auto mb-8" style={{ border: "1px solid rgba(196,150,90,0.5)", background: "rgba(196,150,90,0.1)" }}>
          <div className="absolute inset-0 flex items-center justify-center -rotate-45">
            <span style={{ color: "var(--champagne)", fontSize: "1.2rem" }}>✓</span>
          </div>
        </div>
        <h3 className="display text-2xl mb-4" style={{ color: dark ? "var(--ivory)" : "var(--emerald)" }}>
          Welcome to the Private Circle
        </h3>
        <p className="text-sm leading-loose" style={{ color: dark ? "rgba(247,242,232,0.55)" : "var(--warm-grey)", fontWeight: 300 }}>
          Your private access request has been received.<br />Our concierge will contact you shortly.
        </p>
      </div>
    );
  }

  const sel = (name: string, placeholder: string, opts: string[][]) => (
    <div>
      <select name={name} required className={fieldClass} style={{ width: "100%", background: "transparent", cursor: "pointer" }}>
        <option value="">{placeholder}</option>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="full_name" required placeholder="Full Name" className={fieldClass} />
        <input name="email" type="email" required placeholder="Email Address" className={fieldClass} />
        <input name="phone" type="tel" required placeholder="Phone / WhatsApp" className={fieldClass} />
        <input name="country" required placeholder="Country of Residence" className={fieldClass} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sel("preferred_contact", "Preferred Contact", [["whatsapp","WhatsApp"],["email","Email"],["phone","Phone"]])}
        {sel("interest_type", "Interest Type", [
          ["bespoke","Bespoke Jewellery"],["vip_preorder","VIP Preorder"],
          ["rare_stone","Rare Stone Collection"],["heirloom","Heirloom Redesign"],
          ["private_auction","Private Auction"],["trade","Trade / Consignment"],
        ])}
      </div>

      {sel("budget_range", "Budget Range", [
        ["below_1k","Below SGD 1,000"],["1k_3k","SGD 1,000 – 3,000"],
        ["3k_10k","SGD 3,000 – 10,000"],["10k_50k","SGD 10,000 – 50,000"],["50k_plus","SGD 50,000+"],
      ])}

      <textarea name="message" rows={3} placeholder="Message (optional)" className={fieldClass}
        style={{ resize: "none", display: "block", width: "100%" }} />

      <div className="flex items-start gap-3 pt-2">
        <input type="checkbox" name="consent" id="consent_vip" required className="mt-1 flex-shrink-0" style={{ accentColor: "var(--champagne)" }} />
        <label htmlFor="consent_vip" className="text-xs leading-loose cursor-pointer" style={{ color: dark ? "rgba(247,242,232,0.45)" : "var(--warm-grey)", fontWeight: 300 }}>
          I consent to receive private-client updates from Lemure Blue in accordance with the{" "}
          <a href="/privacy-policy" className="underline" style={{ color: dark ? "rgba(196,150,90,0.8)" : "var(--champagne)" }}>Privacy Policy</a>.
        </label>
      </div>

      {error && <p className="text-sm" style={{ color: "#e07070" }}>{error}</p>}

      <button type="submit" disabled={loading} className="btn-gold w-full" style={{ opacity: loading ? 0.6 : 1 }}>
        {loading ? "Submitting..." : "Request VIP Access"}
      </button>
    </form>
  );
}
