/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e50914',
          hover: '#f40612',
        },
        dark: {
          DEFAULT: '#141414',
          lighter: '#1f1f1f',
          darker: '#0f0f0f',
        },
        light: {
          DEFAULT: '#f5f5f5',
          muted: '#b3b3b3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};