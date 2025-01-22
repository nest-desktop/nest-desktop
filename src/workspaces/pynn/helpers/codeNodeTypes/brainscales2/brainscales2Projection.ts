// brainscales2Projection.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { SelectInterface } from "baklavajs";

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

    const presynapticNeurons = this.node.getConnectedOutputInterfaceByInterface("presynaptic_neurons");
    const postsynapticNeurons = this.node.getConnectedOutputInterfaceByInterface("postsynaptic_neurons");
    if (presynapticNeurons.length === 0 || postsynapticNeurons.length === 0) return this.type;

    const args: string[] = [
      `${this.code?.graph.formatInterfaceLabels(presynapticNeurons).join("+")}`,
      `${this.code?.graph.formatInterfaceLabels(postsynapticNeurons).join("+")}`,
    ];

    const connector = this.node.getConnectedOutputInterfaceByInterface("connector");
    if (connector.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(connector).join(", ")}`);
    else args.push(`${this.node.inputs.connector.value}()`);

    return `pynn.Projection(${args.join(", ")})`;
  },
});
