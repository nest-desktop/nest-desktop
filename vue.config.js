process.env.VUE_APP_VERSION = require('./package.json').version;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  // Uncomment this to activate HTTPS and (partly) HTTP/2 for the dev server
  //devServer: {
  //  https: true,
  //  http2: true,
  //},
  publicPath: process.env.BASE_URL, // '.',
  outputDir: './nest_desktop/app',
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,
  parallel: true,

  // https://stackoverflow.com/questions/55258355/vue-clis-type-checking-service-ignores-memory-limits#55810460
  // and https://cli.vuejs.org/config/#parallel
  configureWebpack: config => {
    // save the current ForkTsCheckerWebpackPlugin
    const existingForkTsChecker = config.plugins.filter(
      plugin => plugin instanceof ForkTsCheckerWebpackPlugin
    )[0];

    // remove it
    config.plugins = config.plugins.filter(
      plugin => !(plugin instanceof ForkTsCheckerWebpackPlugin)
    );

    // copy the options from the original ones, but modify memory and CPUs
    const newForkTsCheckerOptions = existingForkTsChecker.options;
    newForkTsCheckerOptions.memoryLimit = 8192;
    newForkTsCheckerOptions.workers = 4; //require('os').cpus().length;
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin(newForkTsCheckerOptions)
    );

    // add code files to rules
    config.module.rules.push({
      test: /\.code/i,
      use: 'raw-loader',
    });
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'NEST Desktop';
      return args;
    });
  },
  pwa: {
    name: 'NEST Desktop',
    themeColor: '#424242',
    workboxOptions: {
      exclude: ['index.html'],
      skipWaiting: true,
    },
  },
};
