module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        tremor: {
          background: { DEFAULT: "#030712", emphasis: "#374151" },
        },
      },
      animation: { 'intent-pulse': 'intent-pulse 2s infinite' },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
