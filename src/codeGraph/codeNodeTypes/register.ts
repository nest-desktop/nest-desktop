// codeNodeTypes/register.ts

import { type Ref, ref } from "vue";
import { type ICodeGraphViewModel } from "@babsey/code-graph";

import { registerDefaultNodeTypes } from "./default";
import { registerElephantNodeTypes } from "./elephant";
import { registerExampleNodeTypes } from "./examples";
import { registerHumamNodeTypes } from "./humam";
import { registerNeoNodeTypes } from "./neo";
import { registerNumpyNodeTypes } from "./numpy";
import { registerTorchNodeTypes } from "./torch";

type TCodeNodeModules = (viewModel: ICodeGraphViewModel) => void;

const codeNodeModules: Ref<Record<string, TCodeNodeModules>> = ref({
  default: registerDefaultNodeTypes,
  elephant: registerElephantNodeTypes,
  example: registerExampleNodeTypes,
  humam: registerHumamNodeTypes,
  neo: registerNeoNodeTypes,
  numpy: registerNumpyNodeTypes,
  torch: registerTorchNodeTypes,
});

export const registerCodeNodeModule = (moduleName: string, nodeTypes: TCodeNodeModules) => {
  codeNodeModules.value[moduleName] = nodeTypes;
};

export const registerNodeTypes = (viewModel: ICodeGraphViewModel, modules?: string[]) => {
  if (!modules) modules = Object.keys(codeNodeModules.value);
  modules.forEach((module: string) => {
    const nodeTypeModule = codeNodeModules.value[module];
    if (nodeTypeModule) nodeTypeModule(viewModel);
  });
};
