// tuple.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeOutputInterface, TupleInputInterface, defineCodeNode, tupleType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "tuple",
  variableName: "t",
  inputs: {
    items: () => new TupleInputInterface("tuple", 0).use(setType, tupleType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, tupleType),
  },
  codeTemplate: () => "{{ inputs.items }}",
});
