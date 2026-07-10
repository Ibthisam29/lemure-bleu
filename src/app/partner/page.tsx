import type { Metadata } from "next";
import PartnerForm from "./PartnerForm";

export const metadata: Metadata = {
  title: "Partner & Vendor Registration — Lemuré Bleu",
  description: "Register your interest as a partner, vendor, or collaborator with Lemuré Bleu Private Maison.",
};

export default function PartnerPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#EDE6D6" }}>
      {/* Header */}
      <div style={{ background: "#1C3D35", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <p style={{ fontFamily: "Jost,sans-serif", fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#C4965A", marginBottom: "1rem" }}>
          Lemuré Bleu · Private Maison
        </p>
        <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, color: "#F7F2E8", lineHeight: 1.15, marginBottom: "1.25rem" }}>
          Partner & Vendor Registration
        </h1>
        <p style={{ fontFamily: "Jost,sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "rgba(247,242,232,0.6)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.8 }}>
          Register your interest in collaborating with Lemuré Bleu — gemstone dealers, luxury artisans, galleries, and aligned partners.
        </p>
      </div>

      {/* Form container */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <PartnerForm />
      </div>
    </main>
  );
}
