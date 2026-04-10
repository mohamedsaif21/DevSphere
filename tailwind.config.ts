import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ds: {
          bg: '#0c1324',
          surface: '#151b2d',
          'surface-high': '#23293c',
          'surface-highest': '#2e3447',
          primary: '#d0bcff',
          'primary-dim': '#a078ff',
          tertiary: '#4ae176',
          'tertiary-dim': '#00a74b',
          'on-surface': '#dce1fb',
          'on-surface-dim': '#cbc3d7',
          border: '#494454',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ds-glow-primary': 'radial-gradient(ellipse at center, rgba(208,188,255,0.18) 0%, transparent 70%)',
        'ds-glow-tertiary': 'radial-gradient(ellipse at center, rgba(74,225,118,0.14) 0%, transparent 70%)',
        'ds-cta': 'linear-gradient(135deg, #4ae176 0%, #00a74b 100%)',
        'ds-cta-primary': 'linear-gradient(135deg, #d0bcff 0%, #a078ff 100%)',
        'dot-grid': 'radial-gradient(circle, rgba(73,68,84,0.6) 1px, transparent 1px)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      boxShadow: {
        'ds-primary': '0 0 40px rgba(208,188,255,0.2)',
        'ds-tertiary': '0 0 40px rgba(74,225,118,0.2)',
        'ds-card': '0 4px 32px rgba(0,0,0,0.5)',
        'ds-glow': '0 0 80px rgba(208,188,255,0.08), 0 0 160px rgba(74,225,118,0.05)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
