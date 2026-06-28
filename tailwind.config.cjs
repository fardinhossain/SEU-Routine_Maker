/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#091326",
          900: "#0d182b",
          850: "#142138",
          800: "#1d2a3e",
          700: "#2b394f"
        },
        mint: {
          300: "#6ff7f0",
          400: "#20ded6",
          500: "#08bdb7"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(32,222,214,.08), 0 24px 80px rgba(2,7,18,.28)",
      },
      fontFamily: {
        sans: ["Inter", "Aptos", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
