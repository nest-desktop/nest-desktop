// neoSpiketrain.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";

export default defineCodeNode({
  type: "neo.core.spikeTrain",
  title: "spiketrain",
  inputs: {
    times: () => new NodeInputInterface("times"),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
    times: () => new NodeOutputInterface("times", ".times"),
  },
  codeTemplate: () => "neo.core.SpikeTrain({{ inputs.times.value }})",
  variableName: "spiketrain",
});
