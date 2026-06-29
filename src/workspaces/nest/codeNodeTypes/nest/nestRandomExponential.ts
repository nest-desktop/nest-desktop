// nestRandomExponential.ts

import { CodeNodeOutputInterface, NumberInterface, defineCodeNode } from "@babsey/code-graph";

// import nestRandomExponential from "./nestRandomExponential";
// import { NESTCodeGraph } from "../../codeGraph/codeGraph";

// export interface INESTRandomExponentialState {
//   beta?: number;
// }

export const nestRandomExponential = defineCodeNode({
  type: "nest.random.exponential",
  title: "random exponential",
  variableName: "r",
  inputs: {
    beta: () => new NumberInterface("beta", 1).setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
  // codeTemplate() {
  //   if (!this.node) return this.type;
  //   const args: string[] = [];

  //   const beta = this.node.getConnectedNodeByInterface("beta");
  //   if (beta != undefined) args.push(`${beta.value}`);
  //   else if (!this.node.inputs.beta.hidden) args.push(`${this.node.inputs.beta.value}`);

  //   return `nest.random.exponential(${args.join(", ")})`;
  // },
});

// export const addNESTRandomExponential = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
//   const codeNode = graph.addNodeAtCoordinates(nestRandomExponential, getPositionAtColumn(-2, 900));
//   codeNode.state.integrated = true;
//   return codeNode;
// };

// export const loadNESTRandomNormal = (
//   graph: CodeGraph | NESTCodeGraph,
//   randState?: INESTRandomExponentialState,
// ): AbstractCodeNode => {
//   const codeNode = addNESTRandomExponential(graph);
//   codeNode.state.props = randState;
//   if (randState) codeNode.updateValues(randState);

//   return codeNode;
// };
