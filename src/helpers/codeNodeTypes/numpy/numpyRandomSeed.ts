// numpyRandomSeed.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.random.seed",
  title: "random seed",
  inputs: {
    seed: () => new IntegerInterface("seed", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    Object.keys(this.node.inputs).forEach((paramKey) => {
      if (!this.node || this.node.inputs[paramKey].hidden) return;
      args.push(`${this.node.getInputValue(paramKey)}`);
    });

    return `np.random.seed(${args.join(", ")})`;
  },
});
