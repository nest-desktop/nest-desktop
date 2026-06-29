// list.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeOutputInterface, ListInputInterface, defineCodeNode, listType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "list",
  variableName: "l",
  inputs: {
    items: () => new ListInputInterface("list"),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, listType),
  },
  codeTemplate: () => "{{ inputs.items }}",
});
