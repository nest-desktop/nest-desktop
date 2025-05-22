// parameters.ts

import { displayInSidebar, IntegerInterface, setType, TextInputInterface } from "baklavajs";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { IParamProps } from "@/helpers/common/parameter";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import { NESTCodeGraph } from "./codeGraph";
import nestParameters from "../codeNodeTypes/nest/nestParameters";

export const createParameterInterface = (param: IParamProps) => {
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
