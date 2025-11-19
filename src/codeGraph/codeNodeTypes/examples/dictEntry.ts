// dialog.ts

import { setType } from "@baklavajs/interface-types";

import {
  CodeNodeOutputInterface,
  TextareaInputInterface,
  TextInputInterface,
  defineCodeNode,
  stringType,
} from "@babsey/code-graph";

export default defineCodeNode({
  type: "dictEntry",
  title: "dict entry",
  inputs: {
    key: () => new TextInputInterface("key", "").use(setType, stringType).setPort(false),
    value: () => new TextareaInputInterface("value", "").use(setType, stringType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
  codeTemplate: () => "{{  inputs.key }}: {{  inputs.value }}",
});
