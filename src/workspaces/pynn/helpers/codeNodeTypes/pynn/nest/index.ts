// codeNodeTypes/pynn/nest

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import pynnNESTEnd from "./pynnNESTEnd";
import pynnNESTPopulation from "./pynnNESTPopulation";
import pynnNESTRun from "./pynnNESTRun";
import pynnNESTSetup from "./pynnNESTSetup";
import pynnNESTRandomDistribution from "./pynnNESTRandomDistribution";
import pynnNESTProjection from "./pynnNESTProjection";
import pynnNESTIFCurrAlpha from "./pynnNESTIFCurrAlpha";

export const registerPyNNNESTNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  const editor = codeGraphStore.editor;

  codeGraphStore.state.modules["pyNN.nest"] = "import pyNN.nest";

  editor.registerNodeType(pynnNESTEnd, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTIFCurrAlpha, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTPopulation, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTProjection, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTRun, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTRandomDistribution, { category: "pyNN.nest" });
  editor.registerNodeType(pynnNESTSetup, { category: "pyNN.nest" });
};
