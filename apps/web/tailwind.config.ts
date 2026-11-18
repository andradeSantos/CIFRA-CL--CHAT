/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode (Pergaminho)
        'sand-light': '#F6F1E9',
        'sand': '#EBE2D3',
        'earth-border': '#D5C7B2',
        'terracotta': '#A65E2E',
        'accent-hover': '#8B4D26',
        'ochre': '#C28449',
        'espresso': '#2B1E16',
        'umber': '#6E5849',
        // Dark mode (Terra Noturna)
        'dark-earth': '#1C1511',
        'bark': '#291F19',
        'bordermain': '#3D3028',
      },
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Monaco', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'spring-in': 'springIn 0.3s ease-out',
        'blur-in': 'blurIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        springIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        blurIn: {
          '0%': { filter: 'blur(4px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};