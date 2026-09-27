/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        app: '#0F172A',
        surface: '#0B1220',
        card: '#1E293B',
        cardhover: '#243247',
        // rail = brand/primary scale (control-room blue)
        rail: {
          900: '#0B1220', // deepest surface (sidebar)
          800: '#152238', // raised surface within sidebar
          700: '#1D4ED8', // primary, pressed
          600: '#2563EB', // primary
          500: '#3B82F6', // primary, hover/lighter
          100: '#1E2A4A', // tinted fill (chips, active bg)
          50: '#16213A', // faint tint
        },
        // ink = neutral/text scale, light-on-dark
        ink: {
          900: '#F1F5F9', // primary text
          700: '#CBD5E1', // secondary text
          500: '#94A3B8', // muted/label text
          300: '#64748B', // faint/disabled
          200: '#2A3B52', // borders
          100: '#1E293B', // subtle fill / hover bg (= card)
          50: '#152238',
        },
        alert: {
          critical: '#F87171',
          criticalBg: 'rgba(239,68,68,0.14)',
          criticalBorder: 'rgba(239,68,68,0.35)',
          high: '#FBBF24',
          highBg: 'rgba(245,158,11,0.14)',
          highBorder: 'rgba(245,158,11,0.35)',
          medium: '#FDE68A',
          mediumBg: 'rgba(245,158,11,0.10)',
          low: '#4ADE80',
          lowBg: 'rgba(34,197,94,0.14)',
          lowBorder: 'rgba(34,197,94,0.35)',
          info: '#60A5FA',
          infoBg: 'rgba(37,99,235,0.14)',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.24), 0 1px 0 rgba(255,255,255,0.02) inset',
        raised: '0 8px 24px rgba(0,0,0,0.35)',
        glow: '0 0 0 1px rgba(37,99,235,0.4), 0 0 24px rgba(37,99,235,0.15)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(180deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0) 60%)',
      },
    },
  },
  plugins: [],
}
