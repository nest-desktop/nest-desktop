// upgrade_42_to_50.ts

import { PythonCode, useCodeGraph } from "@babsey/code-graph";

import { registerNESTNodeTypes } from "@/workspaces/nest/codeNodeTypes/nest";
import { getCurrentWorkspace } from "@/app";

const validateVersion = (version: string) => /^4\.2(\.\d+)?(\w+)?$/.test(version);

const renameKernelParam: Record<string, string> = {
  localNumThreads: "local_num_threads",
  rngSeed: "rng_seed",
};

export function upgradeModel_42_to_50(modelState: any): any {
  if (modelState.params) modelState.params = Object.fromEntries(modelState.params.map((p: any) => [p.id, p]));

  Object.values(modelState.params).forEach((param) => {
    switch (param.component) {
      case "arrayInput":
        param.codeNodeInterface = "ListInputInterface";
        break;
      case "tickSlider":
        param.codeNodeInterface = "NumberInterface";
        break;
      // default:
      //   param.codeNodeInterface = "IntegerInterface";
      //   break
    }
  });

  modelState.version = "5.0";
  return modelState;
}

export function upgradeProject_42_to_50(projectState: any): any {
  if (!validateVersion(projectState.version)) return projectState;

  const currentWorkspace = getCurrentWorkspace();
  if (currentWorkspace) {
    if (currentWorkspace.id === "nest") {
      // Kernel
      const kernelState = projectState.simulation.kernel;
      projectState.simulation.kernel = Object.fromEntries(
        Object.entries(kernelState).map(([k, v]) => [
          renameKernelParam[k] ?? k,
          { value: v, id: renameKernelParam[k] ?? k },
        ]),
      );

      // Node params
      projectState.network.nodes
        .filter((nodeState: any) => nodeState.params)
        .forEach(
          (nodeState: any) => (nodeState.params = Object.fromEntries(nodeState.params.map((p: any) => [p.id, p]))),
        );

      // Connection node idx.
      projectState.network.connections.forEach((connectionState: any) => {
        connectionState.sourceIdx = connectionState.source;
        connectionState.targetIdx = connectionState.target;
      });

      // Connection params
      projectState.network.connections
        .filter((connectionState: any) => connectionState.params)
        .forEach(
          (connectionState: any) =>
            (connectionState.params = Object.fromEntries(connectionState.params.map((p: any) => [p.id, p]))),
        );

      // Synapse params
      projectState.network.connections
        .filter((connectionState: any) => connectionState.synapse?.params)
        .forEach(
          (connectionState: any) =>
            (connectionState.synapse.params = Object.fromEntries(
              connectionState.synapse.params.map((p: any) => [p.id, p]),
            )),
        );
    }

    if (currentWorkspace.loadGraphByProject) {
      const viewModel = useCodeGraph({ code: new PythonCode() });

      registerNESTNodeTypes(viewModel);

      currentWorkspace.loadGraphByProject(viewModel.editor.graph, projectState);
      projectState.code = { editor: viewModel.editor.save() };
    }
  }

  projectState.version = "5.0";
  return projectState;
}
