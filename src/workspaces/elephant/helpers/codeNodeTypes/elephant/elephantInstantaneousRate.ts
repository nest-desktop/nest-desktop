// elephantInstantaneousRate.ts

import { IntegerInterface, setType } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel, formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "elephant.statistics.instantaneous_rate",
  title: "instantaneous rate",
  inputs: {
    spiketrains: () => new NodeInputInterface("spiketrains"),
    sampling_period: () => new IntegerInterface("sampling period", 0).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const spiketrains = this.node.getConnectedOutputInterfacesByInterface("spiketrains");
    if (spiketrains.length > 1) args.push(`[${formatInterfaceLabels(spiketrains).join(", ")}]`);
    if (spiketrains.length > 0) args.push(`${formatInterfaceLabels(spiketrains).join(", ")}`);

    const samplingPeriod = this.node.getConnectedOutputInterfaceByInterface("sampling_period");
    if (samplingPeriod != undefined) args.push(`${formatInterfaceLabel(samplingPeriod)}`);
    else if (!this.node.inputs.sampling_period.hidden) args.push(`${this.node.inputs.sampling_period.value}`);

    return `elephant.statistics.instantaneous_rate(${args.join(", ")})`;
  },
  variableName: "ir",
});
