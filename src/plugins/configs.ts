import { Config } from "@/core/config";

const _configNames = [
  "Activity",
  "ActivityAxisLabels",
  "ActivityScatterAnimationGraph",
  "App",
  "ColorSchemes",
  "Connection",
  "Network",
  "NetworkGraph",
  "NetworkGraphWorkspace",
  "Node",
  "NodeRecord",
  "Parameter",
  "ParameterRandom",
  "ProjectView",
  "Simulation",
];

export default {
  install() {
    // Load config files.
    _configNames.forEach((configName: string) => new Config({ name: configName }));
  },
};
