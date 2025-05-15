// pynn/codeNodeTypes

import { registerPyNNNESTNodeTypes } from "./nest";
import { registerPyNNRandmNodeTypes } from "./random";

export const registerPyNNNodeTypes = () => {
  // const codeGraphStore = useCodeGraphStore();
  // codeGraphStore.state.modules["pynn"] = "import pynn";

  registerPyNNNESTNodeTypes();
  registerPyNNRandmNodeTypes();
};
