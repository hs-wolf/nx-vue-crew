const path = require('path');

module.exports = {
  plugins: {
    tailwindcss: { config: path.resolve(__dirname, './tailwind.config.js') },
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'development' ? {} : { cssnano: {} }),
  },
};
