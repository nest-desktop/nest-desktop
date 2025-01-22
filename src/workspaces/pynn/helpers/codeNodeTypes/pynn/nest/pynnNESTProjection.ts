// pynnNESTProjection.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { SelectInterface } from "baklavajs";

export default defineCodeNode({
  type: "pyNN.nest.Projection",
  modules: ["pyNN.nest"],
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
      this.code?.graph.formatInterfaceLabels(presynapticNeurons).join("+") as string,
      this.code?.graph.formatInterfaceLabels(postsynapticNeurons).join("+") as string,
    ];

    args.push(this.node.inputs.connector.value);

    return `pyNN.nest.Projection(${args.join(", ")})`;
  },
});
