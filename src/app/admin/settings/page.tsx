import { A } from "@/lib/adminStyles";
import { PageHeader } from "@/components/admin/PageHeader";

export default function AdminSettingsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lemurebleu.com";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set";
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasAdminPwd = !!process.env.ADMIN_PASSWORD;

  return (
    <div>
      <PageHeader eyebrow="System" title="Settings" sub="Environment configuration and system status" />

      {/* System status */}
      <div style={{ ...A.card, marginBottom:"1.25rem" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, marginBottom:"1.25rem" }}>System Status</div>
        <div style={{ display:"grid", gap:"0.6rem" }}>
          {[
            { label:"Supabase URL",        value:supabaseUrl.slice(0,40)+"…", ok:supabaseUrl!=="Not set" },
            { label:"Supabase Service Key", value:hasServiceKey?"Connected — Admin reads enabled":"⚠ Missing — Admin reads disabled", ok:hasServiceKey },
            { label:"Resend Email API",     value:hasResend?"Connected — Emails enabled":"Not configured — Emails will be skipped", ok:hasResend },
            { label:"Admin Password",       value:hasAdminPwd?"Set — Login protected":"⚠ Not set — Anyone can access admin", ok:hasAdminPwd },
            { label:"Site URL",             value:siteUrl, ok:true },
          ].map(item => (
            <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.75rem 0", borderBottom:`1px solid ${A.stone}` }}>
              <span style={{ fontSize:"0.72rem", color:A.warmGrey, fontWeight:300, fontFamily:"'Jost',sans-serif" }}>{item.label}</span>
              <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                <span style={{ fontSize:"0.72rem", color:A.emerald, fontWeight:300, fontFamily:"'Jost',sans-serif" }}>{item.value}</span>
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", backgroundColor:item.ok?"#3D7A55":"#B87A20" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Vercel env vars */}
      <div style={{ ...A.card, marginBottom:"1.25rem" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, marginBottom:"1rem" }}>Required Environment Variables</div>
        <div style={{ fontSize:"0.72rem", color:A.warmGrey, fontWeight:300, marginBottom:"1rem", lineHeight:1.7, fontFamily:"'Jost',sans-serif" }}>
          Set these in Vercel → Project → Settings → Environment Variables, then redeploy.
        </div>
        <div style={{ display:"grid", gap:"0.5rem" }}>
          {[
            ["NEXT_PUBLIC_SUPABASE_URL",    "Your Supabase project URL"],
            ["NEXT_PUBLIC_SUPABASE_ANON_KEY","Supabase anon/public key"],
            ["SUPABASE_SERVICE_ROLE_KEY",   "Supabase service role key (admin reads)"],
            ["RESEND_API_KEY",              "Resend.com API key for email notifications"],
            ["ADMIN_EMAIL",                 "Your email — receives lead/booking alerts"],
            ["ADMIN_PASSWORD",              "Password to access /admin"],
            ["NEXT_PUBLIC_SITE_URL",        "https://lemurebleu.com"],
          ].map(([key, desc]) => (
            <div key={key} style={{ backgroundColor:A.ivoryDeep, padding:"0.6rem 0.9rem", borderLeft:`2px solid ${A.stone}` }}>
              <code style={{ fontSize:"0.65rem", color:A.emerald, fontFamily:"monospace" }}>{key}</code>
              <div style={{ fontSize:"0.6rem", color:A.warmGrey, fontWeight:300, marginTop:"0.2rem", fontFamily:"'Jost',sans-serif" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Supabase migration */}
      <div style={{ ...A.card }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:A.emerald, marginBottom:"1rem" }}>Supabase Migration v2</div>
        <div style={{ fontSize:"0.72rem", color:A.warmGrey, fontWeight:300, marginBottom:"0.75rem", lineHeight:1.7, fontFamily:"'Jost',sans-serif" }}>
          Run <code style={{ color:A.emerald, fontFamily:"monospace" }}>supabase-migration-v2.sql</code> in your Supabase SQL Editor to add Events and Ads tables:
        </div>
        <a href="https://supabase.com/dashboard/project/xiikmczdaehbnalmhpdd/sql" target="_blank" rel="noopener noreferrer"
          style={{ ...A.btnEmerald, textDecoration:"none", display:"inline-block", fontSize:"0.56rem" }}>
          Open Supabase SQL Editor ↗
        </a>
      </div>
    </div>
  );
}
