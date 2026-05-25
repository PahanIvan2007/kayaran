/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cdpr: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a25',
          border: '#2a2a3a',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          gold: '#f59e0b',
          pink: '#ec4899',
          red: '#ef4444',
          text: '#e2e8f0',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
        'glow-fast': 'glow 1s ease-in-out infinite alternate',
        float: 'float 6s ease-in-out infinite',
        'scan-line': 'scanLine 8s linear infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'pulse-neon': 'pulseNeon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'glitch': 'glitch 0.3s ease-in-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.1), 0 0 40px rgba(139, 92, 246, 0.05)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)', opacity: '0.8' },
          '40%': { transform: 'translate(2px, -1px)', opacity: '0.6' },
          '60%': { transform: 'translate(-1px, -2px)', opacity: '0.8' },
          '80%': { transform: 'translate(1px, 1px)' },
          '100%': { transform: 'translate(0)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1a25 100%)',
      }
    }
  },
  plugins: []
}
