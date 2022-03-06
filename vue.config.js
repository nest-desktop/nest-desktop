module.exports = {
  publicPath: process.env.BASE_URL, // '.',
  outputDir: './nest_desktop/app',
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,
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
