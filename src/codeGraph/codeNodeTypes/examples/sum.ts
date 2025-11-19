// sum.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeInputInterface, CodeNodeOutputInterface, defineCodeNode, numberType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "sum",
  variableName: "result",
  inputs: {
    arg1: () => new CodeNodeInputInterface("arg1"),
    arg2: () => new CodeNodeInputInterface("arg2"),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, numberType),
  },
  codeTemplate: () => "{{  inputs.arg1 }} + {{  inputs.arg2 }}",
});
