// nestResetKernel.ts

import { defineCodeNode, getPositionAtColumn, type CodeGraph, type AbstractCodeNode } from "@babsey/code-graph";

export const nestResetKernel = defineCodeNode({
  type: "nest.ResetKernel",
  title: "reset kernel",
});

export const addNESTResetKernelNode = (graph: CodeGraph): AbstractCodeNode => {
  return graph.addNodeAtCoordinates(new nestResetKernel(), getPositionAtColumn(-2, 100));
};

export const getNESTResetKernelNode = (graph: CodeGraph): AbstractCodeNode => {
  const codeNode = graph.findNodeByType("nest.ResetKernel");
  if (!codeNode) return addNESTResetKernelNode(graph);
  return codeNode;
};

export const loadNESTResetKernelNode = (graph: CodeGraph): AbstractCodeNode => {
  return getNESTResetKernelNode(graph);
};
