// pynnNESTRandomDistribution.ts

import { SelectInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "pyNN.nest.RandomDistribution",
  modules: ["pyNN.nest"],
  title: "random distribution",
  inputs: {
    distribution: () =>
      new SelectInterface("distribution", "uniform", [
        "binomial",
        "gamma",
        "exponential",
        "lognormal",
        "normal",
        "normal_clipped",
        "normal_clipped_to_boundary",
        "poisson",
        "uniform",
      ]),
  },
  codeTemplate: () => "pyNN.nest.RandomDistribution({{ inputs.distribution.value }})",
});
