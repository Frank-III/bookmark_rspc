/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: ["data-class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    themes: [
      {
        'light': {
          'primary': colors.emerald[500],
          'primary-focus': colors.emerald[600],
          'primary-content': colors.emerald[950],

          'secondary': colors.cyan[500],
          'secondary-focus': colors.cyan[600],
          'secondary-content': colors.cyan[950],

          'accent': colors.purple[500],
          'accent-focus': colors.purple[600],
          'accent-content': colors.purple[50],

          'neutral': colors.zinc[500],
          'neutral-focus': colors.zinc[600],
          'neutral-content': colors.zinc[50],

          'base-100': colors.zinc[50],
          'base-200': colors.zinc[100],
          'base-300': colors.zinc[200],
          'base-content': colors.zinc[700],

          'info': colors.blue[500],
          'success': colors.emerald[500],
          'warning': colors.amber[500],
          'error': colors.red[500],

          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',

          '--animation-btn': '0',
          '--animation-input': '0',

          '--btn-text-case': 'uppercase',
          '--navbar-padding': '0.5rem',
          '--border-btn': '1px',
        },
      },
      {
        'dark': {
          'primary': colors.emerald[500],
          'primary-focus': colors.emerald[600],
          'primary-content': colors.emerald[950],

          'secondary': colors.cyan[500],
          'secondary-focus': colors.cyan[600],
          'secondary-content': colors.cyan[950],

          'accent': colors.purple[500],
          'accent-focus': colors.purple[600],
          'accent-content': colors.purple[50],

          'neutral': colors.zinc[500],
          'neutral-focus': colors.zinc[600],
          'neutral-content': colors.zinc[50],

          'base-100': colors.zinc[800],
          'base-200': colors.zinc[900],
          'base-300': colors.zinc[950],
          'base-content': colors.zinc[200],

          'info': colors.blue[400],
          'success': colors.emerald[400],
          'warning': colors.amber[400],
          'error': colors.red[400],

          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',

          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',

          '--btn-text-case': 'uppercase',
          '--navbar-padding': '0.5rem',
          '--border-btn': '1px',
        },
      },
    ],
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
}