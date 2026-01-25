// nestDataResponse.ts

import { allowMultipleConnections } from "@baklavajs/engine";

import {
  AbstractCodeNode,
  CodeNodeInputInterface,
  defineCodeNode,
  getPositionAtColumn,
  type CodeGraph,
} from "@babsey/code-graph";
import { isRecorderNode } from "./nestCreate";

export const nestDataResponse = defineCodeNode({
  type: "nest/response",
  title: "nest data response",
  inputs: {
    events: () => new CodeNodeInputInterface<string[]>("events", []).use(allowMultipleConnections),
    positions: () =>
      new CodeNodeInputInterface<string[]>("positions", []).setOptional(true).use(allowMultipleConnections),
  },
  codeTemplate() {
    const responseData: string[] = [];

    Object.keys(this.codeNodeInputs).forEach((inputKey: string) => {
      if (this.codeNodeInputs[inputKey]?.hidden || this.codeNodeInputs[inputKey].connectionCount === 0) return;
      responseData.push(`"${inputKey}": {{ inputs.${inputKey} }}`);
    });

    return "response = " + (responseData.length === 0 ? "{}" : `{\n\t${responseData.join(",\n\t")}\n}`);
  },
  beforeRun() {
    const codeNodes = this.getConnectedNodesByInterface("events", "inputs");
    codeNodes.forEach((codeNode: AbstractCodeNode) => {
      if (!isRecorderNode(codeNode)) unconnectToResponseNode(codeNode, "events");
    });
  },
});

export const addNESTDataResponseNode = (graph: CodeGraph): AbstractCodeNode => {
  return graph.addNodeAtCoordinates(new nestDataResponse(), getPositionAtColumn(4, 900));
};

export const getNESTDataResponseNode = (graph: CodeGraph): AbstractCodeNode => {
  const codeNode = graph.findNodeByType("nest/response");
  if (!codeNode) return addNESTDataResponseNode(graph);
  return codeNode;
};

export const loadNESTDataResponseNode = (graph: CodeGraph): void => {
  const codeNodes = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Create");
  codeNodes
    .filter(
      (codeNode: AbstractCodeNode) =>
        codeNode.inputs.model.value.includes("recorder") || codeNode.inputs.model.value.includes("meter"),
    )
    .forEach((codeNode: AbstractCodeNode) => connectToResponseNode(codeNode, "events"));

  // const spatialNodes = codeNodes.filter((node: AbstractCodeNode) => !node.inputs.positions.hidden);
  // let funcNode = graph.findNodeByType("function");
  // if (spatialNodes.length === 0 && funcNode) {
  //   funcNode.remove();
  // } else if (spatialNodes.length > 0 && !funcNode) {
  //   funcNode = graph.addNodeAtCoordinates(functionNode, getPositionAtColumn(3, 900));
  //   funcNode.inputs.code.value = "pos = lambda n: dict(zip(n.global_id, nest.GetPosition(n)))";
  //   graph.addConnection(funcNode.outputs._node, responseNode.inputs._node);
  // }

  // responseNode.inputs.positions.setHidden(spatialNodes.length === 0);
  // if (spatialNodes.length > 0 && responseNode.inputs.positions)
  //   spatialNodes.forEach((spatialNode: AbstractCodeNode) => {
  //     graph.addConnection(spatialNode.outputs.positions, responseNode.inputs.positions);
  //   });
};

export const connectToResponseNode = (codeNode: AbstractCodeNode, intfKey: string) => {
  if (!isRecorderNode(codeNode)) return;

  const graph = codeNode.graph;
  const responseNode = getNESTDataResponseNode(graph);
  graph.addConnection(codeNode.outputs[intfKey], responseNode.inputs[intfKey]);
};

export const unconnectToResponseNode = (codeNode: AbstractCodeNode, intfKey: string) => {
  if (!isRecorderNode(codeNode)) return;

  const connection = codeNode.getConnectedNodeByInterface(codeNode.outputs[intfKey]);
  codeNode.graph.removeConnection(connection);
};
