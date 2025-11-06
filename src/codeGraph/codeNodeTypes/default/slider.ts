// slider.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeOutputInterface, SliderInterface, defineCodeNode, numberType } from "@babsey/code-graph";

export default defineCodeNode({
  type: "slider",
  inputs: {
    slider: () => new SliderInterface("slider", 0.5, 0, 1).use(setType, numberType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, numberType),
  },
  codeTemplate: () => "{{ inputs.slider }}",
});
