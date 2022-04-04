module.exports = {
  mode: "jit",
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      screens: {
        '3xl': '2000px',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
}
