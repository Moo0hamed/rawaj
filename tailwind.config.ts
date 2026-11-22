import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          200: "#7CC6FF",
          300: "#5AB4FF",
          400: "#3EA6FF",
          500: "#2391FF",
          600: "#1A6ED1",
          700: "#124A8C",
          900: "#0A2647",
        },
        accent: {
          DEFAULT: "#FFF83F",
          400: "#FFF83F",
          600: "#C7BA00",
          700: "#8A8200",
        },
        ink: "#E9F1FF",
        night: "#03080F",
        abyss: "#03080F",
        surface: "#0A1626",
        paper: "#050D1A",
        onAccent: "#040B14",
        deep: "#081425",
        line: "#1A2D45",
        px: {
          black: "#040B14",
          navy: "#050D1A",
          panel: "#0A1626",
          blue: "#2391FF",
          blue2: "#1A6ED1",
          blue3: "#7CC6FF",
          yellow: "#FFF83F",
          yellow2: "#C7BA00",
          white: "#E9F1FF",
          gray: "#3A4A5E",
          gray2: "#6B7C90",
        },
      },
      fontFamily: {
        sans: ["var(--font-en)", "var(--font-ar)", "system-ui", "sans-serif"],
        pixel: ["var(--font-pixel)", "monospace"],
        display: ["var(--font-display)", "var(--font-ar)", "system-ui", "sans-serif"],
        ar: ["var(--font-ar)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-sm": ["clamp(1.9rem,4.6vw,3rem)", { lineHeight: "1.2", letterSpacing: "0" }],
        "display-md": ["clamp(2.2rem,5.5vw,3.8rem)", { lineHeight: "1.18", letterSpacing: "0" }],
        "display-lg": ["clamp(2.6rem,6.5vw,4.8rem)", { lineHeight: "1.15", letterSpacing: "0" }],
      },
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        "4xl": "0px",
        "5xl": "0px",
        full: "0px",
      },
      boxShadow: {
        none: "none",
        card: "4px 4px 0 0 #040B14",
        lift: "6px 6px 0 0 #040B14",
        glow: "0 0 0 2px #2391FF",
        accent: "4px 4px 0 0 #040B14",
        px: "4px 4px 0 0 #040B14",
        "px-sm": "2px 2px 0 0 #040B14",
        "px-lg": "6px 6px 0 0 #040B14",
        "px-inset": "inset 2px 2px 0 0 rgba(233,241,255,0.12), inset -2px -2px 0 0 #040B14",
      },
      backgroundImage: {
        "grid-fade": "none",
        "radial-brand": "none",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-rtl": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(50%)" },
        },
        "step-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "px-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        marquee: "marquee 24s steps(120) infinite",
        "marquee-rtl": "marquee-rtl 24s steps(120) infinite",
        float: "px-float 1.2s steps(2) infinite",
        blink: "blink 1s steps(2) infinite",
        "step-bounce": "step-bounce 0.8s steps(2) infinite",
        flicker: "blink 0.6s steps(2) infinite",
        scan: "none",
        "spin-slow": "none",
        "glow-pulse": "none",
      },
      transitionTimingFunction: {
        smooth: "steps(6, end)",
        pixel: "steps(6, end)",
      },
      transitionDuration: {
        DEFAULT: "120ms",
      },
    },
  },
  plugins: [],
};

export default config;