/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./App.{js,jsx,ts,tsx}', './Screens/**/*.{js,jsx,ts,tsx}', './Components/Views/**/*.{js,jsx,ts,tsx}', './Navigations/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      maxWidth: {
        'screen-md': '768px',
        'screen-lg': '1024px',
      }
    }
  },
  plugins: [],
  corePlugin: {
    borderOpacity: true,
  },
}