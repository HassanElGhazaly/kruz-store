import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08080b',
          900: '#0c0c11',
          850: '#101018',
          800: '#14141d',
          700: '#1c1c28',
          600: '#262633',
          500: '#33333f',
          400: '#4a4a58',
          300: '#6b6b78',
          200: '#9a9aa6',
          100: '#c8c8d0',
        },
        gold: {
          950: '#3a2c0a',
          900: '#4a3a0e',
          800: '#5e4a14',
          700: '#7a5f1c',
          600: '#a07826',
          500: '#c9a227',
          400: '#e0b840',
          300: '#f0cd5e',
          200: '#f7dd85',
          100: '#fceaae',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(110deg, #a07826 0%, #e0b840 25%, #fceaae 50%, #e0b840 75%, #a07826 100%)',
        'dark-noise': "radial-gradient(circle at 50% 0%, rgba(201,162,39,0.06) 0%, transparent 50%)",
      },
      animation: {
        'shimmer': 'shimmer 6s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,162,39,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(201,162,39,0.5)' },
        },
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
        '2000': '2000px',
      },
    },
  },
  plugins: [],
};
export default config;
