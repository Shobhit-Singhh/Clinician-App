/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom breakpoints based on modern device sizes
      
      
      // Color palette based on the HealthSphere design
      colors: {
        primary: {
          DEFAULT: '#1754C3',   // Orange from CTA buttons
          light: '#CBD8EE',
          dark: '#003EAE',
        },
        secondary: {
          DEFAULT: '#FF4F00',   // Blue from logo and buttons
          light: '#FDCEBA',
          dark: '#C03C00',
        },
        accent: {
          blue: {
            light: '#E8F0FF',
            DEFAULT: '#2B4DD4',
            dark: '#1A318F',
          },
          orange: {
            light: '#FFF0EB',
            DEFAULT: '#FF5722',
            dark: '#CC461B',
          }
        },
        neutral: {
          50: '#F8FAFC',    // Background colors
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        dark: {
          DEFAULT: '#101840',   // Dark blue from footer
          light: '#1C2859',
          darker: '#080D26',
        },
      },

      // Typography system
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        'h3': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'h4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },

      // Shadow styles from the design
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },

      // Additional spacing for consistent layouts
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // Border radius
      borderRadius: {
        'sm': '0.375rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
      },
    },
  },
  plugins: [],
}