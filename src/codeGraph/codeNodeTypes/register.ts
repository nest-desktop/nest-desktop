// codeNodeTypes/register.ts

import { type Ref, ref } from "vue";
import { type ICodeGraphViewModel } from "@babsey/code-graph";

import { registerDefaultNodeTypes } from "./default";
import { registerExampleNodeTypes } from "./examples";
import { registerNumpyNodeTypes } from "./numpy";
import { registerElephantNodeTypes } from "./elephant";
import { registerTorchNodeTypes } from "./torch";
import { registerNeoNodeTypes } from "./neo";

type TCodeNodeModules = (viewModel: ICodeGraphViewModel) => void;

const codeNodeModules: Ref<Record<string, TCodeNodeModules>> = ref({
  default: registerDefaultNodeTypes,
  example: registerExampleNodeTypes,
  numpy: registerNumpyNodeTypes,
  elephant: registerElephantNodeTypes,
  torch: registerTorchNodeTypes,
  neo: registerNeoNodeTypes,
});

export const registerCodeNodeModule = (moduleName: string, nodeTypes: TNodeTypeModule) => {
  codeNodeModules.value[moduleName] = nodeTypes;
};

export const registerNodeTypes = (viewModel: ICodeGraphViewModel, modules?: string[]) => {
  if (!modules) modules = Object.keys(codeNodeModules.value);
  modules.forEach((module: string) => {
    const nodeTypeModule = codeNodeModules.value[module];
    if (nodeTypeModule) nodeTypeModule(viewModel);
  });
};
