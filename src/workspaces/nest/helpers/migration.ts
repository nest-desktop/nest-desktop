// migration.ts

import type { CodeGraph } from "@babsey/code-graph";

import { INESTConnectionState, INESTNodeState, INESTProjectState } from "@/workspaces/nest/types";
import { loadNESTResetKernelNode } from "@/codeGraph/codeNodeTypes/nest/nestResetKernel";
import { loadNESTSetKernelStatusNode } from "@/codeGraph/codeNodeTypes/nest/nestSetKernelStatus";
import { loadNESTSimulationNode } from "@/codeGraph/codeNodeTypes/nest/nestSimulate";
import { loadNESTCreateNode } from "@/codeGraph/codeNodeTypes/nest/nestCreate";
import { loadNESTConnectNode } from "@/codeGraph/codeNodeTypes/nest/nestConnect";

export const loadGraphByNESTProject = (graph: CodeGraph, projectState: INESTProjectState): void => {
  loadNESTResetKernelNode(graph);
  if (projectState.simulation?.kernel) loadNESTSetKernelStatusNode(graph, projectState.simulation.kernel);
  loadNESTSimulationNode(graph, projectState.simulation);

  // TODO: Fill the gap with network load functions.

  const nodes =
    projectState.network?.nodes?.map((nodeState: INESTNodeState, idx: number) => {
      return loadNESTCreateNode(graph, nodeState, idx);
    }) ?? [];

  projectState.network?.connections?.forEach((connectionState: INESTConnectionState, idx: number) => {
    loadNESTConnectNode(graph, connectionState, nodes, idx);
  });
};
