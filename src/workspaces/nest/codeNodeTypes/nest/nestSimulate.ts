// nestSimulate.ts

import {
  IntegerInterface,
  defineCodeNode,
  getPositionAtColumn,
  type AbstractCodeNode,
  type CodeGraph,
} from "@babsey/code-graph";

import type { INESTKernelState } from "./nestSetKernelStatus";

export interface INESTSimulationState {
  kernel?: INESTKernelState;
  time?: number;
  modules?: string[];
}

export const nestSimulate = defineCodeNode({
  type: "nest.Simulate",
  title: "simulate",
  inputs: {
    t: () => new IntegerInterface("time", 1000),
  },
  afterGraphLoaded() {
    if (!this.code.project) return;
    this.code.project.simulation.registerCodeNode(this);
  },
});

export const addNESTSimulateNode = (graph: CodeGraph): AbstractCodeNode => {
  const codeNode = graph.addNodeAtCoordinates(new nestSimulate(), getPositionAtColumn(4, 100));
  codeNode.state.comments = "Run simulation";
  return codeNode;
};

export const getNESTSimulateNode = (graph: CodeGraph): AbstractCodeNode => {
  const codeNode = graph.findNodeByType("nest.Simulate");
  if (!codeNode) return addNESTSimulateNode(graph);
  return codeNode;
};

export const loadNESTSimulationNode = (graph: CodeGraph, simulationState?: INESTSimulationState): AbstractCodeNode => {
  const codeNode = getNESTSimulateNode(graph);
  codeNode.state.props = simulationState;
  if (simulationState) codeNode.updateInputValues(simulationState);

  graph.nodes
    .filter((node: AbstractCodeNode) => node.type === "nest.Connect")
    .forEach((node: AbstractCodeNode) => graph.addConnection(node.outputs._node, codeNode.inputs._node));

  return codeNode;
};
