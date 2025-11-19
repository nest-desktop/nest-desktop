// upgrade_42_to_50.ts

import { PythonCode, useCodeGraph } from "@babsey/code-graph";

import { registerNodeTypes } from "@/codeGraph/codeNodeTypes";
import { useAppStore } from "@/stores/appStore";
import { INodeProps } from "@/networkGraph";

const validateVersion = (version: string) => /^4\.2(\.\d+)?(\w+)?$/.test(version);

const renameKernelParam: Record<string, string> = {
  localNumThreads: "local_num_threads",
  rngSeed: "rng_seed",
};

export function upgradeProject_42_to_50(projectProps: any): any {
  const appStore = useAppStore();

  if (!validateVersion(projectProps.version)) return projectProps;

  // Kernel
  const kernelProps = projectProps.simulation.kernel;
  projectProps.simulation.kernel = Object.fromEntries(
    Object.entries(kernelProps).map(([k, v]) => [
      renameKernelParam[k] ?? k,
      { value: v, id: renameKernelParam[k] ?? k },
    ]),
  );

  // Params
  projectProps.network.nodes
    .filter((nodeProps: any) => nodeProps.params)
    .forEach((nodeProps: any) => (nodeProps.params = Object.fromEntries(nodeProps.params.map((p) => [p.id, p]))));

  if (appStore.currentWorkspace?.loadGraphByProject) {
    const viewModel = new useCodeGraph({ code: new PythonCode() });
    registerNodeTypes(viewModel);

    appStore.currentWorkspace.loadGraphByProject(viewModel.editor.graph, projectProps);
    projectProps.code = { editor: viewModel.editor.save() };
  }

  projectProps.version = "5.0";
  return projectProps;
}
