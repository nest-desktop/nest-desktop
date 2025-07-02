// display.ts

import { NodeInterface, TextInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "display",
  title: "display",
  inputs: {
    value: () => new NodeInterface("Value", ""),
  },
  outputs: {
    display: () => new TextInterface("Display", ""),
  },
  calculate({ value }) {
    return { display: String(value) };
  },
});
