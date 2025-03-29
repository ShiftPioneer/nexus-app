
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
        // Primary colors (Energy & Motivation)
        primary: {
          DEFAULT: '#FF6500',
          foreground: '#FFFFFF',
          light: '#FF8533',
          dark: '#E65C00'
        },
        energy: {
          DEFAULT: '#FFC83D',
          light: '#FFDA85',
          dark: '#FFBA00'
        },
        
        // Secondary colors (Depth & Professionalism)
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
        
        // Accent colors (Gamification & Interactivity)
        accent: {
          DEFAULT: '#00D4FF',
          foreground: '#FFFFFF',
          light: '#4DE2FF',
          dark: '#00A3C9'
        },
        success: {
          DEFAULT: '#39D98A',
          light: '#5FE1A2',
          dark: '#2CB873'
        },
        warning: {
          DEFAULT: '#FF3B30',
          light: '#FF6E66',
          dark: '#E53529'
        },
        
        // Neutral colors (Balance & Readability)
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
        
        // System colors (inherited)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
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
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'scale-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'progress': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'progress': 'progress 1s ease-out forwards',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
