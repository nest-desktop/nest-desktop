// codeNodeTypes/brainscales2

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import brainscales2AllToAllConnector from "./brainscales2AllToAllConnector";
import brainscales2End from "./brainscales2End";
import brainscales2HxNeuron from "./brainscales2HxNeuron";
import brainscales2Population from "./brainscales2Population";
import brainscales2Projection from "./brainscales2Projection";
import brainscales2Run from "./brainscales2Run";
import brainscales2Setup from "./brainscales2Setup";

export const registerBrainScales2NodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  const editor = codeGraphStore.editor;

  codeGraphStore.state.modules["brainscales2"] = "import pynn_brainscales.brainscales2 as pynn";

  editor.registerNodeType(brainscales2AllToAllConnector, { category: "brainscales2" });
  editor.registerNodeType(brainscales2End, { category: "brainscales2" });
  editor.registerNodeType(brainscales2HxNeuron, { category: "brainscales2.cells" });
  editor.registerNodeType(brainscales2Population, { category: "brainscales2" });
  editor.registerNodeType(brainscales2Projection, { category: "brainscales2" });
  editor.registerNodeType(brainscales2Run, { category: "brainscales2" });
  editor.registerNodeType(brainscales2Setup, { category: "brainscales2" });
};
