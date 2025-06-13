module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Add text-size-adjust support
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead'],
    },
  },
};
