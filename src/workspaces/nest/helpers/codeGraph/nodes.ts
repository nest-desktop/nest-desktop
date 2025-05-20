// nodes.ts

import { IntegerInterface, NumberInterface, TextInputInterface } from "baklavajs";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { INodeGroupProps } from "@/helpers/node/nodeGroup";

import nestCopyModel from "../codeNodeTypes/nest/nestCopyModel";
import nestCreate from "../codeNodeTypes/nest/nestCreate";
import nestParameters from "../codeNodeTypes/nest/nestParameters";
import nestRandomUniform from "../codeNodeTypes/nest/nestRandomUniform";
import nestSpatialFree from "../codeNodeTypes/nest/nestSpatialFree";
import { INESTCopyModelProps } from "../model/copyModel";
import { INESTNodeProps } from "../node/node";
import { NESTCodeGraph } from "./codeGraph";
import _function from "@/helpers/codeNodeTypes/base/function";

export const copyNodeModels = (graph: CodeGraph | NESTCodeGraph, modelsProps?: INESTCopyModelProps[]): void => {
  if (!modelsProps || modelsProps.length === 0) return;
  let codeNode: AbstractCodeNode;

  // Copy node model
  modelsProps
    .filter((modelProps: INESTCopyModelProps) => !modelProps.existing.includes("synapse"))
    .forEach((modelProps: INESTCopyModelProps) => {
      // nest.CopyModel
      codeNode = graph.addNodeAtColumn(nestCopyModel, 1, 100);
      // codeNode.state.role = "network";
      codeNode.inputs.existing.value = modelProps.existing;
      codeNode.inputs.new.value = modelProps.new;
      modelProps.params?.forEach((param) => {
        const inputInterface = new NumberInterface(param.id, param.value as number);
        codeNode.addInput(param.id, inputInterface);
      });
    });
};

export const createNode = (
  graph: CodeGraph | NESTCodeGraph,
  nodeProps: INESTNodeProps,
  idx: number = 0,
): AbstractCodeNode => {
  // params
  let paramsNode: AbstractCodeNode;
  if (nodeProps.params && nodeProps.params.length > 0) {
    paramsNode = graph.addNodeAtColumn(nestParameters, 1, 100 + 260 * idx);
    // paramsNode.state.role = "network";
    paramsNode.state.integrated = true;

    nodeProps.params.forEach((param) => {
      let inputInterface;
      if (typeof param.value == "number") {
        inputInterface = new IntegerInterface(param.id, param.value as number);
      } else {
        inputInterface = new TextInputInterface(param.id, JSON.stringify(param.value));
      }
      paramsNode.addInput(param.id, inputInterface);
    });
  }

  // positions
  let posNode: AbstractCodeNode;
  if (nodeProps.spatial) {
    const randNode = graph.addNodeAtColumn(nestRandomUniform, 0, 900);
    // randNode.state.role = "network";
    randNode.state.integrated = true;
    randNode.inputs.min.value = -0.5;
    randNode.inputs.max.value = 0.5;
    posNode = graph.addNodeAtColumn(nestSpatialFree, 1, 900);
    // posNode.state.role = "network";
    posNode.state.integrated = true;
    graph.addConnection(randNode.outputs.out, posNode.inputs.pos);

    if (!graph.nodes.find((node: AbstractCodeNode) => node.type === "function")) {
      const funcNode = graph.addNodeAtColumn(_function, 3, 900);
      funcNode.inputs.code.hidden = false;
      funcNode.inputs.code.value = "pos = lambda n: dict(zip(n.global_id, nest.GetPosition(n)))";
    }
  }

  // nest.Create
  const codeNode = graph.addNodeAtColumn(nestCreate, 2, 100 + 290 * idx);
  // codeNode.state.role = "network";
  if (idx === 0) codeNode.state.comments = "Create nodes";
  // codeNode.variableName = nodeProps.model as string;
  codeNode.inputs.model.value = nodeProps.model;
  codeNode.inputs.size.value = nodeProps.size ?? 1;
  codeNode.inputs.size.hidden = nodeProps.size ? nodeProps.size === 1 : true;
  if (nodeProps.model === "weight_recorder") {
    codeNode.variableName = "wr";
    // weightRecorders.push(codeNode);
  }

  if (paramsNode) graph.addConnection(paramsNode.outputs.out, codeNode.inputs.params);

  if (posNode) {
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

export const createNodes = (
  graph: CodeGraph | NESTCodeGraph,
  nodesProps?: (INESTNodeProps | INodeGroupProps)[],
): Record<string, AbstractCodeNode[]> => {
  const nodes: AbstractCodeNode[] = [];
  const spatialNodes: AbstractCodeNode[] = [];
  const weightRecorders: AbstractCodeNode[] = [];

  if (!nodesProps || nodesProps.length === 0) return {};

  nodesProps.forEach((nodeProps: INESTNodeProps | INodeGroupProps, idx: number) => {
    const codeNode: AbstractCodeNode = createNode(graph, nodeProps as INESTNodeProps, idx);

    // nodeProps = nodeProps as INESTNodeProps;

    // // params
    // if (nodeProps.params && nodeProps.params.length > 0) {
    //   paramsNode = graph.addNodeAtColumn(nestParameters, 1, 100 + 260 * idx);
    //   paramsNode.state.role = "network";
    //   paramsNode.state.integrated = true;

    //   nodeProps.params.forEach((param) => {
    //     let inputInterface;
    //     if (typeof param.value == "number") {
    //       inputInterface = new IntegerInterface(param.id, param.value as number);
    //     } else {
    //       inputInterface = new TextInputInterface(param.id, JSON.stringify(param.value));
    //     }
    //     paramsNode.addInput(param.id, inputInterface);
    //   });
    // }

    // // positions
    // let posNode: AbstractCodeNode;
    // if (nodeProps.spatial) {
    //   const randNode = graph.addNodeAtColumn(nestRandomUniform, 0, 900);
    //   randNode.state.role = "network";
    //   randNode.state.integrated = true;
    //   randNode.inputs.min.value = -0.5;
    //   randNode.inputs.max.value = 0.5;
    //   posNode = graph.addNodeAtColumn(nestSpatialFree, 1, 900);
    //   posNode.state.role = "network";
    //   posNode.state.integrated = true;
    //   graph.addConnection(randNode.outputs.out, posNode.inputs.pos);
    // }

    // // nest.Create
    // codeNode = graph.addNodeAtColumn(nestCreate, 2, 100 + 290 * idx);
    // codeNode.state.role = "network";
    // if (idx === 0) codeNode.state.comments = "Create nodes";
    // // codeNode.variableName = nodeProps.model as string;
    // codeNode.inputs.model.value = nodeProps.model;
    // codeNode.inputs.size.value = nodeProps.size ?? 1;
    // codeNode.inputs.size.hidden = nodeProps.size ? nodeProps.size === 1 : true;
    // if (nodeProps.model === "weight_recorder") {
    //   codeNode.variableName = "wr";
    //   weightRecorders.push(codeNode);
    // }

    // if (paramsNode) graph.addConnection(paramsNode.outputs.out, codeNode.inputs.params);

    // if (posNode) {
    //   graph.addConnection(posNode.outputs.out, codeNode.inputs.positions);
    //   codeNode.events.update.emit({
    //     type: "input",
    //     intf: codeNode.inputs.positions,
    //     name: "positions",
    //   });
    //   spatialNodes.push(codeNode);
    // }

    nodes.push(codeNode);
  });

  return { all: nodes, spatial: spatialNodes, weightRecorders };
};
