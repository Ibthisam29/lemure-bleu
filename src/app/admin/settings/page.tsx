"use client";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="label-luxury mb-2" style={{ color: "rgba(184,138,114,0.7)" }}>System</p>
        <h1 className="heading-display text-3xl" style={{ color: "var(--ivory)" }}>Settings</h1>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Environment Variables Info */}
        <div className="p-6" style={{ background: "var(--ivory)", border: "1px solid rgba(184,138,114,0.12)" }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: "var(--ivory)" }}>Environment Variables</h3>
          <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--warm-grey)" }}>
            Configure the following in your hosting environment (Vercel / Netlify) or <code className="px-1" style={{ background: "rgba(255,255,255,0.1)" }}>.env.local</code> file:
          </p>
          <div className="space-y-2">
            {[
              "STRIPE_SECRET_KEY",
              "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
              "STRIPE_WEBHOOK_SECRET",
              "NEXT_PUBLIC_SUPABASE_URL",
              "NEXT_PUBLIC_SUPABASE_ANON_KEY",
              "SUPABASE_SERVICE_ROLE_KEY",
              "RESEND_API_KEY",
              "ADMIN_EMAIL",
              "NEXT_PUBLIC_SITE_URL",
            ].map(key => (
              <div key={key} className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid rgba(28,61,53,0.05)" }}>
                <code className="text-xs" style={{ color: "var(--champagne)" }}>{key}</code>
                <span className="text-xs" style={{ color: "var(--stone)" }}>env only</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stripe Webhook */}
        <div className="p-6" style={{ background: "var(--ivory)", border: "1px solid rgba(184,138,114,0.12)" }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: "var(--ivory)" }}>Stripe Webhook</h3>
          <p className="text-xs leading-relaxed" style={{ color: "var(--warm-grey)" }}>
            Configure your Stripe webhook endpoint:
          </p>
          <code className="block mt-3 px-3 py-2 text-xs" style={{ background: "rgba(0,0,0,0.4)", color: "#7ec8e3" }}>
            POST https://lemurebleu.com/api/webhooks/stripe
          </code>
          <p className="text-xs mt-3" style={{ color: "var(--warm-grey)" }}>
            Event to listen for: <code style={{ color: "var(--champagne)" }}>checkout.session.completed</code>
          </p>
        </div>

        {/* Supabase RLS */}
        <div className="p-6" style={{ background: "var(--ivory)", border: "1px solid rgba(184,138,114,0.12)" }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: "var(--ivory)" }}>Supabase Row Level Security</h3>
          <p className="text-xs leading-relaxed" style={{ color: "var(--warm-grey)" }}>
            All public-facing tables (vip_leads, appointments) use INSERT-only policies for anonymous users.
            Admin reads use the service_role key. RLS must be enabled on all tables.
          </p>
        </div>
      </div>
    </div>
  );
}
