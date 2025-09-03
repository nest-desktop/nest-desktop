// nestParameters.ts

import { displayInSidebar, IntegerInterface, NodeInterface, setType, TextInputInterface } from "baklavajs";

import { AbstractCodeNode, formatInterfaceLabel, formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { IParamProps } from "@/helpers/common/parameter";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { TParameter } from "@/types";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import nestParameters from "./nestParameters";
import { INESTNodeCollection } from "./interfaceTypes";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";

interface IParam extends IParamProps {
  hidden?: boolean;
}

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
      Object.keys(this.node.inputs).forEach((key: string) => {
        if (!this.node) return;
        const paramInterface = this.node.inputs[key];
        if (paramInterface.hidden) return;
        const outputInterface = this.node.getConnectedOutputInterfaceByInterface(key);
        if (outputInterface != undefined) params.push(`"${key}": ${formatInterfaceLabel(outputInterface)}`);
        else params.push(`"${key}": ${paramInterface.value}`);
      });

    if (params.length === 0) return "{}";
    return `{\n\t${params.join(",\n\t")}\n}`;
  },
  onUpdate() {
    if (!this.node) return {};
    const inputs: Record<string, () => NodeInterface> = {};

    if (this.node.view?.paramsAll) {
      const params = this.node.view.paramsAll as TParameter[];
      const paramVisible = this.node.state.props ? this.node.state.props?.map((prop) => prop.id) : [];

      params.forEach((param: TParameter) => {
        const paramJSON = param.toJSON() as IParam;
        paramJSON.hidden = !paramVisible.includes(param.id);
        inputs[param.id] = () => createParameterInterface(paramJSON);
      });
    }

    return { inputs };
  },
  toJSON() {
    if (!this.node) return {};
    const props: Record<string, unknown> = {};

    if (this.node && this.node.inputs)
      Object.entries(this.node.inputs).forEach((input: [string, NodeInterface]) => {
        const paramValues = this.node.getConnectedOutputInterfacesByInterface(input[0]);
        if (paramValues.length > 0) props[input[0]] = formatInterfaceLabels(paramValues).join(", ");
        else if (!input[1].hidden) props[input[0]] = input[1].value;
      });

    return props;
  },
});

export const addNESTParameterNode = (
  graph: CodeGraph | NESTCodeGraph,
  position: { x: number; y: number } = { x: 0, y: 0 },
  idx: number = -1,
): AbstractCodeNode => {
  const codeNode = graph.addNodeAtCoordinates(nestParameters, position, idx);
  codeNode.state.integrated = true;
  return codeNode;
};

export const createParameterInterface = (param: IParam): NodeInterface => {
  let paramInterface;
  if (typeof param.value == "number") {
    paramInterface = new IntegerInterface(param.id, param.value as number).use(setType, numberType);
  } else {
    paramInterface = new TextInputInterface(param.id, JSON.stringify(param.value)).use(setType, stringType);
  }

  paramInterface.use(displayInSidebar, true);
  paramInterface.setHidden(param.hidden ?? false);

  return paramInterface;
};

export const loadNESTParameterNode = (
  graph: CodeGraph | NESTCodeGraph,
  paramProps: IParamProps[] = [],
  position: { x: number; y: number } = { x: 0, y: 0 },
  idx: number = -1,
): AbstractCodeNode => {
  const paramsNode = addNESTParameterNode(graph, position, idx);
  paramsNode.state.props = paramProps;

  paramProps.forEach((paramProp: IParamProps) => {
    const paramInterface = createParameterInterface(paramProp);
    paramsNode.addInput(paramProp.id, paramInterface);
  });

  return paramsNode;
};

export const updateNESTParameterNode = (
  graph: CodeGraph | NESTCodeGraph,
  codeNode: AbstractCodeNode,
  paramsProps: IParamProps[] = [],
): AbstractCodeNode | undefined => {
  let paramsNode: AbstractCodeNode | null = codeNode.getConnectedNodeByInterface("params");

  if (paramsProps && paramsProps.length === 0) {
    if (paramsNode) paramsNode.remove();
    return;
  }

  if (!paramsNode) {
    const position = { ...codeNode.position };
    position.x -= 400;
    position.y += 50;
    const idx = graph.nodes.indexOf(codeNode);
    paramsNode = loadNESTParameterNode(graph, paramsProps, position, idx);
  }
  paramsNode.state.props = paramsProps;

  if (codeNode.view?.codeNodes) codeNode.view.codeNodes.params = paramsNode;
  graph.addConnection(paramsNode.outputs.out, codeNode.inputs.params);

  return paramsNode;
};
