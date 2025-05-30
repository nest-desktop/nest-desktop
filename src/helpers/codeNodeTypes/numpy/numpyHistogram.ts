// numpyHistogram.ts

import { IntegerInterface, setType } from "baklavajs";

import { arrayType, INumpyArray } from "./interfaceTypes";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.histogram",
  title: "histogram",
  inputs: {
    x: () => new NodeInputInterface<INumpyArray>("x").use(setType, arrayType),
    bins: () => new IntegerInterface("bins", 10),
  },
  outputs: {
    hist: () => new NodeOutputInterface<INumpyArray>("hist", "[0]").use(setType, arrayType),
    bin_edges: () => new NodeOutputInterface<INumpyArray>("bin_edges", "[1]").use(setType, arrayType),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const x = this.node.getConnectedOutputInterfacesByInterface("x");
    if (x.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(x).join("+")}`);

    const bins = this.node.getConnectedOutputInterfacesByInterface("bins");
    if (bins.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(bins).join(", ")}`);
    else args.push(`${this.node.inputs.bins.value}`);

    return `np.histogram(${args.join(", ")})`;
  },
  variableName: "hist",
});
