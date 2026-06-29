// nestRandomLognormal.ts

import { CodeNodeOutputInterface, NumberInterface, defineCodeNode } from "@babsey/code-graph";

// import nestRandomLognormal from "./nestRandomLognormal";
// import { NESTCodeGraph } from "../../codeGraph/codeGraph";

// export interface INESTRandomLognormalState {
//   mean?: number
//   std?: number
// }

export const nestRandomLognormal = defineCodeNode({
  type: "nest.random.lognormal",
  title: "random log normal",
  variableName: "r",
  inputs: {
    mean: () => new NumberInterface("mean", 0).setOptional(true),
    std: () => new NumberInterface("std", 1).setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
  // codeTemplate() {
  //   if (!this.node) return this.type;
  //   const args: string[] = [];
  //   let keyword: string = "";

  //   const mean = this.node.getConnectedNodeByInterface("mean");
  //   if (mean != undefined) args.push(`${mean.value}`);
  //   else if (!this.node.inputs.mean.hidden) args.push(`${this.node.inputs.mean.value}`);

  //   keyword = args.length < 1 ? "std=" : "";
  //   const std = this.node.getConnectedNodeByInterface("std");
  //   if (std != undefined) args.push(`${keyword}${std.value}`);
  //   else if (!this.node.inputs.std.hidden) args.push(`${keyword}${this.node.inputs.std.value}`);

  //   return `nest.random.lognormal(${args.join(", ")})`;
  // },
});

// export const addNESTRandomLognormal = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
//   const codeNode = graph.addNodeAtCoordinates(nestRandomLognormal, getPositionAtColumn(-2, 900));
//   codeNode.state.integrated = true;
//   return codeNode;
// };

// export const loadNESTRandomLognormal = (
//   graph: CodeGraph | NESTCodeGraph,
//   randState?: INESTRandomLognormalState,
// ): AbstractCodeNode => {
//   const codeNode = addNESTRandomLognormal(graph);
//   codeNode.state.props = randState;
//   if (randState) codeNode.updateValues(randState);

//   return codeNode;
// };
