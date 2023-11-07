/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [require("daisyui")],
  darkMode: ["class", '[data-theme="dark"]'], //specifying here the daisy ui theme i want my dark class of tailwind to refer to.
};
