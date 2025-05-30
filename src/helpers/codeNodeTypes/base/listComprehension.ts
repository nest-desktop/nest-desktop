// listComprehension.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "listComprehension",
  title: "list comprehension",
  inputs: {
    expression: () => new NodeInterface("expression", ""),
    list: () => new NodeInterface("list", ""),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate() {
    if (!this.node) return "";
    const lists = this.node.getConnectedOutputInterfacesByInterface("list");
    if (lists.length == 0) return "[]";
    const expressions = this.node.getConnectedNodesByInterface("expression");
    if (expressions.length === 0) return `[i for i in ${lists[0].codeTemplate}]`;
    return `[${expressions[0].codeTemplate} for i in ${lists[0].codeTemplate}]`;
  },
});
