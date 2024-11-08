/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
  extend: {
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    colors: {
      'color-1': 'hsl(var(--color-1))',
      'color-2': 'hsl(var(--color-2))',
      'color-3': 'hsl(var(--color-3))',
      'color-4': 'hsl(var(--color-4))',
      'color-5': 'hsl(var(--color-5))'
    },
    animation: {
      rainbow: 'rainbow var(--speed, 2s) infinite linear',
      'shiny-text': 'shiny-text 8s infinite',
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out'
    },
    keyframes: {
      rainbow: {
        '0%': {
          'background-position': '0%'
        },
        '100%': {
          'background-position': '200%'
        }
      },
      'shiny-text': {
        '0%, 90%, 100%': {
          'background-position': 'calc(-100% - var(--shiny-width)) 0'
        },
        '30%, 60%': {
          'background-position': 'calc(100% + var(--shiny-width)) 0'
        }
      },
      'accordion-down': {
        from: {
          height: '0'
        },
        to: {
          height: 'var(--radix-accordion-content-height)'
        }
      },
      'accordion-up': {
        from: {
          height: 'var(--radix-accordion-content-height)'
        },
        to: {
          height: '0'
        }
      }
    }
  }
},
plugins: [require("tailwindcss-animate")],
}