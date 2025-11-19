// migration.ts

import type { CodeGraph } from "@babsey/code-graph";

import { INESTNodeProps, INESTProjectProps } from "@/workspaces/nest/types";
import { loadNESTResetKernelNode } from "@/codeGraph/codeNodeTypes/nest/nestResetKernel";
import { loadNESTSetKernelStatusNode } from "@/codeGraph/codeNodeTypes/nest/nestSetKernelStatus";
import { loadNESTSimulationNode } from "@/codeGraph/codeNodeTypes/nest/nestSimulate";
import { loadNESTCreateNode } from "@/codeGraph/codeNodeTypes/nest/nestCreate";

export const loadGraphByNESTProject = (graph: CodeGraph, projectProps: INESTProjectProps): void => {
  loadNESTResetKernelNode(graph);
  loadNESTSetKernelStatusNode(graph, projectProps.simulation?.kernel);

  projectProps.network?.nodes?.forEach((nodeProps: INESTNodeProps, idx: number) => {
    loadNESTCreateNode(graph, nodeProps, idx);
  });

  // TODO: Fill the gap with network load functions.

  loadNESTSimulationNode(graph, projectProps.simulation);
};
