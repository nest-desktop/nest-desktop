// nestRandomExponential.ts

import { displayInSidebar, NumberInterface } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import nestRandomExponential from "./nestRandomExponential";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export interface INESTRandomExponentialProps {
  beta?: number;
}

export default defineCodeNode({
  type: "nest.random.exponential",
  title: "random exponential",
  variableName: "randexp",
  inputs: {
    beta: () => new NumberInterface("beta", 1).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const beta = this.node.getConnectedOutputInterfaceByInterface("beta");
    if (beta != undefined) args.push(`${formatInterfaceLabel(beta)}`);
    else if (!this.node.inputs.beta.hidden) args.push(`${this.node.inputs.beta.value}`);

    return `nest.random.exponential(${args.join(", ")})`;
  },
});

export const addNESTRandomExponential = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = graph.addNodeAtColumn(nestRandomExponential, -2, 900);
  codeNode.state.integrated = true;
  return codeNode;
};

export const loadNESTRandomNormal = (
  graph: CodeGraph | NESTCodeGraph,
  randProps?: INESTRandomExponentialProps,
): AbstractCodeNode => {
  const codeNode = addNESTRandomExponential(graph);
  codeNode.state.props = randProps;
  if (randProps) codeNode.updateValues(randProps);

  return codeNode;
};
