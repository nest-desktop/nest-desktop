// number.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeOutputInterface, NumberInterface, defineCodeNode, numberType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "number",
  variableName: "n",
  inputs: {
    number: () => new NumberInterface("number", 0).use(setType, numberType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, numberType),
  },
  codeTemplate: () => "{{ inputs.number }}",
});
