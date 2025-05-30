// numpyRandomUniform.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.random.uniform",
  title: "random uniform distribution",
  inputs: {
    low: () => new IntegerInterface("low", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    high: () => new IntegerInterface("high", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    size: () => new IntegerInterface("size", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
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

      keyword =
        args.length < 1 && paramKey === "high" ? "high=" : args.length < 2 && paramKey === "size" ? "size=" : "";

      args.push(`${keyword}${this.node.getInputValue(paramKey)}`);
    });

    return `np.random.uniform(${args.join(", ")})`;
  },
  variableName: "uniform",
});
