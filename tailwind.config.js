/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2e3040",
        secondary: "#122e53",
      },
    },
  },
  plugins: [],
};

export default config;
