import { Config } from "@/helpers/common/config";

const _configNames = [
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
    _configNames.forEach(
      (configName: string) => new Config({ name: configName })
    );
  },
};
