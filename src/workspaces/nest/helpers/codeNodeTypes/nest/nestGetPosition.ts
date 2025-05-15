// nestGetPosition.ts

import { setType } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";

export default defineCodeNode({
  type: "nest.GetPosition",
  title: "get position",
  variableName: "pos",
  inputs: {
    node: () => new NodeInputInterface<INESTNodeCollection>("node").use(setType, nestNodeCollectionType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: () => "nest.GetPosition({{ inputs.node.label }})",
});
