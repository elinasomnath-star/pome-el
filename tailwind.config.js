/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#06070c',
          800: '#0b0e17',
          700: '#121826',
          600: '#1a2236',
          500: '#26334d'
        },
        neon: {
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          lime: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 20s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        }
      }
    },
  },
  plugins: [],
}

