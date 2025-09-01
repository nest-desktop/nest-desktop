// nestResetKernel.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph, findNodeByType } from "@/helpers/codeGraph/codeGraph";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import nestResetKernel from "./nestResetKernel";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

export default defineCodeNode({
  type: "nest.ResetKernel",
  title: "reset kernel",
  codeTemplate: () => "nest.ResetKernel()",
});

export const addNESTResetKernelNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  return graph.addNodeAtColumn(nestResetKernel, -2, 100);
};

export const getNESTResetKernelNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = findNodeByType(graph, "nest.ResetKernel");
  if (!codeNode) return addNESTResetKernelNode(graph);
  return codeNode;
};

export const loadNESTResetKernelNode = (graph: CodeGraph | NESTCodeGraph): void => {
  getNESTResetKernelNode(graph);
};
