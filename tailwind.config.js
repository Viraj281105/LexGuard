// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0A0A0F',
          50: '#0A0A0F',
        },
        surface: {
          DEFAULT: '#111118',
          card: '#111118',
        },
        elevated: {
          DEFAULT: '#1A1A24',
          card: '#1A1A24',
        },
        border: {
          DEFAULT: '#22222E',
          subtle: '#22222E',
        },
        brand: {
          DEFAULT: '#C8A97E',
          gold: '#C8A97E',
          50: '#C8A97E1A',
          100: '#C8A97E33',
          200: '#C8A97E66',
        },
        risk: {
          critical: '#FF3B3B',
          high: '#FF8C00',
          medium: '#FFD700',
          low: '#00C851',
        },
        text: {
          primary: '#F0EDE8',
          muted: '#9A9490',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        legal: ['"EB Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      keyframes: {
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(200, 169, 126, 0.3), 0 0 24px rgba(200, 169, 126, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 16px rgba(200, 169, 126, 0.5), 0 0 48px rgba(200, 169, 126, 0.2)',
          },
        },
        scan: {
          '0%': { top: '0%', opacity: '1' },
          '50%': { opacity: '0.5' },
          '100%': { top: '100%', opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse_dot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.3)' },
        },
      },
      animation: {
        glow: 'glow 3s ease-in-out infinite',
        scan: 'scan 2.5s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'pulse-dot': 'pulse_dot 2s ease-in-out infinite',
      },
      backgroundImage: {
        'grid': `
          linear-gradient(to right, rgba(200, 169, 126, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(200, 169, 126, 0.03) 1px, transparent 1px)
        `,
        'radial-glow': 'radial-gradient(ellipse at center, rgba(200, 169, 126, 0.08) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
