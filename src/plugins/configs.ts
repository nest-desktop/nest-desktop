import { Config } from "@/helpers/config";

const _configNames = [
  "ActivityAxisLabels",
  "ActivityScatterAnimationGraph",
  "App",
  "ColorSchemes",
  "Connection",
  "Network",
  "NetworkGraphWorkspace",
  "Node",
  "Parameter",
  "ParameterRandom",
  "ProjectView",
  "Simulation",
];

export default {
  install() {
    // Load config files.
    _configNames.forEach((configName) => new Config(configName));
  },
};
