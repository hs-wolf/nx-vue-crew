const path = require('path');

module.exports = {
  content: [
    path.resolve(__dirname, './index.html'),
    path.resolve(__dirname, './src/**/*.{vue,js,ts,jsx,tsx,css}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
