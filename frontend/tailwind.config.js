/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cabinet Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Satoshi"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      animation: {
        'fade-up':   'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':   'fadeIn 0.3s ease both',
        'slide-in':  'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'bounce-dots':'bounceDots 1.4s ease-in-out infinite',
        'shimmer':   'shimmer 1.8s linear infinite',
        'glow':      'glow 2s ease-in-out infinite',
        'float':     'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: 'translateY(18px)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn:  { from: { opacity: 0, transform: 'translateX(-18px)' }, to: { opacity: 1, transform: 'none' } },
        bounceDots: {
          '0%,80%,100%': { transform: 'translateY(0)', opacity: 0.4 },
          '40%':         { transform: 'translateY(-8px)', opacity: 1 },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to:   { backgroundPosition: '-200% 0' },
        },
        glow: {
          '0%,100%': { opacity: 0.6 },
          '50%':     { opacity: 1 },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
