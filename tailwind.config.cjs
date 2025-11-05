// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A5F3D",
        accent: "#F4A261",
        light: "#F9FAFB"
      }
    }
  },
  plugins: []
};