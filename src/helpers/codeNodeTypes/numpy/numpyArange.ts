// numpyArange.ts

import { displayInSidebar, NumberInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.arange",
  title: "arange",
  inputs: {
    start: () => new NumberInterface("start", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    stop: () => new NumberInterface("stop", 1).use(setType, numberType),
    step: () => new NumberInterface("step", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface<INumpyArray>().use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];
    let keyword = "";

    Object.keys(this.node.inputs).forEach((paramKey) => {
      if (!this.node || this.node.inputs[paramKey].hidden) return;

      keyword = args.length < 2 && paramKey === "step" ? "step=" : "";
      args.push(`${keyword}${this.node.getInputValue(paramKey)}`);
    });

    return `np.arange(${args.join(", ")})`;
  },
  variableName: "values",
});
