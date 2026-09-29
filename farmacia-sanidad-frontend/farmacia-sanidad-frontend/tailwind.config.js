/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F2F8F4', 100: '#E1F0E6', 200: '#C4E1CD', 300: '#A3CFB0',
          400: '#7DB892', 500: '#5B9E74', 600: '#47825D', 700: '#37664A', 900: '#1C3526',
        },
        mint: { 50: '#EEFBF6', 100: '#D6F5EA', 200: '#B3EBD8', 300: '#86DDC2', 500: '#3FBF98' },
        lavender: { 50: '#F5F3FC', 100: '#EAE5F9', 200: '#D7CEF3', 300: '#BDAEEA', 500: '#8C76D6' },
        blush: { 50: '#FDF3F4', 100: '#FAE4E7', 200: '#F5CBD1', 300: '#EEA9B3', 500: '#D9738A' },
        sky: { 50: '#F0F7FC', 100: '#DDEEF8', 200: '#BCDDF1', 300: '#93C6E6', 500: '#4F9BCB' },
        butter: { 50: '#FFFAEB', 100: '#FEF2CC', 200: '#FCE49A', 300: '#F8D26A', 500: '#E0A92E' },
        cream: '#FBF8F3',
        surface: { DEFAULT: '#FFFFFF', warm: '#F6F2EA' },
        border: { soft: '#ECE6DA', strong: '#DCD3C3' },
        ink: { DEFAULT: '#2B2A28', muted: '#6A665F', subtle: '#9C968C' },
        success: '#6FB585',
        warning: '#D9A441',
        danger: '#D9737F',
        info: '#6FA3C4',
        terracotta: { 300: '#EDB9A5', 500: '#C97B5F' },
      },
      fontFamily: {
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { lg: '12px', xl: '16px', '2xl': '24px', '3xl': '32px' },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(91, 158, 116, 0.12)',
        card: '0 8px 24px -8px rgba(60, 70, 60, 0.10), 0 2px 6px -2px rgba(60, 70, 60, 0.05)',
        modal: '0 24px 64px -12px rgba(43, 42, 40, 0.28)',
        glow: '0 0 0 4px rgba(125, 184, 146, 0.18)',
      },
      keyframes: {
        'pulse-soft': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
