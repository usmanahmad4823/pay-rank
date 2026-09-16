/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FAF9F6',
          pure: '#FFFFFF',
          card: '#FFFFFF',
        },
        coral: {
          50: '#FDF2F0',
          100: '#FCE4E0',
          400: '#F06A4B',
          500: '#E06D53',     // Outbid Terracotta Accent
          600: '#C8573F',
          700: '#A9432E',
        },
        stone: {
          50: '#FAF9F6',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          700: '#44403C',
          900: '#1C1917',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['var(--font-outfit)', 'sans-serif'],
      },
      boxShadow: {
        'outbid-card': '0 2px 8px -2px rgba(28, 25, 23, 0.04)',
        'outbid-hover': '0 6px 16px -4px rgba(28, 25, 23, 0.08)',
        'coral-pill': '0 4px 14px -2px rgba(224, 109, 83, 0.35)',
        'apple-card': '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
        'apple-hover': '0 12px 32px 0 rgba(0, 0, 0, 0.07)',
        'apple-modal': '0 24px 48px -12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}


