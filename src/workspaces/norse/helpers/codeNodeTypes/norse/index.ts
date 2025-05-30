// codeNodeTypes/norse

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import norseDataResponse from "./norseDataResponse";
import norseIAF from "./norseIAF";
import norseIAFCell from "./norseIAFCell";
import norseIAFParameters from "./norseIAFParameters";
import norseLI from "./norseLI";
import norseLIF from "./norseLIF";
import norseLIFParameters from "./norseLIFParameters";
import norseLIParameters from "./norseLIParameters";
import norseModelApply from "./norseModelApply";
import norseSequentialState from "./norseSequentialState";

export const registerNorseNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["norse"] = "import norse";
  codeGraphStore.state.modules["norse.torch"] = "import norse";

  const editor = codeGraphStore.editor;
  editor.registerNodeType(norseDataResponse, { category: "norse" });
  editor.registerNodeType(norseIAF, { category: "norse.torch" });
  editor.registerNodeType(norseIAFCell, { category: "norse.torch" });
  editor.registerNodeType(norseIAFParameters, { category: "norse.torch" });
  editor.registerNodeType(norseLI, { category: "norse.torch" });
  editor.registerNodeType(norseLIF, { category: "norse.torch" });
  editor.registerNodeType(norseLIFParameters, { category: "norse.torch" });
  editor.registerNodeType(norseLIParameters, { category: "norse.torch" });
  editor.registerNodeType(norseModelApply, { category: "norse" });
  editor.registerNodeType(norseSequentialState, { category: "norse.torch" });
};
