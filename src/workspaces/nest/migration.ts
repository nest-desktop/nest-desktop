// migration.ts

import type { CodeGraph } from "@babsey/code-graph";

import type { INESTConnectionState, INESTNodeState, INESTProjectState } from "@/workspaces/nest/types";

import {
  loadNESTConnectNode,
  loadNESTCreateNode,
  loadNESTDataResponseNode,
  loadNESTResetKernelNode,
  loadNESTSetKernelStatusNode,
  loadNESTSimulationNode,
} from "./codeNodeTypes/nest";

export const loadGraphByNESTProject = (graph: CodeGraph, projectState: INESTProjectState): void => {
  // nest.ResetKernel
  loadNESTResetKernelNode(graph);

  // nest.SetKernelStatus
  if (projectState.simulation?.kernel) loadNESTSetKernelStatusNode(graph, projectState.simulation.kernel);

  // nest.Create
  const createNodes = projectState.network?.nodes?.map((nodeState: INESTNodeState) =>
    loadNESTCreateNode(graph, nodeState),
  );

  // nest.Connect
  projectState.network?.connections?.map((connectionState: INESTConnectionState) =>
    loadNESTConnectNode(graph, connectionState, createNodes),
  );

  // nest.Simulate
  loadNESTSimulationNode(graph, projectState.simulation);

  // response data
  loadNESTDataResponseNode(graph);

  // graph.code?.engine?.runOnce({})
};
