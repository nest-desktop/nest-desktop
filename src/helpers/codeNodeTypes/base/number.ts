// variable.ts

import { IntegerInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { numberType } from "./interfaceTypes";

export default defineCodeNode({
  type: "number",
  title: "number",
  inputs: {
    number: () => new IntegerInterface("number", 0).use(setType, numberType).setPort(false),
  },
  outputs: {
    out: () => new NodeOutputInterface<number>().use(setType, numberType),
  },
  codeTemplate() {
    if (!this.node) return "{{ inputs.number.value }}";
    return `${this.node.inputs.number.value}`;
  },
  variableName: "n",
});
