import type { Config } from 'tailwindcss';
// Fix: Use ESM import instead of require to resolve 'require is not defined' error in TypeScript environment
import tailwindAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        // Space theme colors
        space: {
          black: '#050505',
          dark: '#0F0F26',
          light: '#1C1C36',
        },
        // Neon accent colors
        neon: {
          cyan: '#00F3FF',
          purple: '#BC13FE',
          blue: '#2C58F7',
        },
        // Vision HUD color palette - brighter values for better visibility
        vision: {
          cyan: '#22D3EE',
          crimson: '#E11D48',
          orange: '#FB923C',
        },
        // Text colors for light/dark modes - high contrast
        text: {
          light: '#0f172a',
          dark: '#f8fafc',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient':
          'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'dash-move': 'dashMove 2s linear infinite',
        scan: 'scan 8s linear infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'spin-slow': 'spin 25s linear infinite',
        'spin-reverse-slow': 'spin 20s linear infinite reverse',
        'border-beam': 'border-beam 3s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-15px) translateX(10px)' },
          '50%': { transform: 'translateY(5px) translateX(-8px)' },
          '75%': { transform: 'translateY(-8px) translateX(12px)' },
        },
        'border-beam': {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 35px rgba(0, 243, 255, 0.5)' },
        },
        dashMove: {
          to: { strokeDashoffset: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  // Fix: Replaced require with imported tailwindAnimate plugin
  plugins: [tailwindAnimate],
};

export default config;
