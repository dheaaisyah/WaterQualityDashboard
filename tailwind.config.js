/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      colors: {
        temperature: "#44C7E5",
        acidity: "#1BD47C",
        tds: "#7316DE",
        turbidity: "#597BFD",
        bgnormal: "#D1FAE4",
        normal: "#079669",
        bgmoderate: "#FFF7EC",
        moderate: "#F97315",
        bghigh: "#DEFCC8",
        high: "#E01D48",
      },
    },
  },
  plugins: [],
}