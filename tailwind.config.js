module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        domred: {
          DEFAULT: "#E3000F",
        },
        graybg: {
          DEFAULT: "#F7F7F7",
        },
        navy: {
          DEFAULT: "#1A2341",
        },
        gold: {
          DEFAULT: "#FFD700",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
        dom: "0 4px 24px 0 #E3000F22",
      },
    },
  },
  plugins: [],
}; 