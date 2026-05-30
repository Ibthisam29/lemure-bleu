"use client";
import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const TIERS = [
  { id:"blue_entry", name:"Blue Entry Allocation", price:"SGD 300", features:["Priority waitlist position","Entry-level gemstone allocation","Curated selection preview","Concierge introduction"] },
  { id:"maison", name:"Maison Allocation", price:"SGD 1,000", featured:true, features:["Priority access to rare stones","Bespoke jewellery consultation","Private stone preview session","Dedicated client manager","Certificate of provenance"] },
  { id:"legacy", name:"Legacy Allocation", price:"SGD 3,000", features:["Premium rare stone priority","Private sourcing service","Bespoke heirloom planning","In-person private viewing","Certificate of authenticity","First refusal on future drops"] },
];

export default function VipPreorderPage() {
  const [selected, setSelected] = useState<string|null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name:"", email:"", phone:"" });
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!selected||!agreed||!form.full_name||!form.email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/preorder-interest",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form, preorder_tier:selected}) });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch { setError("Something went wrong. Please contact hello@lemurebleu.com"); }
    finally { setLoading(false); }
  }

  const selectedTier = TIERS.find(t => t.id===selected);

  if (submitted) return (
    <main>
      <Navigation />
      <section className="min-h-screen flex items-center justify-center" style={{ background:"var(--ivory)" }}>
        <div className="container text-center max-w-xl">
          <div className="w-16 h-16 rotate-45 mx-auto mb-10" style={{ border:"1px solid rgba(196,150,90,0.4)", background:"rgba(196,150,90,0.06)" }}>
            <div className="absolute inset-0 flex items-center justify-center -rotate-45">
              <span style={{ color:"var(--champagne)", fontSize:"1.3rem" }}>✓</span>
            </div>
          </div>
          <p className="eyebrow-dark mb-6">Interest Registered</p>
          <h1 className="display mb-6" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--emerald)" }}>Preorder Interest Received</h1>
          <span className="rule-champagne mx-auto block mb-8" />
          <p className="text-sm leading-loose mb-4" style={{ color:"var(--warm-grey)", fontWeight:300 }}>
            Thank you for your interest in the <strong style={{ color:"var(--champagne)" }}>{selectedTier?.name}</strong>.<br />
            Our concierge will contact you within 48 hours with payment details.
          </p>
          <p className="text-xs leading-loose mb-10" style={{ color:"var(--stone)", fontWeight:300 }}>
            This preorder does not guarantee financial return or gemstone appreciation.
          </p>
          <a href="/" className="btn-outline-emerald">Return to Maison</a>
        </div>
      </section>
      <Footer />
    </main>
  );

  return (
    <main>
      <Navigation />
      <section className="pt-40 pb-20 text-center relative overflow-hidden" style={{ background:"var(--emerald)" }}>
        <div className="container relative z-10">
          <p className="eyebrow mb-6" style={{ color:"rgba(196,150,90,0.8)" }}>VIP Preorder</p>
          <h1 className="display mb-3" style={{ fontSize:"clamp(2.5rem,6vw,5.5rem)", color:"var(--ivory)" }}>Reserve Priority Access</h1>
          <h1 className="display-italic mb-8" style={{ fontSize:"clamp(2.5rem,6vw,5.5rem)", color:"var(--champ-lt)" }}>Stone Vault</h1>
          <span className="rule-champagne mx-auto block mb-6" style={{ opacity:0.5 }} />
          <p className="text-sm" style={{ color:"rgba(247,242,232,0.5)", fontWeight:300 }}>Register interest. Our concierge contacts you to arrange payment securely.</p>
        </div>
      </section>

      <section className="section" style={{ background:"var(--ivory)" }}>
        <div className="container">
          {/* Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {TIERS.map(tier => (
              <div key={tier.id} onClick={() => setSelected(tier.id)} className="relative cursor-pointer transition-all duration-400"
                style={{
                  background: selected===tier.id ? "var(--emerald)" : "var(--ivory)",
                  border: `1px solid ${selected===tier.id ? "var(--champagne)" : tier.featured ? "rgba(196,150,90,0.4)" : "var(--stone)"}`,
                  transform: selected===tier.id ? "translateY(-6px)" : "none",
                  boxShadow: selected===tier.id ? "0 24px 60px rgba(28,61,53,0.2)" : "none",
                }}>
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 py-2 text-center eyebrow"
                    style={{ background:"var(--champagne)", color:"var(--ivory)", fontSize:"0.5rem" }}>Most Popular</div>
                )}
                <div className={`p-8 ${tier.featured?"mt-9":""}`}>
                  <h3 className="display text-2xl mb-2" style={{ color: selected===tier.id?"var(--ivory)":"var(--emerald)" }}>{tier.name}</h3>
                  <p className="display text-4xl mb-6" style={{ color: selected===tier.id?"var(--champ-lt)":"var(--champagne)" }}>{tier.price}</p>
                  <div className="space-y-2">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-center gap-3">
                        <div className="w-1 h-1 rotate-45 flex-shrink-0" style={{ background: selected===tier.id?"var(--champagne)":"var(--emerald)" }} />
                        <span className="text-xs" style={{ color: selected===tier.id?"rgba(247,242,232,0.7)":"var(--warm-grey)", fontWeight:300 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form + agreement */}
          <div className="max-w-lg mx-auto">
            <div className="p-6 mb-8" style={{ background:"var(--ivory-deep)", border:"1px solid var(--stone)" }}>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rotate-45 mt-2 flex-shrink-0" style={{ background:"var(--emerald)" }} />
                <p className="text-xs leading-loose" style={{ color:"var(--warm-grey)", fontWeight:300 }}>
                  <strong style={{ color:"var(--emerald)", fontWeight:400 }}>How this works:</strong> Submit your details. Our concierge contacts you within 48 hours to confirm availability and arrange secure payment.
                </p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <input placeholder="Full Name *" value={form.full_name} onChange={e=>setForm(p=>({...p,full_name:e.target.value}))} className="input-field" />
              <input placeholder="Email Address *" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} className="input-field" />
              <input placeholder="Phone / WhatsApp" type="tel" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} className="input-field" />
            </div>

            <div className="p-6 mb-6" style={{ background:"var(--ivory-deep)", border:"1px solid var(--stone)" }}>
              <p className="eyebrow-dark mb-3" style={{ fontSize:"0.52rem" }}>Important Disclaimer</p>
              <p className="text-xs leading-loose" style={{ color:"var(--warm-grey)", fontWeight:300 }}>
                Lemure Blue does not guarantee gemstone appreciation, resale value, profit, or investment return. Preorders provide priority access only, subject to availability and client approval.
              </p>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <input type="checkbox" id="preorder_agree" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="mt-1 flex-shrink-0" style={{ accentColor:"var(--champagne)" }} />
              <label htmlFor="preorder_agree" className="text-xs leading-loose cursor-pointer" style={{ color:"var(--warm-grey)", fontWeight:300 }}>
                I agree to the <a href="/terms" className="underline" style={{ color:"var(--champagne)" }}>Terms</a> and <a href="/refund-policy" className="underline" style={{ color:"var(--champagne)" }}>Refund Policy</a>, and understand this is not a financial investment.
              </label>
            </div>

            {error && <p className="text-sm mb-4" style={{ color:"#e07070" }}>{error}</p>}

            <button onClick={handleSubmit}
              disabled={!selected||!agreed||!form.full_name||!form.email||loading}
              className="btn-gold w-full"
              style={{ opacity:(!selected||!agreed||!form.full_name||!form.email||loading)?0.4:1, cursor:(!selected||!agreed||!form.full_name||!form.email)?'not-allowed':'pointer' }}>
              {loading?"Submitting...":!selected?"Select a Preorder Tier":!form.full_name||!form.email?"Enter Your Details":!agreed?"Please Accept Terms":"Register Preorder Interest"}
            </button>
            <p className="text-center text-xs mt-4" style={{ color:"var(--stone)", fontWeight:300 }}>Payment arranged by concierge · No card details required now</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
