// nestSimulate.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { CodeGraph, findNodeByType } from "@/helpers/codeGraph/codeGraph";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import nestSimulate from "./nestSimulate";
import { INESTSimulationProps } from "../../simulation/simulation";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export default defineCodeNode({
  type: "nest.Simulate",
  title: "simulate",
  inputs: {
    time: () => new IntegerInterface("time", 1000).use(setType, numberType).use(displayInSidebar, true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const time = this.node.getConnectedOutputInterfaceByInterface("time");
    if (time != undefined) args.push(`${formatInterfaceLabel(time)}`);
    else args.push(`${this.node.inputs.time.value}`);

    return `nest.Simulate(${args.join(",")})`;
  },
  onPlaced() {
    if (!this.node || !this.node.code) return;

    if (!this.node.code.project.simulation) return;
    this.node.view = this.node.code.project.simulation;
    this.node.view.codeNodes.node = this;
  },
});

export const addNESTSimulateNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = graph.addNodeAtColumn(nestSimulate, 4, 100);
  codeNode.state.comments = "Run simulation";
  return codeNode;
};

export const getNESTSimulateNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = findNodeByType(graph, "nest.Simulate");
  if (!codeNode) return addNESTSimulateNode(graph);
  return codeNode;
};

export const loadNESTSimulationNode = (
  graph: CodeGraph | NESTCodeGraph,
  simulationProps: INESTSimulationProps,
): void => {
  const codeNode = getNESTSimulateNode(graph);

  if (simulationProps) {
    codeNode.inputs.time.value = simulationProps.time ?? 1000;
  }

  graph.nodes
    .filter((node: AbstractCodeNode) => node.type === "nest.Connect")
    .forEach((node: AbstractCodeNode) => graph.addConnection(node.outputs._node, codeNode.inputs._node));
};
