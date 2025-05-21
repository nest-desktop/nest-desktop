// parameters.ts

import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { IntegerInterface, TextInputInterface } from "baklavajs";
import { NESTCodeGraph } from "./codeGraph";
import { IParamProps } from "@/helpers/common/parameter";
import nestParameters from "../codeNodeTypes/nest/nestParameters";

export const addParameterInterface = (paramsNode: AbstractCodeNode, param: IParamProps) => {
  let inputInterface;
  if (typeof param.value == "number") {
    inputInterface = new IntegerInterface(param.id, param.value as number);
  } else {
    inputInterface = new TextInputInterface(param.id, JSON.stringify(param.value));
  }
  paramsNode.addInput(param.id, inputInterface);
};

export const addParameterNode = (
  graph: CodeGraph | NESTCodeGraph,
  params: IParamProps[],
  position: { x: number; y: number } = { x: 0, y: 0 },
): AbstractCodeNode => {
  const paramsNode = graph.addNodeAtCoordinates(nestParameters, position.x, position.y);
  paramsNode.state.integrated = true;
  params
    .filter((param: IParamProps) => ("visible" in param ? param.visible : true))
    .forEach((param: IParamProps) => addParameterInterface(paramsNode, param));
  return paramsNode;
};
