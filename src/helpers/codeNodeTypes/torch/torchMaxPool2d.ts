// torchMaxPool2d.ts

import { displayInSidebar, IntegerInterface, setType } from "baklavajs";

import { ITorchTensor, torchTensorType } from "./interfaceTypes";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";
import { numberType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

export default defineCodeNode({
  type: "torch.nn.MaxPool2d",
  title: "max pool (2D)",
  inputs: {
    kernel_size: () => new IntegerInterface("kernel size", 1).use(setType, numberType).use(displayInSidebar, true),
    stride: () => new IntegerInterface("stride", 1).use(setType, numberType).use(displayInSidebar, true),
    padding: () =>
      new IntegerInterface("padding", 0).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    dilation: () =>
      new IntegerInterface("dilation", 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface<ITorchTensor>().use(setType, torchTensorType),
  },
  variableName: "maxPool",
  codeTemplate() {
    if (!this.node) return this.type;
    const args: string[] = [];

    const kernelSize = this.node.getConnectedOutputInterfaceByInterface("kernel_size");
    if (kernelSize.length > 1)
      args.push(`kernel_size=(${this.code?.graph.formatInterfaceLabels(kernelSize).join(", ")})`);
    else if (kernelSize.length > 0)
      args.push(`kernel_size=${this.code?.graph.formatInterfaceLabels(kernelSize).join(", ")}`);

    const stride = this.node.getConnectedOutputInterfaceByInterface("stride");
    if (stride.length > 1) args.push(`stride=(${this.code?.graph.formatInterfaceLabels(stride).join(", ")})`);
    else if (stride.length > 0) args.push(`stride=${this.code?.graph.formatInterfaceLabels(stride).join(", ")}`);

    const padding = this.node.getConnectedOutputInterfaceByInterface("padding");
    if (padding.length > 1) args.push(`padding=(${this.code?.graph.formatInterfaceLabels(padding).join(", ")})`);
    else if (padding.length > 0) args.push(`padding=${this.code?.graph.formatInterfaceLabels(padding).join(", ")}`);

    const dilation = this.node.getConnectedOutputInterfaceByInterface("dilation");
    if (dilation.length > 1) args.push(`dilation=(${this.code?.graph.formatInterfaceLabels(dilation).join(", ")})`);
    else if (dilation.length > 0) args.push(`dilation=${this.code?.graph.formatInterfaceLabels(dilation).join(", ")}`);

    return `torch.nn.MaxPool2d(${args.join(", ")})`;
  },
});
