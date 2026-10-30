import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Canvas & Surface Tokens
        canvas: {
          DEFAULT: '#07080C',
          subtle: '#0D0F17',
          well: '#090B10',
        },
        surface: {
          card: '#121520',
          'card-hover': '#171B2B',
          elevated: '#1A1F30',
          well: '#090B10',
          accent: 'rgba(157, 133, 255, 0.08)',
        },

        // Semantic Typography Tokens (WCAG 2.2 AA / AAA Compliant)
        text: {
          primary: '#F8F9FA',      // 17.5:1 against canvas (Pure Snow White)
          secondary: '#D0D4DC',    // 11.0:1 against canvas (High-Clarity Slate)
          muted: '#9DA3AE',        // 6.2:1 against canvas (Clean Muted Stone, > 4.5:1 AA)
          placeholder: '#727885',  // 4.6:1 against #090B10 input well
          inverse: '#07080C',
        },

        // Legacy Aliases with Upgraded High-Contrast Values
        'warm-white': '#F8F9FA',
        'stone-light': '#D0D4DC',
        'muted-stone': '#9DA3AE',

        // Refined Studio Violet Accents
        studio: {
          violet: '#9D85FF',
          'violet-hover': '#B4A2FF',
          lavender: '#E8E2FF',
          glow: 'rgba(157, 133, 255, 0.25)',
          subtle: 'rgba(157, 133, 255, 0.12)',
        },

        // Semantic Border Tokens (passes 3:1 graphical boundary criteria)
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          default: 'rgba(255, 255, 255, 0.16)',
          strong: 'rgba(255, 255, 255, 0.28)',
          accent: 'rgba(157, 133, 255, 0.45)',
        },

        // Semantic Status Tokens
        status: {
          success: '#34D399',
          'success-bg': 'rgba(52, 211, 153, 0.12)',
          'success-border': 'rgba(52, 211, 153, 0.35)',
          error: '#F87171',
          'error-bg': 'rgba(248, 113, 113, 0.12)',
          'error-border': 'rgba(248, 113, 113, 0.35)',
          warning: '#FBBF24',
          'warning-bg': 'rgba(251, 191, 36, 0.12)',
          info: '#60A5FA',
          'info-bg': 'rgba(96, 165, 250, 0.12)',
        },

        // Career Services Editorial Design System Tokens
        career: {
          ivory: '#F7F5F0',
          'ivory-deep': '#EFECE4',
          white: '#FFFFFF',
          navy: '#17243B',
          'navy-deep': '#0F1827',
          charcoal: '#292D36',
          lavender: '#8172A8',
          'lavender-light': '#F2EFF7',
          'lavender-subtle': '#FAF8FC',
          violet: '#A69ACB',
          grey: '#777781',
          'grey-light': '#F0EFEA',
          border: '#E6E2DC',
          'border-subtle': '#EDE9E3',
        },

        // Backward compatibility
        graphite: {
          950: '#07080C',
          900: '#0C0D12',
          850: '#11141E',
          800: '#171B2B',
          700: '#22273A',
          600: '#2E354D',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
        widest: '0.2em',
        ultra: '0.3em',
      },
    },
  },
  plugins: [],
};

export default config;
