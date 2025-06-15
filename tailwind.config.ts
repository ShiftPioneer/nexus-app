
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // NEXUS Primary Brand Colors
        primary: {
          DEFAULT: '#FF6500',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6500',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
          foreground: '#FFFFFF'
        },

        // Semantic Color System
        success: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          foreground: '#FFFFFF'
        },

        // CHANGED: Warning is now lime, not yellow/orange!
        warning: {
          DEFAULT: '#84cc16', // lime-500
          50: '#f7fee7',     // lime-50
          100: '#ecfccb',    // lime-100
          200: '#d9f99d',    // lime-200
          300: '#bef264',    // lime-300
          400: '#a3e635',    // lime-400
          500: '#84cc16',    // lime-500
          600: '#65a30d',    // lime-600
          700: '#4d7c0f',    // lime-700
          800: '#3f6212',    // lime-800
          900: '#365314',    // lime-900
          foreground: '#FFFFFF'
        },

        // Remove any yellow/amber leftovers
        error: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          foreground: '#FFFFFF'
        },

        // Enhanced Background System
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
          // CHANGED: Add slate950
          dark: {
            DEFAULT: '#0F172A',
            secondary: '#1E293B',
            tertiary: '#334155',
            // Add custom key for slate950, or use direct Tailwind class where needed
            ultra: '#020617'
          }
        },

        // Text Color Hierarchy
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#64748B',
          muted: '#94A3B8',
          inverse: '#FFFFFF',
          dark: {
            primary: '#F8FAFC',
            secondary: '#CBD5E1',
            tertiary: '#94A3B8',
            muted: '#64748B'
          }
        },

        // Status Colors
        status: {
          active: '#10B981',
          pending: '#84cc16', // Changed from amber to lime-500
          inactive: '#6B7280',
          completed: '#059669'
        },

        // Legacy colors (keeping for compatibility)
        secondary: {
          DEFAULT: '#024CAA',
          foreground: '#FFFFFF',
          light: '#0364DD',
          dark: '#023A83'
        },
        deep: {
          DEFAULT: '#0B192C',
          light: '#12284A',
          dark: '#060F1A'
        },
        accent: {
          DEFAULT: '#00D4FF',
          foreground: '#FFFFFF',
          light: '#4DE2FF',
          dark: '#00A3C9'
        },
        neutral: {
          DEFAULT: '#F5F7FA',
          foreground: '#1E1E1E',
          light: '#FFFFFF',
          dark: '#E5E9F0'
        },
        dark: {
          DEFAULT: '#1E1E1E',
          foreground: '#F5F7FA',
          light: '#333333',
          dark: '#111111'
        },
        muted: '#D1D5DB',

        // System colors (shadcn compatibility)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        
        // Remap yellow to lime to fix hardcoded -yellow classes
        yellow: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
          950: '#1a2e05'
        },
        
        // Make sure lime exists in base palette (for utility use also)
        lime: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
          950: '#1a2e05'
        },

        slate: {
          // normal tailwind slate palette (make sure 950 is defined)
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617', // This is slate-950
        }
      },

      // Enhanced Typography Scale
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'md': ['1rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'xs': ['0.75rem', { lineHeight: '1.6' }],
        'caption': ['0.6875rem', { lineHeight: '1.6' }]
      },

      // Enhanced Spacing Scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem'
      },

      // Enhanced Border Radius
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)'
      },

      // Enhanced Shadows
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(255, 101, 0, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 101, 0, 0.2)'
      },

      keyframes: {
        // Enhanced animations
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(8px)' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 101, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 101, 0, 0.6)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        'accordion-up': 'accordion-up 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        'fade-out': 'fade-out 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        'slide-out-right': 'slide-out-right 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
