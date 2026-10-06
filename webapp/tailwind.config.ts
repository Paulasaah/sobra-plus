import type { Config } from "tailwindcss";

// El diseño vive en app/globals.css (tokens CSS + clases de componente). Tailwind queda disponible para utilidades puntuales.
const config: Config = {
  darkMode: "media",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
