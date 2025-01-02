const webpack = require('webpack');

module.exports = {
  resolve: {
    alias: {
      https: 'https-browserify',
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      net: false,
      tls: false,
      path: require.resolve('path-browserify'),
      process: require.resolve('process'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['Buffer', 'Buffer'],
    }),
  ],
};
