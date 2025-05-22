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

    if (params.length === 0) return "{}";
    return `{\n\t${params.join(",\n\t")}\n}`;
  },
  onGraphUpdate() {
    if (!this.node) return;
    if (!this.node.networkItem) {
      const nodes = this.node.getConnectedNodes("outputs");
      if (nodes.length === 0 || !nodes[0].networkItem) return;
      this.node.networkItem = nodes[0].networkItem;
    }
    const node: NESTNode = this.node.networkItem as NESTNode;

    Object.keys(this.node.inputs).forEach((key: string) => {
      if (
        !node.params[key] ||
        !node.params[key].value ||
        !this.node ||
        !this.node.inputs ||
        !this.node.inputs[key] ||
        !this.node.inputs[key].value ||
        node.params[key].value === this.node.inputs[key].value
      )
        return;
      node.params[key].value = this.node.inputs[key].value;
    });
  },
  onProjectUpdate() {
    if (!this.node) return;
    if (!this.node.networkItem) {
      const nodes = this.node.getConnectedNodes("outputs");
      if (nodes.length === 0 || !nodes[0].networkItem) return;
      this.node.networkItem = nodes[0].networkItem;
    }
    const node: NESTNode = this.node.networkItem as NESTNode;

    Object.keys(this.node.inputs).forEach((key: string) => {
      if (
        !node.params[key] ||
        !node.params[key].value ||
        !this.node ||
        !this.node.inputs ||
        !this.node.inputs[key] ||
        !this.node.inputs[key].value ||
        this.node.inputs[key].value === node.params[key].value
      )
        return;
      this.node.inputs[key].value = node.params[key].value;
    });
  },
  onUpdate() {
    return {};
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
