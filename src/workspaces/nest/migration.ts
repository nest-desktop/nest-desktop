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
  const createNodes = projectState.network?.nodes?.map((nodeState: INESTNodeState) => {
    const codeNode = loadNESTCreateNode(graph, nodeState);
    if (nodeState.params) codeNode.inputs.params.setHidden(Object.keys(nodeState.params).length === 0);
    return codeNode;
  });

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
