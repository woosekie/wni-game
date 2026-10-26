/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        comic: {
          yellow: '#FFE600',
          orange: '#FF5E00',
          red: '#FF2E4D',
          green: '#10B981',
          mint: '#05D58D',
          blue: '#00A8FF',
          sky: '#38BDF8',
          purple: '#A855F7',
          pink: '#EC4899',
          dark: '#0F172A',
          card: '#1E293B',
          bg: '#0B0F19',
          paper: '#FFFDF0',
        }
      },
      boxShadow: {
        'comic': '4px 4px 0px #000000',
        'comic-sm': '2px 2px 0px #000000',
        'comic-lg': '8px 8px 0px #000000',
        'comic-xl': '12px 12px 0px #000000',
        'comic-white': '4px 4px 0px #ffffff',
        'comic-green': '4px 4px 0px #059669',
        'comic-red': '4px 4px 0px #DC2626',
        'comic-yellow': '4px 4px 0px #CA8A04',
      },
      fontFamily: {
        comic: ['"Bungee"', '"Titan One"', 'Impact', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      },
      animation: {
        float: 'float 3.5s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
