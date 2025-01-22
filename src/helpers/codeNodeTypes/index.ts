// codeNodeTypes

import { registerBaseNodeTypes } from "./base";
import { registerHumamNodeTypes } from "./humam";
import { registerNeoNodeTypes } from "./neo";
import { registerNumpyNodeTypes } from "./numpy";
import { registerPandasNodeTypes } from "./pandas";
import { registerPlotlyNodeTypes } from "./plotly";
import { registerTorchNodeTypes } from "./torch";

import { registerBrainScales2NodeTypes } from "@/workspaces/pynn/helpers/codeNodeTypes/brainscales2";
import { registerElephantNodeTypes } from "@/workspaces/elephant/helpers/codeNodeTypes/elephant";
import { registerNESTNodeTypes } from "@/workspaces/nest/helpers/codeNodeTypes/nest";
import { registerNorseNodeTypes } from "@/workspaces/norse/helpers/codeNodeTypes/norse";
import { registerPyNNNodeTypes } from "@/workspaces/pynn/helpers/codeNodeTypes/pynn";

export const registerCodeNodeTypes = (nodeTypes: string[]) => {
  if (nodeTypes.includes("base")) registerBaseNodeTypes();
  if (nodeTypes.includes("brainscales2")) registerBrainScales2NodeTypes();
  if (nodeTypes.includes("elephant")) registerElephantNodeTypes();
  if (nodeTypes.includes("neo")) registerNeoNodeTypes();
  if (nodeTypes.includes("nest")) registerNESTNodeTypes();
  if (nodeTypes.includes("norse")) registerNorseNodeTypes();
  if (nodeTypes.includes("numpy")) registerNumpyNodeTypes();
  if (nodeTypes.includes("pandas")) registerPandasNodeTypes();
  if (nodeTypes.includes("humam")) registerHumamNodeTypes();
  if (nodeTypes.includes("plotly")) registerPlotlyNodeTypes();
  if (nodeTypes.includes("pynn")) registerPyNNNodeTypes();
  if (nodeTypes.includes("torch")) registerTorchNodeTypes();
};
