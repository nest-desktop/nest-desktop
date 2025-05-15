// norseLinear.ts

import { IntegerInterface, setType } from "baklavajs";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.nn.Linear",
  title: "linear",
  inputs: {
    in_features: () => new IntegerInterface("in features", 1).use(setType, numberType),
    out_features: () => new IntegerInterface("out features", 1).use(setType, numberType),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "lin",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const inFeatures = this.node.getConnectedOutputInterfaceByInterface("in_features");
    if (inFeatures.length > 0)
      args.push(`in_features=${this.code?.graph.formatInterfaceLabels(inFeatures).join(", ")}`);

    const outFeatures = this.node.getConnectedOutputInterfaceByInterface("out_features");
    if (outFeatures.length > 0)
      args.push(`out_features=${this.code?.graph.formatInterfaceLabels(outFeatures).join(", ")}`);

    return `torch.nn.Linear(${args.join(", ")})`;
  },
});
