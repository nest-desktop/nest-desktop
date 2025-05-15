// pynnNESTRun.ts

import { displayInSidebar, IntegerInterface } from "baklavajs";
import { setType } from "@baklavajs/interface-types";

import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "pyNN.nest.run",
  modules: ["pyNN.nest"],
  title: "run",
  inputs: {
    time: () => new IntegerInterface("time", 1000).use(setType, numberType).use(displayInSidebar, true),
  },
  codeTemplate: () => "pyNN.nest.run({{ inputs.time.value }})",
});
