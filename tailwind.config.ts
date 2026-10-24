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
        graphite: {
          950: '#070809',
          900: '#0c0d0e',
          850: '#111315',
          800: '#17191d',
          700: '#22252a',
          600: '#2e3238',
        },
        'warm-white': '#f5f5f3',
        'muted-stone': '#8e9299',
        'stone-light': '#b4b8bf',
        'cobalt-blue': {
          DEFAULT: '#1f51ff',
          light: '#3d6aff',
          dark: '#1438cc',
          glow: 'rgba(31, 81, 255, 0.25)',
        },
        silver: {
          DEFAULT: '#c8cbd0',
          light: '#e3e5e8',
          metallic: '#9ea2a8',
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
