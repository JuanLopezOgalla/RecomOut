const path = require('path');

module.exports = {
  env: {
    APP_NAME: 'GetAnyHome',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  styleResources: {
    scss: [],
  },
  trailingSlash: true,
  compress: true
};
