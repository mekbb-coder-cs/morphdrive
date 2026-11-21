/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#0b0c10",
          card: "#1f2833",
          cyan: "#66fcf1",
          teal: "#45a29e",
          accent: "#ff007f",
          gold: "#f5a623",
        },
      },
    },
  },
  plugins: [],
}
