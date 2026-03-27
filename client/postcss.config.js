module.exports = {
  plugins: {
    'postcss-custom-properties': {
      features: {
        'custom-selectors': false, // Вимикає сувору перевірку кастомних селекторів
      },
    },
    tailwindcss: {},
    autoprefixer: {},
  },
};
