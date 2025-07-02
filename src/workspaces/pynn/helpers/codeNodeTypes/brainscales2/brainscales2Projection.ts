// brainscales2Projection.ts

import { SelectInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { formatInterfaceLabel, formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";

export default defineCodeNode({
  type: "brainscales2.Projection",
  title: "Projection",
  inputs: {
    presynaptic_neurons: () => new NodeInputInterface("presynaptic_neurons"),
    postsynaptic_neurons: () => new NodeInputInterface("postsynaptic_neurons"),
    connector: () =>
      new SelectInterface("connector", "pynn.AlltoAllConnector", ["pynn.AlltoAllConnector", "pynn.OneToOneConnector"]),
  },
  codeTemplate() {
    if (!this.node) return this.type;

    const presynapticNeurons = this.node.getConnectedOutputInterfacesByInterface("presynaptic_neurons");
    const postsynapticNeurons = this.node.getConnectedOutputInterfacesByInterface("postsynaptic_neurons");
    if (presynapticNeurons.length === 0 || postsynapticNeurons.length === 0) return this.type;

    const args: string[] = [
      `${formatInterfaceLabels(presynapticNeurons).join("+")}`,
      `${formatInterfaceLabels(postsynapticNeurons).join("+")}`,
    ];

    const connector = this.node.getConnectedOutputInterfaceByInterface("connector");
    if (connector) args.push(`${formatInterfaceLabel(connector)}`);
    else args.push(`${this.node.inputs.connector.value}()`);

    return `pynn.Projection(${args.join(", ")})`;
  },
});
