process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  publicPath: process.env.BASE_URL, // '.',
  outputDir: './nest_desktop/app',
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.code/i,
          use: 'raw-loader',
        },
      ],
    },
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'NEST Desktop';
      return args;
    });
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
    },
  },
};
