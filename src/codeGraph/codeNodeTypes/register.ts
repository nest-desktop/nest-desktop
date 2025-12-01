// codeNodeTypes/register.ts

import { type Ref, ref } from "vue";
import { type ICodeGraphViewModel } from "@babsey/code-graph";

type TNodeTypeModule = (viewModel: ICodeGraphViewModel) => void;

const nodeTypeModules: Ref<Record<string, TNodeTypeModule>> = ref({});

export const registerNodeTypeModule = (moduleName: string, nodeTypes: TNodeTypeModule) => {
  nodeTypeModules.value[moduleName] = nodeTypes;
};

export const registerNodeTypes = (viewModel: ICodeGraphViewModel, modules?: string[]) => {
  if (!modules) modules = Object.keys(nodeTypeModules);
  modules.forEach((module: string) => {
    const nodeTypeModule = nodeTypeModules.value[module];
    if (nodeTypeModule) nodeTypeModule(viewModel);
  });
};
