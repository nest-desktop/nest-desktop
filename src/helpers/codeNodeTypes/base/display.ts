// display.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInterface, TextInterface } from "baklavajs";

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
