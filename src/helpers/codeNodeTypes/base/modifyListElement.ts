// modifyListElement.ts

import { TextInputInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "modifyListElement",
  title: "modify list element",
  inputs: {
    list: () => new NodeInputInterface("list"),
    index: () => new TextInputInterface("index", ""),
    value: () => new TextInputInterface("value", ""),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const lists = this.node.getConnectedOutputInterfacesByInterface("list");
    if (lists.length == 0) return this.type;
    return `${lists[0].label}[${this.node.inputs.index.value}] = ${this.node.inputs.value.value}`;
  },
});
