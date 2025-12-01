// migration.ts

import type { CodeGraph } from "@babsey/code-graph";

import { INESTConnectionState, INESTNodeState, INESTProjectState } from "@/workspaces/nest/types";

import {
  loadNESTResetKernelNode,
  loadNESTSetKernelStatusNode,
  loadNESTSimulationNode,
  loadNESTCreateNode,
  loadNESTConnectNode,
} from "./codeNodeTypes/nest";

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
