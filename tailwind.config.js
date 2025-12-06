/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'display': ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      colors: {
        // Nebula Color System
        nebula: {
          dark: '#0B0C15',
          light: '#F4F6F8',
          primary: '#6C5DD3', // Deep Purple
          secondary: '#FF754C', // Coral Orange
          accent: '#3F8CFF', // Bright Blue
          success: '#2DCD7A',
          warning: '#FFAB00',
          error: '#FF5B5B',
        },

        // Surface Colors
        surface: {
          100: '#FFFFFF',
          200: '#F8F9FC',
          300: '#E4E8F0',
          400: '#C8D0E0',
          500: '#9AA5B8',
          600: '#6B7A90',
          700: '#4A5568',
          800: '#2D3748',
          900: '#1A202C',
        },

        // Glass Effects
        glass: {
          clear: 'rgba(255, 255, 255, 0.1)',
          mist: 'rgba(255, 255, 255, 0.5)',
          frost: 'rgba(255, 255, 255, 0.8)',
          dark: 'rgba(11, 12, 21, 0.6)',
        }
      },

      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
        'pill': '9999px',
      },

      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(108, 93, 211, 0.3)',
        'float': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
      },

      backdropBlur: {
        'xs': '2px',
      },

      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}