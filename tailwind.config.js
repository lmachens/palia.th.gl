/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /text-(common|uncommon|rare|epic)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        common: "#f4e4c7",
        uncommon: "#3dcf17",
        rare: "#04a1bd",
        epic: "#6c09ed",
        brand: "#1AC2D9",
        dark: "#2c2e33",
      },
    },
  },
  plugins: [],
};
