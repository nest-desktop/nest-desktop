// nestParameters.ts

import {
  type AbstractCodeNode,
  type CodeNodeInputInterface,
  CodeNodeOutputInterface,
  IntegerInterface,
  TextInputInterface,
  createInterface,
  defineDynamicCodeNode,
  getPositionBeforeNode,
  type CodeGraph,
} from "@babsey/code-graph";

import { BaseParameters } from "@/parameter";
import { IBaseState } from "@/core";

export interface IParamState extends IBaseState {
  component?: string;
  forceUpdate?: boolean;
  hidden?: boolean;
  id?: string;
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
  afterGraphLoaded() {
    // console.log("after graph loaded", this);
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

// export const cleanNESTParameterNode = (paramsNode: AbstractCodeNode, nodeView: unknown): void => {
//   if (!nodeView) return;

//   nodeView.codeNodes.params = paramsNode;
//   nodeView.paramsAll.forEach((param) => (param.codeNodes.node = paramsNode));

//   if (!paramsNode.view) paramsNode.view = nodeView;
//   paramsNode.onUpdate();
// };

export const createParameterInterface = (param: IParamState): CodeNodeInputInterface => {
  let paramInterface: CodeNodeInputInterface;
  if (param.component) {
    paramInterface = createInterface(param.component, param);
  } else if (typeof param.value == "number") {
    paramInterface = new IntegerInterface(param.id, param.value);
  } else {
    paramInterface = new TextInputInterface(param.id, param.value);
  }

  paramInterface.setOptional(true);
  paramInterface.setHidden(param.hidden ?? false);

  return paramInterface;
};

export const createParameterInterfaces = (props: Record<string, IParamState>) => {
  const inputs: Record<string, () => CodeNodeInputInterface> = {};

  if (props) {
    Object.entries(props).forEach(([paramKey, paramState]: [string, IParamState]) => {
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

// const onParamNodeUpdate = (codeNode: AbstractCodeNode) => {
//   const inputs: Record<string, () => NodeInterface> = {}

//   if (codeNode.view?.paramsAll) {
//     const params = codeNode.view.paramsAll as TParameter[]
//     const paramVisible = codeNode.state.props ? codeNode.state.props?.map((prop) => prop.id) : []

//     params.forEach((param: TParameter) => {
//       const paramJSON = param.save()
//       const paramState = codeNode.state.props?.find((paramState: IParamState) => paramState.id == param.id)
//       if (paramState) paramJSON.value = paramState.value
//       paramJSON.hidden = !paramVisible.includes(param.id)
//       inputs[param.id] = () => createParameterInterface(paramJSON)
//     })
//   }
//   return inputs
// }

export const updateParameterInterfaces = (
  codeNode: AbstractCodeNode,
  inputKey: string,
  states?: Record<string, IParamState>,
): AbstractCodeNode | undefined => {
  if (codeNode.inputs[inputKey].connectionCount === 0) return;
  const paramsNode = codeNode.getConnectedNodeByInterface(inputKey, "input");
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

  if (!paramStates) {
    if (paramsNode) graph.removeNode(paramsNode); // paramsNode.remove()
    return;
  } else if (!paramsNode) {
    paramsNode = addNESTParameterNode(graph, getPositionBeforeNode(codeNode), paramStates);
  }

  paramsNode.updateInputInterfaces(createParameterInterfaces(paramStates), Object.keys(paramStates));

  if (!graph.hasConnection(paramsNode.outputs.out, codeNode.inputs[paramInterfaceName]))
    graph.addConnection(paramsNode.outputs.out, codeNode.inputs[paramInterfaceName]);

  return paramsNode;
};
