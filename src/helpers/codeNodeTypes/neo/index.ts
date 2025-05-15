// neo/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import neoSize from "./neoSize";
import neoSpikeTrain from "./neoSpikeTrain";

export const registerNeoNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  const editor = codeGraphStore.editor;

  codeGraphStore.state.modules["neo.core"] = "import neo";

  editor.registerNodeType(neoSpikeTrain, { category: "neo.core" });
  editor.registerNodeType(neoSize, { category: "neo" });
};
