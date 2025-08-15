import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/**/*.{ts,tsx}",
      "*.{js,ts,jsx,tsx,mdx}"
  ],
  prefix: "",
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
              background: 'hsl(var(--background))',
              foreground: 'hsl(var(--foreground))',
              card: {
                  DEFAULT: 'hsl(var(--card))',
                  foreground: 'hsl(var(--card-foreground))'
              },
              popover: {
                  DEFAULT: 'hsl(var(--popover))',
                  foreground: 'hsl(var(--popover-foreground))'
              },
              primary: {
                  DEFAULT: 'hsl(var(--primary))',
                  foreground: 'hsl(var(--primary-foreground))'
              },
              secondary: {
                  DEFAULT: 'hsl(var(--secondary))',
                  foreground: 'hsl(var(--secondary-foreground))'
              },
              muted: {
                  DEFAULT: 'hsl(var(--muted))',
                  foreground: 'hsl(var(--muted-foreground))'
              },
              accent: {
                  DEFAULT: 'hsl(var(--accent))',
                  foreground: 'hsl(var(--accent-foreground))'
              },
              destructive: {
                  DEFAULT: 'hsl(var(--destructive))',
                  foreground: 'hsl(var(--destructive-foreground))'
              },
              border: 'hsl(var(--border))',
              input: 'hsl(var(--input))',
              ring: 'hsl(var(--ring))',
              chart: {
                  '1': 'hsl(var(--chart-1))',
                  '2': 'hsl(var(--chart-2))',
                  '3': 'hsl(var(--chart-3))',
                  '4': 'hsl(var(--chart-4))',
                  '5': 'hsl(var(--chart-5))'
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
          fontFamily: {
              'brutal': ['Inter', 'system-ui', 'sans-serif'],
              'mono-brutal': ['JetBrains Mono', 'Courier New', 'monospace'],
          },
          fontSize: {
              'brutal-xs': ['0.75rem', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '900' }],
              'brutal-sm': ['0.875rem', { lineHeight: '1.1', letterSpacing: '0.08em', fontWeight: '800' }],
              'brutal-base': ['1rem', { lineHeight: '1.2', letterSpacing: '0.06em', fontWeight: '700' }],
              'brutal-lg': ['1.125rem', { lineHeight: '1.2', letterSpacing: '0.04em', fontWeight: '800' }],
              'brutal-xl': ['1.25rem', { lineHeight: '1.1', letterSpacing: '0.02em', fontWeight: '900' }],
          },
          keyframes: {
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
              },
              'brutal-shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-2px)' },
                  '75%': { transform: 'translateX(2px)' }
              },
              'brutal-pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' }
              }
          },
          animation: {
              'accordion-down': 'accordion-down 0.2s ease-out',
              'accordion-up': 'accordion-up 0.2s ease-out',
              'brutal-shake': 'brutal-shake 0.5s ease-in-out',
              'brutal-pulse': 'brutal-pulse 1s ease-in-out infinite'
          }
      }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
