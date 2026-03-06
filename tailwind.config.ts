import type { Config } from "tailwindcss"

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#e8e7e7",
        ink: "#1e1e1e",
        detail: "#101c3d",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        script: ["var(--font-script)"],
      },
      letterSpacing: {
        tighter2: "-0.06em",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config