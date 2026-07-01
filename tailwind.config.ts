import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "20px",
        lg: "32px",
      },
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        // Page canvas
        canvas: "#F1F1F1",
        // Surfaces
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#EFEEEB",
          mute: "#E9E8EE",
        },
        // Ink (text)
        ink: {
          DEFAULT: "#312938",
          secondary: "#515566",
          muted: "#656776",
          subtle: "#8F8F94",
        },
        line: "#E5E4E0",
        // Brand-ish neutrals from reference
        slate: {
          deep: "#656776",
          mid: "#BBBCC0",
        },
        // Pastel accents
        cream: "#F3EC9E",
        lilac: "#C6CBDE",
        "nude-green": "#F5F8EC",
        "nude-orange": "#FEF5E8",
        // CTA / dark pill
        ink_btn: "#1A1D20",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", '"DM Sans"', "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", '"DM Sans"', "system-ui", "sans-serif"],
        display: ["var(--font-clash)", '"Clash Display"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1320px",
      },
      borderRadius: {
        card: "24px",
        image: "20px",
        block: "32px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04)",
        card: "0 12px 30px rgba(15, 23, 42, 0.06)",
        nav: "0 1px 0 rgba(15, 23, 42, 0.06)",
      },
      letterSpacing: {
        display: "-0.07em",
        tight2: "-0.03em",
        label: "0.02em",
      },
      fontSize: {
        display: ["clamp(80px, 18vw, 288px)", { lineHeight: "1", letterSpacing: "-0.07em" }],
        h1: ["clamp(56px, 8vw, 120px)", { lineHeight: "1.02", letterSpacing: "-0.05em" }],
        h2: ["clamp(28px, 4vw, 48px)", { lineHeight: "1.16", letterSpacing: "-0.022em" }],
        h3: ["clamp(20px, 1.6vw, 22px)", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        body: ["14px", { lineHeight: "1.42", letterSpacing: "-0.02em" }],
        bodyL: ["16px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        label: ["12px", { lineHeight: "1.4", letterSpacing: "0.04em" }],
        marquee: ["clamp(32px, 4vw, 48px)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        wordmark: ["clamp(120px, 22vw, 320px)", { lineHeight: "1", letterSpacing: "-0.06em" }],
      },
    },
  },
  plugins: [],
};

export default config;
