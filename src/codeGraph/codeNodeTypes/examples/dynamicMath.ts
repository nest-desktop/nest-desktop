// dynamicMath.ts

import { setType } from "@baklavajs/interface-types";

import {
  CodeNodeOutputInterface,
  NumberInterface,
  SelectInterface,
  defineDynamicCodeNode,
  numberType,
} from "@babsey/code-graph";

export default defineDynamicCodeNode({
  type: "dynamicMath",
  title: "dynamic math",
  inputs: {
    operation: () => new SelectInterface("Operation", "Addition", ["Addition", "Subtraction", "Sine"]).setPort(false),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface("").use(setType, numberType),
  },
  onUpdate({ operation }) {
    if (operation === "Sine") {
      return {
        inputs: {
          number1: () => new NumberInterface("number", 0),
        },
      };
    } else {
      return {
        inputs: {
          number1: () => new NumberInterface("number", 0),
          number2: () => new NumberInterface("number", 0),
        },
      };
    }
  },
  codeTemplate() {
    switch (this.inputs.operation.value) {
      case "Addition":
        return "{{  inputs.number1 }} + {{  inputs.number2 }}";
      case "Subtraction":
        return "{{  inputs.number1 }} - {{  inputs.number2 }}";
      case "Sine":
        return "sin({{  inputs.number1 }})";
    }
  },
});
