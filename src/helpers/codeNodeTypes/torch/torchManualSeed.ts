// torchManualSeed.ts

import { IntegerInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.manual_seed",
  title: "manual seed",
  inputs: {
    seed: () => new IntegerInterface("seed", 1).use(setType, numberType),
  },
  onCreate() {
    this.state.position = "top";
  },
  codeTemplate() {
    if (!this.node) return this.type;
    return `torch.manual_seed(${this.node.inputs.seed.value})`;
  },
});
