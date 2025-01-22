// codeNodeTypes/pynn

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
import pynnRandomDistribution from "./pynnRandomDistribution";

export const registerPyNNRandmNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  const editor = codeGraphStore.editor;

  codeGraphStore.state.modules["pyNN.random"] = "import pyNN.random";

  editor.registerNodeType(pynnRandomDistribution, { category: "pynn.random" });
};
