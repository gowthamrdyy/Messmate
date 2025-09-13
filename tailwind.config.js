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
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
        'display': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // iOS 26 Quantum Typography
        'quantum-title': ['42px', { lineHeight: '1.1', letterSpacing: '-1px', fontWeight: '800' }],
        'neural-headline': ['28px', { lineHeight: '1.2', letterSpacing: '-0.5px', fontWeight: '700' }],
        'holo-body': ['18px', { lineHeight: '1.4', fontWeight: '500' }],
        'quantum-caption': ['14px', { lineHeight: '1.3', fontWeight: '600' }],
        'nano-text': ['10px', { lineHeight: '1.2', fontWeight: '500' }],
      },
      colors: {
        // Quantum Color System
        quantum: {
          blue: '#0066FF',
          purple: '#8A2BE2',
          pink: '#FF1493',
          red: '#FF0040',
          orange: '#FF6B00',
          yellow: '#FFD700',
          green: '#00FF7F',
          mint: '#00FFCC',
          teal: '#00CED1',
          cyan: '#00BFFF',
          indigo: '#4B0082',
        },
        
        // Neural Network Colors
        neural: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          glow: '#f59e0b',
        },
        
        // System Colors
        system: {
          bg: 'var(--system-bg)',
          surface: 'var(--system-surface)',
          card: 'var(--system-card)',
          text: 'var(--system-text)',
          'text-secondary': 'var(--system-text-secondary)',
          'text-tertiary': 'var(--system-text-tertiary)',
        },
        
        // Glass Colors
        glass: {
          ultra: 'var(--glass-ultra)',
          medium: 'var(--glass-medium)',
          strong: 'var(--glass-strong)',
          border: 'var(--glass-border)',
        },
      },
      
      borderRadius: {
        'quantum': '24px',
        'neural': '32px',
        'holo': '40px',
        'morph': '20px',
      },
      
      boxShadow: {
        'quantum': 'var(--shadow-quantum)',
        'neural': 'var(--shadow-neural)',
        'holo': 'var(--shadow-holo)',
        'glow': 'var(--shadow-glow)',
      },
      
      backdropBlur: {
        'quantum': '40px',
        'neural': '60px',
        'holo': '80px',
      },
      
      animation: {
        'quantum-pulse': 'quantum-pulse 2s ease-in-out infinite',
        'neural-glow': 'neural-glow 3s ease-in-out infinite',
        'holo-shift': 'holo-shift 4s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'morph': 'morph 8s ease-in-out infinite',
      },
      
      keyframes: {
        'quantum-pulse': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
        'neural-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px var(--neural-primary)',
          },
          '50%': {
            boxShadow: '0 0 40px var(--neural-secondary), 0 0 60px var(--neural-accent)',
          },
        },
        'holo-shift': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        'orbit': {
          '0%': {
            transform: 'rotate(0deg) translateX(150px) rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg) translateX(150px) rotate(-360deg)',
          },
        },
        'morph': {
          '0%, 100%': {
            borderRadius: '24px',
            transform: 'rotate(0deg)',
          },
          '25%': {
            borderRadius: '32px 24px',
            transform: 'rotate(1deg)',
          },
          '50%': {
            borderRadius: '40px',
            transform: 'rotate(0deg)',
          },
          '75%': {
            borderRadius: '24px 32px',
            transform: 'rotate(-1deg)',
          },
        },
      },
      
      backgroundImage: {
        'holo-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'holo-secondary': 'linear-gradient(45deg, #FF0080, #7928CA, #0070F3)',
        'holo-accent': 'linear-gradient(90deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        'holo-neural': 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)',
        'holo-quantum': 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        'neural-bg': 'radial-gradient(circle at 20% 80%, var(--neural-primary) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--neural-secondary) 0%, transparent 50%), radial-gradient(circle at 40% 40%, var(--neural-accent) 0%, transparent 50%)',
      },
      
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}