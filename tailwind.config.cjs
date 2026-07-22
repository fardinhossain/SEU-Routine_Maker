/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#000000",
          900: "rgba(31, 21, 12, 0.35)",
          850: "rgba(46, 30, 18, 0.30)",
          800: "rgba(65, 45, 21, 0.22)",
          700: "rgba(94, 66, 33, 0.35)",
        },
        mint: {
          300: "#EFEBDC",
          400: "#E1DCC9",
          500: "#D1C7AE",
        },
        gold: {
          300: "#EFEBDC",
          400: "#E1DCC9",
          500: "#D1C7AE",
        },
        cream: {
          300: "#EFEBDC",
          400: "#E1DCC9",
          500: "#D1C7AE",
        },
        violet: {
          300: "#D6B588",
          400: "#C49A62",
          500: "#B0834B",
        },
        lavender: {
          300: "#D6B588",
          400: "#C49A62",
          500: "#B0834B",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(225, 220, 201, 0.18), 0 24px 80px rgba(0, 0, 0, 0.5)",
        "glow-violet": "0 0 0 1px rgba(196, 154, 98, 0.2), 0 24px 80px rgba(0, 0, 0, 0.5)",
      },
      fontFamily: {
        sans: ["'Libre Baskerville'", "Georgia", "serif"],
        serif: ["'Libre Baskerville'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
