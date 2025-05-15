// nestParameters.ts

import { NodeInterface } from "baklavajs";

import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

import { INESTNodeCollection } from "./interfaceTypes";
import { NESTNode } from "../../node/node";

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
  onGraphUpdate() {
    if (!this.node) return;
    if (!this.networkItem) {
      const nodes = this.node.getConnectedNodes("outputs");
      if (nodes.length === 0 || !nodes[0].networkItem) return;
      this.networkItem = nodes[0].networkItem;
    }
    const node: NESTNode = this.networkItem;

    console.log(this.node.inputs);

    Object.keys(this.node.inputs).forEach((inputKey: string) => {
      if (!node.params[inputKey] || node.params[inputKey].value === this.node.inputs[inputKey].value) return;
      node.params[inputKey].value = this.node.inputs[inputKey].value;
    });
  },
  onProjectUpdate() {
    if (!this.node) return;
    if (!this.networkItem) {
      const nodes = this.node.getConnectedNodes("outputs");
      if (nodes.length === 0 || !nodes[0].networkItem) return;
      this.networkItem = nodes[0].networkItem;
    }
    const node: NESTNode = this.networkItem;

    Object.keys(this.node.inputs).forEach((inputKey: string) => {
      if (!node.params[inputKey] || this.node.inputs[inputKey].value === node.params[inputKey].value) return;
      this.node.inputs[inputKey].value = node.params[inputKey].value;
    });
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
