// nestPrepare.ts

import { defineCodeNode } from "@babsey/code-graph";

export const nestPrepare = defineCodeNode({
  type: "nest.Prepare",
  title: "prepare",
});

// export const addNESTPrepareNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
//   return graph.addNodeAtCoordinates(nestPrepare, getPositionAtColumn(4, 100));
// };

// export const getNESTPrepareNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
//   const codeNode = graph.findNodeByType("nest.Prepare");
//   if (!codeNode) return addNESTPrepareNode(graph);
//   return codeNode;
// };

// export const loadNESTPrepareNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
//   return getNESTPrepareNode(graph);
// };
