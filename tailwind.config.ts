import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FFF7EA',
        ink: '#252225',
        burgundy: {
          DEFAULT: '#7A1020',
          dark: '#580C17',
          light: '#9C2E3F',
        },
        champagne: {
          DEFAULT: '#D4B892',
          light: '#E7D4B7',
        },
        blush: {
          DEFAULT: '#E8C6C6',
          dark: '#D9A6A6',
        },
        glass: 'rgba(255,255,255,0.6)',
      },
      fontFamily: {
        display: ['var(--font-baloo)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(122, 16, 32, 0.10)',
        'glass-lg': '0 20px 60px rgba(122, 16, 32, 0.16)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
