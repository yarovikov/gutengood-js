const defaultConfig = require('./node_modules/@wordpress/scripts/config/webpack.config.js');
const path = require('path');

module.exports = {
  ...defaultConfig,
  entry: {
    'gutengood': path.resolve(__dirname, 'src/index.js'),
  },
  optimization: {
    ...defaultConfig.optimization,
  },
  module: {
    ...defaultConfig.module,
  },
  plugins: [...defaultConfig.plugins],
};
