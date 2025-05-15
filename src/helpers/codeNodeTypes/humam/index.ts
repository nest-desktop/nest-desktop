// humam/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import humamAnalysis from "./humamAnalysis";
import humamNetwork from "./humamNetwork";
import humamNeuronNumbers from "./humamNeuronNumbers";
import humamSimulation from "./humamSimulation";
import humamSynapseNumbers from "./humamSynapseNumbers";

export const registerHumamNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  const editor = codeGraphStore.editor;

  codeGraphStore.state.modules["humam"] = "import humam";

  editor.registerNodeType(humamAnalysis, { category: "humam" });
  editor.registerNodeType(humamNetwork, { category: "humam" });
  editor.registerNodeType(humamNeuronNumbers, { category: "humam" });
  editor.registerNodeType(humamSimulation, { category: "humam" });
  editor.registerNodeType(humamSynapseNumbers, { category: "humam" });
};
