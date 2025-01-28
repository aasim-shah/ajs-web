import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      spacing: {
        'mobcontainer': '2rem',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        signature: "hsl(var(--signature))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        mutedLight: "hsl(var(--muted-light))",
        paragraphBlue: "hsl(var(--paragraphBlue))",
        suggestion: "hsl(var(--suggestion))",
        primary: {
          DEFAULT: "#0772FF",
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
        gray: {
          300: 'hsl(var(--gray-300))',
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        blue: 'hsl(var(--blue))',
        darkGrey: 'hsl(var(--darkGrey))',
        lightgrey: 'hsl(var(--lightgrey))',
        darkBlue: 'hsl(var(--darkBlue))',
        offWhite: 'hsl(var(--offWhite))',
        offWhiteLight: 'hsl(var(--offWhiteLight))',
        lightPink: 'hsl(var(--lightPink))',
        inputGrey: 'hsl(var(--inputGrey))',
        newGrey: 'hsl(var(--newGrey))',
        lightWhite: 'hsl(var(--lightWhite))',
        blackish: 'hsl(var(--blackish))',
        darktext: 'hsl(var(--darktext))',
        signingrey: 'hsl(var(--signingrey))',
        signinemail: 'hsl(var(--signinemail))',
        signininput: 'hsl(var(--signininput))',
        signininput2: 'hsl(var(--signininput2))',
        signininput3: 'hsl(var(--signininput3))',
        signininput4: 'hsl(var(--signininput4))',
        modaltext: 'hsl(var(--modaltext))',
        greenprogress: 'hsl(var(--greenprogress))',
        greenprogressbg: 'hsl(var(--greenprogressbg))',
        switchbg: 'hsl(var(--switchbg))',
        bglite: 'hsl(var(--bglite))',
        reviewYellow: 'hsl(var(--reviewYellow))',
        processingPurple: 'hsl(var(--processingPurple))',
        hrline: 'hsl(var(--hrline))',
        yellow: 'hsl(var(--yellow))',
        yellowBg: 'hsl(var(--yellowBg))',
        discordbg: 'hsl(var(--discordbg))',
        threeicons: 'hsl(var(--threeicons))',
        customdarkblue: 'hsl(var(--custom-dark-blue))',
        customgrayblue: 'hsl(var(--custom-gray-blue))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        'custom': ['YourFontName', 'sans-serif'],
      },
      fontWeight: {
        'thin': '100',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
