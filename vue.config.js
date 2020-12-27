const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { NewLineKind } = require("typescript");

module.exports = {
  transpileDependencies: ["vuetify"],
  outputDir: "./nest_desktop/app",
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
    newForkTsCheckerOptions.workers = require("os").cpus().length - 1;
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin(newForkTsCheckerOptions)
    );
  }
};
