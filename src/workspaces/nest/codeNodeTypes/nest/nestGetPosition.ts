// nestGetPosition.ts

import { setType } from "@baklavajs/interface-types";

import { CodeNodeInputInterface, CodeNodeOutputInterface, defineCodeNode } from "@babsey/code-graph";

import { nestNodeCollectionType } from "./interfaceTypes";

export const nestGetPosition = defineCodeNode({
  type: "nest.GetPosition",
  title: "get position",
  variableName: "pos",
  inputs: {
    node: () => new CodeNodeInputInterface("node").use(setType, nestNodeCollectionType),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
});
