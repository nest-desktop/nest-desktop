// nestRandomLognormal.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import nestRandomLognormal from "./nestRandomLognormal";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export interface INESTRandomLognormalProps {
  mean?: number;
  std?: number;
}

export default defineCodeNode({
  type: "nest.random.lognormal",
  title: "random log normal",
  variableName: "randlognorm",
  inputs: {
    mean: () => new NumberInterface("mean", 0).use(displayInSidebar, true).setHidden(true),
    std: () => new NumberInterface("std", 1).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword: string = "";

    const mean = this.node.getConnectedOutputInterfaceByInterface("mean");
    if (mean != undefined) args.push(`${formatInterfaceLabel(mean)}`);
    else if (!this.node.inputs.mean.hidden) args.push(`${this.node.inputs.mean.value}`);

    keyword = args.length < 1 ? "std=" : "";
    const std = this.node.getConnectedOutputInterfaceByInterface("std");
    if (std != undefined) args.push(`${keyword}${formatInterfaceLabel(std)}`);
    else if (!this.node.inputs.std.hidden) args.push(`${keyword}${this.node.inputs.std.value}`);

    return `nest.random.lognormal(${args.join(", ")})`;
  },
});

export const addNESTRandomNormal = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = graph.addNodeAtColumn(nestRandomLognormal, -2, 900);
  codeNode.state.integrated = true;
  return codeNode;
};

export const loadNESTRandomNormal = (
  graph: CodeGraph | NESTCodeGraph,
  randProps?: INESTRandomLognormalProps,
): AbstractCodeNode => {
  const codeNode = addNESTRandomNormal(graph);
  codeNode.state.props = randProps;
  if (randProps) codeNode.updateValues(randProps);

  return codeNode;
};
