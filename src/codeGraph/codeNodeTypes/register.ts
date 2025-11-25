// codeNodeTypes/register.ts

import { type ICodeGraphViewModel } from "@babsey/code-graph";

import { registerDefaultNodeTypes } from "./default";
import { registerElephantNodeTypes } from "./elephant";
import { registerExampleNodeTypes } from "./examples";
import { registerHumamNodeTypes } from "./humam";
import { registerNESTNodeTypes } from "./nest";
import { registerNeoNodeTypes } from "./neo";
import { registerNorseNodeTypes } from "./norse";
import { registerNumpyNodeTypes } from "./numpy";
import { registerPandasNodeTypes } from "./pandas";
import { registerTorchNodeTypes } from "./torch";

export function registerNodeTypes(viewModel: ICodeGraphViewModel) {
  registerDefaultNodeTypes(viewModel);
  registerElephantNodeTypes(viewModel);
  registerExampleNodeTypes(viewModel);
  registerHumamNodeTypes(viewModel);
  registerNESTNodeTypes(viewModel);
  registerNeoNodeTypes(viewModel);
  registerNorseNodeTypes(viewModel);
  registerNumpyNodeTypes(viewModel);
  registerPandasNodeTypes(viewModel);
  registerTorchNodeTypes(viewModel);
}
