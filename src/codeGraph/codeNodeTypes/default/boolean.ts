// boolean.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeOutputInterface, CheckboxInterface, defineCodeNode, booleanType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "boolean",
  variableName: "b",
  inputs: {
    boolean: () => new CheckboxInterface("boolean", false),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, booleanType),
  },
  codeTemplate: () => "{{ inputs.boolean }}",
});
