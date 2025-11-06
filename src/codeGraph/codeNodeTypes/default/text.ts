// text.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeOutputInterface, TextInputInterface, defineCodeNode, stringType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "text",
  inputs: {
    text: () => new TextInputInterface("text", "").use(setType, stringType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, stringType),
  },
  codeTemplate: () => "{{ inputs.text }}",
});
