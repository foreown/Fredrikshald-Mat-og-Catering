import type { Config } from 'tailwindcss';

/**
 * Fargepalett: "Skogsgrønn + kobber"
 * Kremhvit bakgrunn, nesten-svart tekst, dyp granskogsgrønn som primærfarge
 * og varm kobber som aksent. Alle kombinasjoner som brukes til tekst er
 * kontrollert mot WCAG AA-kontrast på krembakgrunn.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF6EF',
          50: '#FDFBF7',
          100: '#F5F0E6',
          200: '#EDE5D6',
        },
        sand: {
          DEFAULT: '#E4DACA',
          dark: '#D3C6B0',
        },
        ink: {
          DEFAULT: '#1B1A17',
          muted: '#57524A',
          soft: '#7A7468',
        },
        pine: {
          DEFAULT: '#1F3D30',
          50: '#EFF3F1',
          100: '#DCE5E0',
          400: '#3F6E59',
          500: '#2F5A48',
          600: '#26483A',
          700: '#1F3D30',
          800: '#172E24',
          900: '#101F18',
        },
        copper: {
          DEFAULT: '#A9663A',
          50: '#FBF2EA',
          100: '#F3E1D1',
          300: '#D09A6B',
          400: '#C1834F',
          500: '#A9663A',
          600: '#8E5430',
          700: '#6F4125',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Flytende typografi — skalerer jevnt mellom mobil og desktop.
        'display-xl': ['clamp(2.6rem, 1.65rem + 4.2vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 1.4rem + 3.6vw, 4rem)', { lineHeight: '1.06', letterSpacing: '-0.018em' }],
        'display-md': ['clamp(1.875rem, 1.3rem + 2.4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-sm': ['clamp(1.5rem, 1.15rem + 1.5vw, 2.125rem)', { lineHeight: '1.16', letterSpacing: '-0.01em' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      maxWidth: {
        prose: '68ch',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      borderRadius: {
        card: '0.25rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(27, 26, 23, 0.04), 0 8px 24px -12px rgba(27, 26, 23, 0.14)',
        lift: '0 2px 4px rgba(27, 26, 23, 0.05), 0 18px 40px -18px rgba(27, 26, 23, 0.24)',
        panel: '0 1px 0 rgba(27, 26, 23, 0.05)',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.22, 0.61, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
