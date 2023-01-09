const withMT = require('@material-tailwind/html/utils/withMT');

module.exports = withMT({
  /** @type {import('tailwindcss').Config} */
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [],
});
