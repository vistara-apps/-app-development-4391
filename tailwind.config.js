/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: 'hsl(160, 80%, 40%)',
        primary: 'hsl(210, 80%, 50%)',
        surface: 'hsl(210, 30%, 15%)',
        muted: {
          300: 'hsl(210, 30%, 35%)',
          900: 'hsl(210, 30%, 90%)',
        },
        background: 'hsl(210, 30%, 10%)',
        destructive: 'hsl(354, 70%, 50%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 5px 15px hsla(0, 0%, 0%, 0.2)',
        'focus': '0 0 0 3px hsla(160, 80%, 40%, 0.5)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
    },
  },
  plugins: [],
}