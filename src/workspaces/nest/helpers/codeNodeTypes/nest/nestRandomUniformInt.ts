// nestRandomUniform.ts

import { displayInSidebar, IntegerInterface } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import nestRandomUniformInt from "./nestRandomUniformInt";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export interface INESTRandomUniformProps {
  max?: number;
}

export default defineCodeNode({
  type: "nest.random.uniform_int",
  title: "random uniform int",
  variableName: "randuniint",
  inputs: {
    max: () => new IntegerInterface("max", 1).use(displayInSidebar, true),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const max = this.node.getConnectedOutputInterfaceByInterface("max");
    if (max != undefined) args.push(`${formatInterfaceLabel(max)}`);
    else args.push(`${this.node.inputs.max.value}`);

    return `nest.random.uniform_int(${args.join(", ")})`;
  },
});

export const addNESTRandomUniform = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = graph.addNodeAtColumn(nestRandomUniformInt, -2, 900);
  codeNode.state.integrated = true;
  return codeNode;
};

export const loadNESTRandomUniform = (
  graph: CodeGraph | NESTCodeGraph,
  randProps?: INESTRandomUniformProps,
): AbstractCodeNode => {
  const codeNode = addNESTRandomUniform(graph);
  codeNode.state.props = randProps;
  if (randProps) codeNode.updateValues(randProps);

  return codeNode;
};
