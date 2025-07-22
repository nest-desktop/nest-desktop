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
        // param.codeNodes.node = this.node as AbstractCodeNode;
        const paramJSON = param.toJSON() as IParam;
        paramJSON.hidden = !paramVisible.includes(paramView.id);
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

export const addParameterNode = (
  graph: CodeGraph | NESTCodeGraph,
  paramProps: IParamProps[] = [],
  position: { x: number; y: number } = { x: 0, y: 0 },
): AbstractCodeNode => {
  const paramsNode = graph.addNodeAtCoordinates(nestParameters, position, paramProps);
  paramsNode.state.integrated = true;
  paramsNode.state.props = paramProps;

  paramProps.forEach((paramProp: IParamProps) => {
    const paramInterface = createParameterInterface(paramProp);
    paramsNode.addInput(paramProp.id, paramInterface);
  });

  return paramsNode;
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
