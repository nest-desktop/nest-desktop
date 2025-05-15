// pynnNESTSetup.ts

import { displayInSidebar, IntegerInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "pyNN.nest.setup",
  modules: ["pyNN.nest"],
  title: "setup",
  inputs: {
    timestep: () => new IntegerInterface("timestep", 1000).use(setType, numberType).use(displayInSidebar, true),
  },
  codeTemplate: () => "pyNN.nest.setup({{ inputs.time.value }})",
});
