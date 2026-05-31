import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lemure Bleu | Rare Gemstone Jewellery & Bespoke Heirlooms",
  description:
    "Lemure Bleu is a private luxury jewellery maison offering rare gemstones, bespoke heirlooms, limited-edition pieces, VIP preorders, and private gemstone appointments.",
  keywords: [
    "luxury jewellery Singapore",
    "bespoke jewellery Singapore",
    "rare gemstones Singapore",
    "heirloom jewellery",
    "custom gemstone jewellery",
    "private jewellery maison",
    "limited edition jewellery",
    "gemstone sourcing",
    "collectible gemstones",
  ],
  openGraph: {
    title: "Lemure Bleu | Rare Gemstone Jewellery & Bespoke Heirlooms",
    description:
      "A private luxury jewellery maison for bespoke heirlooms and collectible rare stones.",
    url: "https://lemurebleu.com",
    siteName: "Lemure Bleu",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
