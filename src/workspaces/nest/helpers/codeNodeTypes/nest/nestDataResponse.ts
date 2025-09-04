// nestDataResponse.ts

import { displayInSidebar } from "baklavajs";

import functionNode from "@/helpers/codeNodeTypes/base/function";
import { AbstractCodeNode, formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";
import { CodeGraph, findNodeByType } from "@/helpers/codeGraph/codeGraph";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

import nestDataResponse from "./nestDataResponse";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import { getNESTSimulateNode } from "./nestSimulate";

export default defineCodeNode({
  type: "nest/response",
  title: "nest data response",
  inputs: {
    events: () => new NodeInputInterface("events"),
    positions: () => new NodeInputInterface("positions").use(displayInSidebar, true).setHidden(true),
  },
  codeTemplate() {
    if (!this.node) return "";
    const responseData = [];

    const events = this.node.getConnectedOutputInterfacesByInterface("events");
    if (events.length > 0) responseData.push(`"events": [${formatInterfaceLabels(events).join(", ")}]`);

    const positions = this.node.getConnectedNodesByInterface("positions");
    const getPositions = positions.map((pos) => `pos(${pos.label})`);
    // if (getPositions.length === 1) responseData.push(`"positions": ${getPositions.join(", ")}`);
    if (getPositions.length > 0) responseData.push(`"positions": {${getPositions.map((p) => "**" + p).join(", ")}}`);

    if (responseData.length === 0) return "response = {}";
    return `response = {\n\t${responseData.join(",\n\t")}\n}`;
  },
});

export const addNESTDataResponseNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  return graph.addNodeAtColumn(nestDataResponse, 4, 900);
};

export const getNESTDataResponseNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
  const codeNode = findNodeByType(graph, "nest/response");
  if (!codeNode) return addNESTDataResponseNode(graph);
  return codeNode;
};

export const loadNESTDataResponseNode = (graph: CodeGraph | NESTCodeGraph): void => {
  const responseNode = getNESTDataResponseNode(graph);

  const codeNodes = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Create");
  codeNodes.forEach((codeNode: AbstractCodeNode) => {
    if (!codeNode.inputs.model.value.includes("recorder") && !codeNode.inputs.model.value.includes("meter")) return;
    graph.addConnection(codeNode.outputs.events, responseNode.inputs.events);
  });

  const spatialNodes = codeNodes.filter((node: AbstractCodeNode) => !node.inputs.positions.hidden);
  let funcNode = graph.findNodeByType("function");
  if (spatialNodes.length === 0 && funcNode) {
    funcNode.remove();
  } else if (spatialNodes.length > 0 && !funcNode) {
    funcNode = graph.addNodeAtColumn(functionNode, 3, 900);
    funcNode.inputs.code.value = "pos = lambda n: dict(zip(n.global_id, nest.GetPosition(n)))";
    graph.addConnection(funcNode.outputs._node, responseNode.inputs._node);
  }

  responseNode.inputs.positions.setHidden(spatialNodes.length === 0);
  if (spatialNodes.length > 0 && responseNode.inputs.positions)
    spatialNodes.forEach((spatialNode: AbstractCodeNode) =>
      graph.addConnection(spatialNode.outputs.positions, responseNode.inputs.positions),
    );

  const simulateNode = getNESTSimulateNode(graph);
  if (!graph.hasConnection(simulateNode.outputs._node, responseNode.inputs._node))
    graph.addConnection(simulateNode.outputs._node, responseNode.inputs._node);
};
