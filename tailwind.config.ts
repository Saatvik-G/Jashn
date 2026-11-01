import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#FAF7F2",
          100: "#F5F0E6",
          200: "#EBE3D3",
          300: "#DED3BE",
          400: "#CEBEA3",
          DEFAULT: "#FAF7F2",
        },
        oxblood: {
          50: "#FDF2F4",
          100: "#FCE7EA",
          200: "#F8D1D8",
          300: "#EEA7B5",
          400: "#DE7086",
          500: "#8B1E30",
          600: "#6A1625",
          700: "#4A0E17",
          800: "#380911",
          900: "#27060B",
          DEFAULT: "#4A0E17",
        },
        marigold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          DEFAULT: "#D97706",
        },
        sage: {
          50: "#F4F7F4",
          100: "#E5ECE5",
          200: "#CEDDCE",
          300: "#A9C2AA",
          400: "#80A382",
          500: "#5F7A61",
          600: "#495F4B",
          700: "#3B4D3C",
          800: "#323F33",
          900: "#2B352C",
          DEFAULT: "#5F7A61",
        },
        terracotta: {
          50: "#FFF7ED",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          DEFAULT: "#C2410C",
        },
        aubergine: {
          DEFAULT: "#381128",
          light: "#541D3E",
          dark: "#240A1A",
        },
        ink: {
          DEFAULT: "#1C1917",
          secondary: "#44403C",
          muted: "#78716C",
          border: "#E7E2D8",
          surface: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-instrument)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 2px 8px -2px rgba(42, 28, 20, 0.06), 0 8px 24px -4px rgba(42, 28, 20, 0.08)",
        "warm-lg": "0 8px 24px -4px rgba(42, 28, 20, 0.08), 0 20px 40px -8px rgba(42, 28, 20, 0.12)",
        editorial: "0 1px 3px rgba(42, 28, 20, 0.05), 0 10px 25px -5px rgba(42, 28, 20, 0.07)",
      },
      borderRadius: {
        editorial: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
