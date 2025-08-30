// nestSimulate.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { AbstractCodeNode, formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import nestSimulate from "./nestSimulate";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
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

export const getSimulateNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  let simulateNode = graph.nodes.find((node: AbstractCodeNode) => node.type === "nest.Simulate");
  if (!simulateNode) simulateNode = graph.addNodeAtColumn(nestSimulate, 4, 100);
  return simulateNode;
};
