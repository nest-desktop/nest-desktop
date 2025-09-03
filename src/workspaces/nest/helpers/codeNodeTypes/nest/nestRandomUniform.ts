// nestRandomUniform.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import nestRandomUniform from "./nestRandomUniform";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export interface INESTRandomUniformProps {
  min?: number;
  max?: number;
}

export default defineCodeNode({
  type: "nest.random.uniform",
  title: "random uniform",
  variableName: "randuni",
  inputs: {
    min: () => new NumberInterface("min", 0).use(displayInSidebar, true).setHidden(true),
    max: () => new NumberInterface("max", 1).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    const min = this.node.getConnectedOutputInterfaceByInterface("min");
    if (min != undefined) args.push(`${formatInterfaceLabel(min)}`);
    else if (!this.node.inputs.min.hidden) args.push(`${this.node.inputs.min.value}`);

    keyword = args.length < 1 ? "max=" : "";
    const max = this.node.getConnectedOutputInterfaceByInterface("max");
    if (max != undefined) args.push(`${keyword}${formatInterfaceLabel(max)}`);
    else if (!this.node.inputs.max.hidden) args.push(`${keyword}${this.node.inputs.max.value}`);

    return `nest.random.uniform(${args.join(", ")})`;
  },
});

export const addNESTRandomUniform = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
  const typeIdx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.random.uniform").length;
  const codeNode = graph.addNodeAtColumn(nestRandomUniform, -2, 900 + 240 * typeIdx, idx);
  codeNode.state.integrated = true;
  return codeNode;
};

export const loadNESTRandomUniform = (
  graph: CodeGraph | NESTCodeGraph,
  randProps?: INESTRandomUniformProps,
  idx: number = -1,
): AbstractCodeNode => {
  const codeNode = addNESTRandomUniform(graph, idx);
  codeNode.state.props = randProps;
  if (randProps) codeNode.updateValues(randProps);

  return codeNode;
};
