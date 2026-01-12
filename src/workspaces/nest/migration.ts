// migration.ts

import type { AbstractCodeNode, CodeGraph } from "@babsey/code-graph";

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

  const createNodes = projectState.network?.nodes?.map((nodeState: INESTNodeState) =>
    loadNESTCreateNode(graph, nodeState),
  );

  const connectNodes = projectState.network?.connections?.map((connectionState: INESTConnectionState) =>
    loadNESTConnectNode(graph, connectionState, createNodes),
  );

  const simulateNode = loadNESTSimulationNode(graph, projectState.simulation);

  if (connectNodes)
    connectNodes.forEach((codeNode: AbstractCodeNode) => {
      if (!graph.hasConnection(codeNode.outputs._code, simulateNode.inputs._code))
        graph.addConnection(codeNode.outputs._code, simulateNode.inputs._code);
    });
};
