// brainscales2HxNeuron.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "brainscales2.HXNeuron",
  title: "HX neuron",
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate: () => "pynn.cells.HXNeuron()",
});
