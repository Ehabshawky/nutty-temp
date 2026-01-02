/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors from Nutty Scientists
        "nutty-orange": "#FF6B35",
        "nutty-yellow": "#FFD700",      // Standard Gold/Yellow
        "nutty-cyan": "#00BCD4",        // Main cyan/turquoise
        "nutty-cyan-dark": "#0097A7",   // Darker variant for hover states
        "nutty-cyan-light": "#4DD0E1",  // Lighter variant
        "nutty-lime": "#C4D600",        // Main lime green
        "nutty-lime-dark": "#9FA800",   // Darker variant for hover states
        "nutty-lime-light": "#D4E157",  // Lighter variant
        "nutty-blue": "#3B82F6",        // Standard blue
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
