/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "fd-blue": "#0A192F",
        "fd-purple": "#7F5AF0",
        "fd-cyan": "#00F5D4",
      },
    },
  },
  plugins: [],
};
