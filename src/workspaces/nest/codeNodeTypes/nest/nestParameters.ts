// nestParameters.ts

import {
  type AbstractCodeNode,
  type CodeNodeInputInterface,
  CodeNodeOutputInterface,
  TextInputInterface,
  createInterface,
  defineDynamicCodeNode,
  getPositionBeforeNode,
  type CodeGraph,
  ListInputInterface,
  NumberInterface,
} from "@babsey/code-graph";

import { BaseParameters } from "@/parameter";
import { IBaseState } from "@/core";

export interface IParamState extends IBaseState {
  component?: string;
  forceUpdate?: boolean;
  hidden?: boolean;
  id: string;
  items?: string[];
  max?: number;
  min?: number;
  type?: string;
  value: unknown;
}

// type TRandomTypes = "uniform" | "normal";

// const randomTypes: Record<TRandomTypes, (graph: CodeGraph | NESTCodeGraph, idx?: number) => AbstractCodeNode> = {
//   uniform: addNESTRandomUniform,
//   normal: addNESTRandomNormal,
// };

export const nestParameters = defineDynamicCodeNode({
  type: "nest/Parameters",
  title: "parameters",
  variableName: "p",
  outputs: {
    out: () => new CodeNodeOutputInterface(),
  },
  codeTemplate() {
    const args: string[] = [];
    Object.keys(this.inputs).forEach((inputKey: string) => {
      if (this.inputs[inputKey]?.hidden) return;
      args.push(`"${inputKey}": {{ inputs.${inputKey} }}`);
    });
    return args.length > 0 ? `{\n\t${args.join(",\n\t")}\n}` : "{}";
  },
  beforeRun() {
    if (!this.code.project) return;

    const params = this.state.props?.components ? new this.state.props.components() : new BaseParameters();
    params.registerCodeNode(this);
    params.init();
  },
  onUnconnected() {
    if (!this.code.project) return;

    this.updateInputInterfaces();
  },
});

export const addNESTParameterNode = (
  graph: CodeGraph,
  position: { x: number; y: number } = { x: 0, y: 0 },
  props: Record<string, IParamState> = {},
): AbstractCodeNode => {
  const codeNode = graph.addNodeAtCoordinates(new nestParameters(), position, props);
  codeNode.state.integrated = true;
  return codeNode;
};

export const createParameterInterface = (param: IParamState): CodeNodeInputInterface => {
  let paramInterface: CodeNodeInputInterface;
  if (param.component) {
    paramInterface = createInterface(param.component, param);
  } else if (Array.isArray(param.value)) {
    paramInterface = new ListInputInterface(param.id, String(param.value));
  } else if (typeof param.value == "number") {
    paramInterface = new NumberInterface(param.id, Number(param.value));
  } else {
    paramInterface = new TextInputInterface(param.id, String(param.value));
  }

  paramInterface.setOptional(true);
  paramInterface.setHidden(param.hidden ?? false);

  return paramInterface;
};

export const createParameterInterfaces = (paramStates: Record<string, IParamState>) => {
  const inputs: Record<string, () => CodeNodeInputInterface> = {};

  if (paramStates) {
    Object.entries(paramStates).forEach(([paramKey, paramState]: [string, IParamState]) => {
      inputs[paramKey] = () => createParameterInterface(paramState);
    });
  }

  return inputs;
};

export const getNESTParameterNode = (
  codeNode: AbstractCodeNode,
  paramInterfaceName: string = "params",
  paramStates: Record<string, IParamState> = {},
): AbstractCodeNode | undefined => {
  const graph = codeNode.code.graph;
  let paramsNode: AbstractCodeNode | null = codeNode.getConnectedNodeByInterface(paramInterfaceName, "inputs");

  if (!paramsNode) {
    const position = getPositionBeforeNode(codeNode);
    paramsNode = addNESTParameterNode(graph, position, paramStates);
  }

  if (!graph.hasConnection(paramsNode.outputs.out, codeNode.inputs[paramInterfaceName]))
    graph.addConnection(paramsNode.outputs.out, codeNode.inputs[paramInterfaceName]);

  return paramsNode;
};

export const updateParameterInterfaces = (
  codeNode: AbstractCodeNode,
  inputKey: string,
  states?: Record<string, IParamState>,
): AbstractCodeNode | undefined => {
  if (codeNode.inputs[inputKey].connectionCount === 0) return;
  const paramsNode = codeNode.getConnectedNodeByInterface(inputKey, "inputs");
  paramsNode.state.integrated = true;
  const paramInterfaces = createParameterInterfaces(states);
  if (states) paramsNode.updateInputInterfaces(paramInterfaces);
  return paramsNode;
};

export const updateNESTParameterNode = (
  codeNode: AbstractCodeNode,
  paramInterfaceName: string = "params",
  paramStates: Record<string, IParamState> = {},
): AbstractCodeNode | undefined => {
  const graph = codeNode.code.graph;
  let paramsNode: AbstractCodeNode | null = codeNode.getConnectedNodeByInterface(paramInterfaceName, "inputs");

  if (Object.keys(paramStates).length === 0 && paramsNode != undefined) {
    graph.removeNode(paramsNode); // paramsNode.remove()
    codeNode.inputs[paramInterfaceName].setHidden(true);
    return;
  } else if (paramStates && !paramsNode) {
    paramsNode = addNESTParameterNode(graph, getPositionBeforeNode(codeNode), paramStates);
  }

  paramsNode.updateInputInterfaces(createParameterInterfaces(paramStates));

  if (!graph.hasConnection(paramsNode.outputs.out, codeNode.inputs[paramInterfaceName]))
    graph.addConnection(paramsNode.outputs.out, codeNode.inputs[paramInterfaceName]);

  return paramsNode;
};
