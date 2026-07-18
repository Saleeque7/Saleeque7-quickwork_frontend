/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ubuntu', 'sans-serif'],
      },
      colors: {
        online: '#51e200',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateY(0)' },
          '20%, 60%': { transform: 'translateY(-5px)' },
          '40%, 80%': { transform: 'translateY(5px)' },
        }
      },
      animation: {
        shake: 'shake 1s infinite',
      }
    },
  },
  plugins: [],
}
