import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Creaxブランドカラーを追加
        'creax-orange': '#ff6232',
        'creax-orange-light': '#ff8a5b',
        'creax-orange-dark': '#e54920',
      },
    },
  },
  plugins: [],
};
export default config;