// nestDataResponse.ts

import { allowMultipleConnections } from "@baklavajs/engine";

import { CodeNodeInputInterface, defineCodeNode } from "@babsey/code-graph";

// import functionNode from '@babsey/code-graph/codeNodeTypes/default/function'

// import nestDataResponse from './nestDataResponse'
// import { NESTCodeGraph } from '../../codeGraph/codeGraph'
// import { getNESTSimulateNode } from './nestSimulate'

export const nestDataResponse = defineCodeNode({
  type: "nest/response",
  title: "nest data response",
  inputs: {
    events: () => new CodeNodeInputInterface("events", "[]").use(allowMultipleConnections),
    positions: () => new CodeNodeInputInterface("positions", "[]").use(allowMultipleConnections).setOptional(true),
  },
  codeTemplate() {
    const responseData: string[] = [];

    Object.keys(this.codeNodeInputs).forEach((inputKey: string) => {
      if (this.codeNodeInputs[inputKey]?.hidden || this.codeNodeInputs[inputKey].connectionCount === 0) return;
      responseData.push(`"${inputKey}": [{{ inputs.${inputKey} }}]`);
    });

    return "response = " + (responseData.length === 0 ? "{}" : `{\n\t${responseData.join(",\n\t")}\n}`);
  },
});

// export const addNESTDataResponseNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
//   return graph.addNodeAtCoordinates(nestDataResponse, getPositionAtColumn(4, 900));
// };

// export const getNESTDataResponseNode = (graph: CodeGraph | NESTCodeGraph): AbstractCodeNode => {
//   const codeNode = graph.findNodeByType("nest/response");
//   if (!codeNode) return addNESTDataResponseNode(graph);
//   return codeNode;
// };

// export const loadNESTDataResponseNode = (graph: CodeGraph | NESTCodeGraph): void => {
//   const responseNode = getNESTDataResponseNode(graph);

//   const codeNodes = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Create");
//   codeNodes.forEach((codeNode: AbstractCodeNode) => {
//     if (!codeNode.inputs.model.value.includes("recorder") && !codeNode.inputs.model.value.includes("meter")) return;
//     graph.addConnection(codeNode.outputs.events, responseNode.inputs.events);
//   });

//   const spatialNodes = codeNodes.filter((node: AbstractCodeNode) => !node.inputs.positions.hidden);
//   let funcNode = graph.findNodeByType("function");
//   if (spatialNodes.length === 0 && funcNode) {
//     funcNode.remove();
//   } else if (spatialNodes.length > 0 && !funcNode) {
//     funcNode = graph.addNodeAtCoordinates(functionNode, getPositionAtColumn(3, 900));
//     funcNode.inputs.code.value = "pos = lambda n: dict(zip(n.global_id, nest.GetPosition(n)))";
//     graph.addConnection(funcNode.outputs._node, responseNode.inputs._node);
//   }

//   responseNode.inputs.positions.setHidden(spatialNodes.length === 0);
//   if (spatialNodes.length > 0 && responseNode.inputs.positions)
//     spatialNodes.forEach((spatialNode: AbstractCodeNode) => {
//       graph.addConnection(spatialNode.outputs.positions, responseNode.inputs.positions);
//     });

//   const simulateNode = getNESTSimulateNode(graph);
//   if (!graph.hasConnection(simulateNode.outputs._node, responseNode.inputs._node))
//     graph.addConnection(simulateNode.outputs._node, responseNode.inputs._node);
// };
