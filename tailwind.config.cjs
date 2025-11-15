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
        loopifyMain: "#1a753dff",         
        loopifySecondary: "#20b456ff",    
        loopifyTertiary: "#69c78bff",     
        loopifyAccent: "#FBBF24",       
        loopifyHighlight: "#FFD166",    
        loopifyLight: "#ECFDF5",        
        loopifyDark: "#052E16",         
        loopifyMuted: "#6B7280",        
        loopifySoft: "#BBF7D0",         
        loopifyCream: "#FAF3E0", 
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