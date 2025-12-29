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
        "nutty-orange": "#FF6B35",
        "nutty-yellow": "#FFD700",
        "nutty-blue": "#1E40AF",
        "nutty-green": "#10B981",
        "nutty-purple": "#8B5CF6",
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
