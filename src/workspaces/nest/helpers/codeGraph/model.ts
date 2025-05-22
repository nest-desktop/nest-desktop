// model.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";

import nestCopyModel from "../codeNodeTypes/nest/nestCopyModel";
import { INESTCopyModelProps } from "../model/copyModel";
import { NESTCodeGraph } from "./codeGraph";
import { addParameterNode } from "./parameters";
import { IParamProps } from "@/helpers/common/parameter";

export const copyModel = (
  graph: CodeGraph | NESTCodeGraph,
  modelProps: INESTCopyModelProps,
  idx: number = 0,
): AbstractCodeNode => {
  const codeNode = graph.addNodeAtColumn(nestCopyModel, 0 - 1, 100 + 250 * idx);
  codeNode.inputs.existing.value = modelProps.existing;
  codeNode.inputs.new.value = modelProps.new;

  // params
  const params = modelProps.params?.filter((param: IParamProps) => ("visible" in param ? param.visible : true));
  if (params && params.length > 0) {
    const position = { ...codeNode.position };
    position.x -= 400;
    position.y += 100;
    const paramsNode = addParameterNode(graph, params, position);
    graph.addConnection(paramsNode.outputs.out, codeNode.inputs.params);
  }

  return codeNode;
};
