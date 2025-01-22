// add.ts

import { NodeInterface, NumberInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "add",
  title: "add",
  inputs: {
    number1: () => new NumberInterface("Number", 1),
    number2: () => new NumberInterface("Number", 1),
  },
  outputs: {
    result: () => new NodeInterface("Result", 0),
  },
  calculate({ number1, number2 }) {
    return { result: number1 + number2 };
  },
});
