/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./App.{js,jsx,ts,tsx}', './Screens/**/*.{js,jsx,ts,tsx}', './Components/Views/**/*.{js,jsx,ts,tsx}', './Navigations/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugin: {
    borderOpacity: true,
  },
}