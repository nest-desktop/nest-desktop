// function.ts

import { TextareaInputInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "function",
  title: "function",
  inputs: {
    code: () => new TextareaInputInterface("function", "").setPort(false),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `${this.node.inputs.code.value}`;
  },
});
