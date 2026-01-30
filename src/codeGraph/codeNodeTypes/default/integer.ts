// integer.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeOutputInterface, IntegerInterface, defineCodeNode, numberType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "integer",
  variableName: "i",
  inputs: {
    integer: () => new IntegerInterface("integer", 0),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, numberType),
  },
  codeTemplate: () => "{{ inputs.integer }}",
});
