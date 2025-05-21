// nodes.ts

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { INodeGroupProps } from "@/helpers/node/nodeGroup";

import nestCreate from "../codeNodeTypes/nest/nestCreate";
import nestRandomUniform from "../codeNodeTypes/nest/nestRandomUniform";
import nestSpatialFree from "../codeNodeTypes/nest/nestSpatialFree";
import { INESTCopyModelProps } from "../model/copyModel";
import { INESTNodeProps } from "../node/node";
import { NESTCodeGraph } from "./codeGraph";
import _function from "@/helpers/codeNodeTypes/base/function";
import { copyModel } from "./model";
import { addParameterNode } from "./parameters";
import { IParamProps } from "@/helpers/common/parameter";

export const createNode = (
  graph: CodeGraph | NESTCodeGraph,
  nodeProps: INESTNodeProps,
  idx: number = 0,
): AbstractCodeNode => {
  // nest.Create
  const codeNode = graph.addNodeAtColumn(nestCreate, 3, 100 + 290 * idx);
  if (idx === 0) codeNode.state.comments = "Create nodes";
  // codeNode.variableName = nodeProps.model as string;
  codeNode.inputs.model.value = nodeProps.model;
  codeNode.inputs.size.value = nodeProps.size ?? 1;
  codeNode.inputs.size.hidden = nodeProps.size ? nodeProps.size === 1 : true;
  if (nodeProps.model === "weight_recorder") {
    codeNode.variableName = "wr";
    // weightRecorders.push(codeNode);
  }

  // params
  const params = nodeProps.params?.filter((param: IParamProps) => ("visible" in param ? param.visible : true));
  if (params && params.length > 0) {
    const position = { ...codeNode.position };
    position.x -= 400;
    const paramsNode = addParameterNode(graph, params, position);
    graph.addConnection(paramsNode.outputs.out, codeNode.inputs.params);
  }

  // positions
  if (nodeProps.spatial) {
    const randNode = graph.addNodeAtColumn(nestRandomUniform, 1, 900);
    randNode.state.integrated = true;
    randNode.inputs.min.value = -0.5;
    randNode.inputs.max.value = 0.5;
    const posNode = graph.addNodeAtColumn(nestSpatialFree, 2, 900);
    posNode.state.integrated = true;
    graph.addConnection(randNode.outputs.out, posNode.inputs.pos);

    if (!graph.nodes.find((node: AbstractCodeNode) => node.type === "function")) {
      const funcNode = graph.addNodeAtColumn(_function, 5, 900);
      funcNode.inputs.code.hidden = false;
      funcNode.inputs.code.value = "pos = lambda n: dict(zip(n.global_id, nest.GetPosition(n)))";
    }

    graph.addConnection(posNode.outputs.out, codeNode.inputs.positions);
    codeNode.events.update.emit({
      type: "input",
      intf: codeNode.inputs.positions,
      name: "positions",
    });
    // spatialNodes.push(codeNode);
  }

  return codeNode;
};

export const copyNodeModels = (
  graph: CodeGraph | NESTCodeGraph,
  modelsProps: INESTCopyModelProps[],
): AbstractCodeNode[] => {
  if (!modelsProps || modelsProps.length === 0) return [];

  const nodes: AbstractCodeNode[] = [];

  // Copy node model
  modelsProps
    .filter((modelProps: INESTCopyModelProps) => !modelProps.existing.includes("synapse"))
    .forEach((modelProps: INESTCopyModelProps, idx: number) => {
      const codeNode: AbstractCodeNode = copyModel(graph, modelProps as INESTCopyModelProps, idx);
      nodes.push(codeNode);
    });

  return nodes;
};

export const createNodes = (
  graph: CodeGraph | NESTCodeGraph,
  nodesProps?: (INESTNodeProps | INodeGroupProps)[],
): Record<string, AbstractCodeNode[]> => {
  if (!nodesProps || nodesProps.length === 0) return {};

  const nodes: AbstractCodeNode[] = [];
  const spatialNodes: AbstractCodeNode[] = [];
  const weightRecorders: AbstractCodeNode[] = [];

  nodesProps.forEach((nodeProps: INESTNodeProps | INodeGroupProps, idx: number) => {
    const codeNode: AbstractCodeNode = createNode(graph, nodeProps as INESTNodeProps, idx);
    nodes.push(codeNode);
  });

  return { all: nodes, spatial: spatialNodes, weightRecorders };
};
