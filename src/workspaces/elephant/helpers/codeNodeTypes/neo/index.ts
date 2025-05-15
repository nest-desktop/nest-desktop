// elephant/codeNodeTypes

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import neoSpikeTrain from "./neoSpikeTrain";

export const registerNeoNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["neo.core"] = "import neo";

  const editor = codeGraphStore.editor;
  editor.registerNodeType(neoSpikeTrain, { category: "neo.core" });
};
