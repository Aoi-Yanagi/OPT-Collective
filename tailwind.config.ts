import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          canvas: 'var(--bg-canvas)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          accent: 'var(--accent-primary)',
          'accent-fg': 'var(--accent-primary-fg)',
          secondary: 'var(--accent-secondary)',
          border: 'var(--border-subtle)',
        },
      },
      borderRadius: {
        'opt-card': 'var(--radius-card)',
        'opt-btn': 'var(--radius-btn)',
      },
    },
  },
  plugins: [],
};

export default config;