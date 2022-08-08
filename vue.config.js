process.env.VUE_APP_VERSION = require('./package.json').version;

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { NewLineKind } = require('typescript');


module.exports = {
  publicPath: process.env.BASE_URL, // '.',
  outputDir: './nest_desktop/app',
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,
  parallel: false,

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
    newForkTsCheckerOptions.workers = 2;//require('os').cpus().length - 1;
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin(newForkTsCheckerOptions)
    );
    console.log(config.module);
    config.module.rules.push({
      test: /\.code/i,
      use: 'raw-loader',
    });
    console.log(config.module);
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