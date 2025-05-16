export default {
  darkMode: "class",

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      screens: {
        'sm': '640px',  // Mobile
        'md': '768px',  // Tablet
        'lg': '1024px', // Desktop
        'xl': '1280px',
        '2xl': '1536px',
      }
    }
  },
  plugins: [],
}