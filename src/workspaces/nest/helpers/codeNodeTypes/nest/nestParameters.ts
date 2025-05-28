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
import { TParameter } from "@/types";
import { CodeNodeInterface } from "@/helpers/codeGraph/interface/codeNodeInterface";

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
        const outputInterfaces = this.node.getConnectedOutputInterfacesByInterface(key);
        const paramInterfaces = this.node.inputs[key];
        if (outputInterfaces.length > 0)
          params.push(`"${key}": ${this.code?.graph.formatInterfaceLabels(outputInterfaces).join(", ")}`);
        else if (!paramInterfaces.hidden) params.push(`"${key}": ${paramInterfaces.value}`);
      });

    if (params.length === 0) return "{}";
    return `{\n\t${params.join(",\n\t")}\n}`;
  },
  onGraphUpdate() {
    if (!this.node) return;

    if (this.node.networkItem?.params) {
      const params = this.node.networkItem?.params;
      Object.keys(this.node.inputs).forEach((key: string) => {
        if (!params[key] || !this.node) return;
        const paramInterface = this.node.inputs[key] as CodeNodeInterface;
        const param = params[key];
        if (param.value != paramInterface.value) param.value = paramInterface.value;
        if (param.visible == paramInterface.hidden) param.visible = !paramInterface.hidden;
      });
    }
  },
  onProjectUpdate() {
    if (!this.node) return;

    if (this.node.networkItem?.params) {
      const params = this.node.networkItem?.params;
      Object.keys(this.node.inputs).forEach((key: string) => {
        if (!this.node || !params[key]) return;
        const paramInterface = this.node.inputs[key];
        const param = params[key];
        if (paramInterface.value != param.value) paramInterface.value = param.value;
        if (paramInterface.hidden == param.visible) paramInterface.setHidden(!param.isVisible);
      });
    }
  },
  onUpdate() {
    if (!this.node) return {};
    const inputs: Record<string, () => NodeInterface> = {};

    if (this.node?.networkItem && this.node.networkItem?.params) {
      const params = this.node.networkItem?.params as TParameter[];
      const paramVisible = this.node.state.props ? this.node.state.props?.map((prop) => prop.id) : [];

      Object.values(params).forEach((param: TParameter) => {
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

    if (this.node.inputs)
      Object.entries(this.node.inputs).forEach((input: [string, NodeInterface]) => {
        const paramValues = this.node.getConnectedOutputInterfacesByInterface(input[0]);
        if (paramValues.length > 0) props[input[0]] = this.code?.graph.formatInterfaceLabels(paramValues).join(", ");
        else if (!input[1].hidden) props[input[0]] = input[1].value;
      });

    return props;
  },
});

export const addParameterNode = (
  graph: CodeGraph | NESTCodeGraph,
  params: IParamProps[] = [],
  position: { x: number; y: number } = { x: 0, y: 0 },
): AbstractCodeNode => {
  const paramsNode = graph.addNodeAtCoordinates(nestParameters, position, params);
  paramsNode.state.integrated = true;

  params.forEach((param: IParamProps) => {
    const paramInterface = createParameterInterface(param);
    paramsNode.addInput(param.id, paramInterface);
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
