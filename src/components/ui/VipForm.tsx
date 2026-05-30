"use client";
import { useState } from "react";

export default function VipForm({ dark = false }: { dark?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const textClass = dark ? "text-ivory" : "text-charcoal";
  const inputBg = dark
    ? "bg-white/10 border-white/20 text-ivory placeholder:text-white/40 focus:border-champagne"
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/vip-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="divider-champagne mx-auto mb-8" />
        <h3
          className={`heading-display text-3xl mb-4 ${textClass}`}
        >
          Welcome to the Private Circle
        </h3>
        <p
          className="text-sm leading-relaxed max-w-md mx-auto"
          style={{ color: dark ? "rgba(248,243,234,0.7)" : "rgba(21,21,21,0.6)" }}
        >
          Your private access request has been received. Our concierge will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 md:grid md:grid-cols-2 md:gap-4 flex flex-col gap-4">
        <input
          name="full_name"
          required
          placeholder="Full Name"
          className={`input-luxury ${inputBg}`}
          style={dark ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "var(--ivory)" } : {}}
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email Address"
          className={`input-luxury ${inputBg}`}
          style={dark ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "var(--ivory)" } : {}}
        />
      </div>

      <input
        name="phone"
        type="tel"
        required
        placeholder="Phone / WhatsApp"
        className="input-luxury"
        style={dark ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "var(--ivory)" } : {}}
      />
      <input
        name="country"
        required
        placeholder="Country of Residence"
        className="input-luxury"
        style={dark ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "var(--ivory)" } : {}}
      />

      <select
        name="preferred_contact"
        required
        className="input-luxury"
        style={dark ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "var(--ivory)" } : {}}
      >
        <option value="">Preferred Contact</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
      </select>

      <select
        name="interest_type"
        required
        className="input-luxury"
        style={dark ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "var(--ivory)" } : {}}
      >
        <option value="">Interest Type</option>
        <option value="bespoke">Bespoke Jewellery</option>
        <option value="vip_preorder">VIP Preorder</option>
        <option value="rare_stone">Rare Stone Collection</option>
        <option value="heirloom">Heirloom Redesign</option>
        <option value="private_auction">Private Auction</option>
        <option value="trade">Trade / Consignment</option>
      </select>

      <select
        name="budget_range"
        required
        className="input-luxury md:col-span-2"
        style={dark ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "var(--ivory)" } : {}}
      >
        <option value="">Budget Range</option>
        <option value="below_1k">Below SGD 1,000</option>
        <option value="1k_3k">SGD 1,000 – 3,000</option>
        <option value="3k_10k">SGD 3,000 – 10,000</option>
        <option value="10k_50k">SGD 10,000 – 50,000</option>
        <option value="50k_plus">SGD 50,000+</option>
      </select>

      <textarea
        name="message"
        rows={4}
        placeholder="Message (optional)"
        className="input-luxury md:col-span-2 resize-none"
        style={dark ? { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "var(--ivory)" } : {}}
      />

      <div className="md:col-span-2 flex items-start gap-3">
        <input
          type="checkbox"
          name="consent"
          id="consent"
          required
          className="mt-1 accent-champagne"
        />
        <label
          htmlFor="consent"
          className="text-xs leading-relaxed cursor-pointer"
          style={{ color: dark ? "rgba(248,243,234,0.6)" : "rgba(21,21,21,0.55)" }}
        >
          I consent to receive marketing communications and private-client updates from Lemure Blue.
          I understand my data will be handled in accordance with the{" "}
          <a href="/privacy-policy" className="underline hover:text-champagne transition-colors">
            Privacy Policy
          </a>
          .
        </label>
      </div>

      {error && (
        <p className="md:col-span-2 text-sm text-red-400">{error}</p>
      )}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Submitting..." : "Request VIP Access"}
        </button>
      </div>
    </form>
  );
}
