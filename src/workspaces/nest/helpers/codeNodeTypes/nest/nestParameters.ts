// nestParameters.ts

import { NodeInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

import { INESTNodeCollection } from "./interfaceTypes";

export default defineDynamicCodeNode({
  type: "nest/Parameters",
  title: "parameters",
  variableName: "p",
  outputs: {
    out: () => new NodeOutputInterface<INESTNodeCollection>(),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const params: string[] = [];

    if (this.node.inputs)
      Object.entries(this.node.inputs).forEach((input: [string, NodeInterface]) => {
        const paramValues = this.node.getConnectedOutputInterfaceByInterface(input[0]);
        if (paramValues.length > 0)
          params.push(`"${input[0]}": ${this.code?.graph.formatInterfaceLabels(paramValues).join(", ")}`);
        else if (!input[1].hidden) params.push(`"${input[0]}": ${input[1].value}`);
      });

    if (params.length > 0) return `{\n\t${params.join(",\n\t")}\n}`;
    else return "";
  },
  onPlaced() {
    if (!this.code) return;
    this.networkItem = this.code.project.network.nodes.nodeItems[this.indexOfNodeType];
    if (!this.networkItem) return;
    this.networkItem.codeNode = this;
  },
  onUpdate() {
    if (!this.node) return {};

    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    // const params = this.node.toJSON;

    // const node = this.node.getConnectedNodesByInterface("out");

    // if (node) {
    //   if (params)
    //     Object.values(params).forEach((param: IParamProps) => {
    //       inputs[param.id] = () =>
    //         new TextInputInterface(param.id, param.value as string).use(displayInSidebar, true).setHidden(false);
    //     });
    // }

    return { inputs, outputs };
  },
  toJSON() {
    if (!this.node) return {};
    const props: Record<string, unknown> = {};

    if (this.node.inputs)
      Object.entries(this.node.inputs).forEach((input: [string, NodeInterface]) => {
        const paramValues = this.node.getConnectedOutputInterfaceByInterface(input[0]);
        if (paramValues.length > 0) props[input[0]] = this.code?.graph.formatInterfaceLabels(paramValues).join(", ");
        else if (!input[1].hidden) props[input[0]] = input[1].value;
      });

    return props;
  },
});
