// numpyRandomSeed.ts

import { IntegerInterface, setType } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "../base/interfaceTypes";

export default defineCodeNode({
  type: "numpy.random.seed",
  title: "random seed",
  inputs: {
    seed: () => new IntegerInterface("seed", 0).use(setType, numberType),
  },
  codeTemplate: () => "np.random.seed({{ inputs.seed.value }})",
});
