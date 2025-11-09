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
        loopifyMain: "#2C7A4B",       
        loopifySecondary: "#4CAF7F",  
        loopifyAccent: "#F4A261",     
        loopifyLight: "#E6F5EB",      
        loopifyDark: "#1F2937",       
        loopifyMuted: "#6B7280",      
        loopifyHighlight: "#A7D129",  
        loopifySoft: "#B9E3D3",
      },
      fontFamily: {
        title: ['Poppins', 'sans-serif'],      
        body: ['Inter', 'sans-serif'],        
        quote: ['Crimson', 'sans-serif'],
      },
      fontWeight: {
        regular: 400,
        semibold: 600,
      },
    }
  },
  plugins: []
};