// nestParameters.ts

import { displayInSidebar, IntegerInterface, NodeInterface, setType, TextInputInterface } from "baklavajs";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { IParamProps } from "@/helpers/common/parameter";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import nestParameters from "./nestParameters";
import { INESTNodeCollection } from "./interfaceTypes";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

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
      if (nodes.length < 1 || !nodes[0].networkItem) return;
      this.node.networkItem = nodes[0].networkItem;
    }

    const params = this.node.networkItem?.params;
    if (params)
      Object.keys(this.node.inputs).forEach((key: string) => {
        if (!params[key] || !params[key].value || !this.node || params[key].value === this.node.inputs[key].value)
          return;
        params[key].value = this.node.inputs[key].value;
      });
  },
  onProjectUpdate() {
    if (!this.node) return;

    if (!this.node.networkItem) {
      const nodes = this.node.getConnectedNodes("outputs");
      if (nodes.length < 1 || !nodes[0].networkItem) return;
      this.node.networkItem = nodes[0].networkItem;
    }

    const params = this.node.networkItem?.params;
    if (params)
      Object.keys(this.node.inputs).forEach((key: string) => {
        if (!this.node || !params[key] || !params[key].value || this.node.inputs[key].value === params[key].value)
          return;
        this.node.inputs[key].value = params[key].value;
      });
  },
  onUpdate() {
    if (!this.node?.networkItem) return {};
    const inputs: Record<string, () => NodeInterface> = {};

    const params = this.node.networkItem?.params;
    if (params)
      Object.values(params).forEach((param) => {
        const inputKeys = Object.keys(this.node.inputs);
        if (!inputKeys.includes(param.id)) inputs[param.id] = () => createParameterInterface(param.toJSON());
      });

    return { inputs };
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

export const addParameterNode = (
  graph: CodeGraph | NESTCodeGraph,
  params: IParamProps[],
  position: { x: number; y: number } = { x: 0, y: 0 },
): AbstractCodeNode => {
  const paramsNode = graph.addNodeAtCoordinates(nestParameters, position.x, position.y);
  paramsNode.state.integrated = true;

  params.forEach((param: IParamProps) => {
    const paramInterface = createParameterInterface(param);
    paramsNode.addInput(param.id, paramInterface);
  });

  return paramsNode;
};

export const createParameterInterface = (param: IParamProps): NodeInterface => {
  let paramInterface;
  if (typeof param.value == "number") {
    paramInterface = new IntegerInterface(param.id, param.value as number).use(setType, numberType);
  } else {
    paramInterface = new TextInputInterface(param.id, JSON.stringify(param.value)).use(setType, stringType);
  }
  paramInterface.use(displayInSidebar, true);
  paramInterface.setHidden(param.visible ? !param.visible : false);
  return paramInterface;
};
