/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -30px rgba(30, 64, 175, 0.28)",
        card: "0 12px 35px -20px rgba(15, 23, 42, 0.24)",
      },
      colors: {
        // Core surfaces
        background: "#FAFAFE",
        surface: "#FAFAFE",
        "surface-bright": "#FFFFFF",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F3F2FA",
        "surface-container": "#EDECF4",
        "surface-container-high": "#E7E6EE",
        "surface-container-highest": "#E1E0E8",

        "on-surface": "#1B1B21",
        "on-surface-variant": "#46464F",

        outline: "#767680",
        "outline-variant": "#C6C5D0",

        // Primary
        primary: "#4F55B8",
        "on-primary": "#FFFFFF",
        "primary-container": "#E1E0FF",
        "on-primary-container": "#06006B",
        "primary-fixed": "#E1E0FF",
        "on-primary-fixed-variant": "#383E8F",

        // Secondary
        secondary: "#5C5D72",
        "on-secondary": "#FFFFFF",
        "secondary-container": "#E1E0F9",
        "on-secondary-container": "#191A2C",
        "secondary-fixed": "#E1E0F9",
        "on-secondary-fixed-variant": "#444559",

        // Tertiary
        tertiary: "#76546E",
        "on-tertiary": "#FFFFFF",
        "tertiary-container": "#FFD7F0",
        "on-tertiary-container": "#2D1228",
        "tertiary-fixed": "#FFD7F0",
        "on-tertiary-fixed-variant": "#5C3C56",

        // Error
        error: "#BA1A1A",
        "on-error": "#FFFFFF",
        "error-container": "#FFDAD6",
        "on-error-container": "#410002",

        // Inverse
        "inverse-surface": "#303036",
        "inverse-on-surface": "#F2EFF7",
        "inverse-primary": "#C0C1FF",
      },
    },
  },
  plugins: [],
};  