// listComprehension.ts

import { NodeInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";

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
    const list = this.node.getConnectedOutputInterfaceByInterface("list");
    if (!list) return "[]";
    const listValue = formatInterfaceLabel(list);
    const expression = this.node.getConnectedOutputInterfaceByInterface("expression");
    if (!expression) return `[i for i in ${listValue}]`;
    const expressionValue = formatInterfaceLabel(expression);
    return `[${expressionValue} for i in ${listValue}]`;
  },
});
