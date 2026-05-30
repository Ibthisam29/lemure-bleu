import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: { blue: "#003F4F" },
        champagne: "#B88A72",
        ivory: "#F8F3EA",
        charcoal: "#151515",
        stone: "#D8D2C8",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "emerald-gradient": "linear-gradient(135deg, #003F4F 0%, #002835 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
