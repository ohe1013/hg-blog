/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        computer: "https://win98icons.alexmeub.com/images/computer_explorer-2.png",
        document: "https://win98icons.alexmeub.com/images/directory_closed-3.png",
      },
    },
  },
  plugins: [],
};
