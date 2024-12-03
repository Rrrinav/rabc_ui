/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Ensure all source files are included
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
      },
      colors: {
        glass: "rgba(255, 255, 255, 0.1)",
        "primary-bg-1": "#06141B",
        "primary-bg-2": "#11212D",
        "sec-bg-1": "#253745",
        "sec-bg-2": "#4A5C6A",
        "primary-fg-1": "#9BA8AB",
        "primary-fg-2": "#CCD0CF",
        "color-text": "#F0F8FF",
      },
    },
  },
  plugins: [],
};
