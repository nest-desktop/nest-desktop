// nestCreate.ts

import { displayInSidebar } from "@baklavajs/renderer-vue";
import { setType } from "@baklavajs/interface-types";

import {
  CodeNodeInputInterface,
  CodeNodeOutputInterface,
  IntegerInterface,
  TextInputInterface,
  defineCodeNode,
  getPositionAtColumn,
  type AbstractCodeNode,
  type CodeGraph,
} from "@babsey/code-graph";

import type { INESTNodeState } from "@/workspaces/nest/types";
import { getNESTModelParameterStates } from "@/workspaces/nest/model";

import { nestNodeCollectionType } from "./interfaceTypes";
import { type IParamState, updateNESTParameterNode, updateParameterInterfaces } from "./nestParameters";

export const nestCreate = defineCodeNode({
  type: "nest.Create",
  title: "create",
  variableName: "n",
  inputs: {
    model: () => new TextInputInterface("model", "iaf_psc_alpha"),
    size: () => new IntegerInterface("size", 1, 1).setOptional(true),
    params: () => new CodeNodeInputInterface("params", "{}").setOptional(true),
    positions: () => new CodeNodeInputInterface("positions").setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, nestNodeCollectionType),
    events: () => new CodeNodeOutputInterface("events", ".events").use(displayInSidebar, true).setOptional(true),
    positions: () =>
      new CodeNodeOutputInterface("positions", ".positions").use(displayInSidebar, true).setOptional(true),
  },
  onPlaced() {
    if (this.graph.loading || !this.code.project) return;
    updateNESTNode(this);
  },
  afterGraphLoaded() {
    if (!this.code.project) return;
    updateNESTNode(this);
  },
  onConnected() {
    if (!this.code.project) return;

    const paramsNode = this.getConnectedNodeByInterface("params", "input");

    if (paramsNode) {
      let paramStates: Record<string, IParamState>;
      if (this.mask) {
        this.mask.params.registerCodeNode(paramsNode);
        paramStates = this.mask.params.save();
      } else {
        paramStates = getNESTModelParameterStates(this.inputs.model.value);
      }
      updateParameterInterfaces(this, "params", paramStates);
    }
  },
  // update() {
  //   let nestNode: NESTNode | undefined = this.view as NESTNode;
  //   if (!nestNode) {
  //     const idx = this.indexOfNodeType;
  //     nestNode = new NESTNode(this.code?.project.networks, {
  //       view: { position: { x: 150 * idx, y: 0 + 50 * (idx % 2) } },
  //     });

  //     this.view = nestNode;
  //     nestNode.codeNodes.node = this;

  //     nestNode.init();
  //   }

  //   const paramsNode = this.getConnectedNodeByInterface("params", "inputs");
  //   if (paramsNode) {
  //     cleanNESTParameterNode(paramsNode, nestNode);
  //   } else {
  //     this.inputs.params.setHidden(true);
  //   }

  //   const spatialNode = this.getConnectedNodeByInterface("positions", "inputs");
  //   nestNode.codeNodes.spatial = spatialNode;
  //   nestNode.spatial.codeNodes = spatialNode;

  //   if (spatialNode) {
  //     if (!spatialNode.view) spatialNode.view = nestNode.spatial;
  //     spatialNode.onCodeUpdate();
  //   } else {
  //     this.inputs.positions.setHidden(true);
  //   }
  // },
});

export const addNESTCreateNode = (graph: CodeGraph, idx: number = -1): AbstractCodeNode => {
  if (idx === -1) idx = graph.getNodesByType("nest.Create").length;
  const codeNode = graph.addNodeAtCoordinates(new nestCreate(), getPositionAtColumn(1, 100 + 290 * idx));
  if (idx === 0) codeNode.state.comments = "Create nodes";
  return codeNode;
};

export const getNESTCreateNode = (graph: CodeGraph, idx: number = -1): AbstractCodeNode => {
  if (idx === -1) return addNESTCreateNode(graph);
  const codeNodes = graph.getNodesByType("nest.Create");
  if (idx < codeNodes.length) return codeNodes[idx];
  return addNESTCreateNode(graph);
};

export const loadNESTCreateNode = (graph: CodeGraph, nodeState: INESTNodeState, idx: number = -1): AbstractCodeNode => {
  const codeNode = getNESTCreateNode(graph, idx);
  updateNESTCreateNode(codeNode, nodeState);

  return codeNode;
};

// export const updateRecorderNode = (graph: CodeGraph | NESTCodeGraph, codeNode: AbstractCodeNode) => {
//   if (!codeNode.outputs.events || !codeNode.view) return;

//   const responseNode = getNESTDataResponseNode(graph);

//   const isRecorder = codeNode.view.model.isRecorder;
//   const hasConnection = codeNode.code.graph.hasConnection(codeNode.outputs.events, responseNode.inputs.events);

//   if (!isRecorder && hasConnection) {
//     graph.connections
//       .filter(
//         (connection: Connection) =>
//           connection.from.id === codeNode.outputs.events.id || connection.to.id === codeNode.outputs.events.id,
//       )
//       .forEach((connection: Connection) => graph.removeConnection(connection));
//   } else if (isRecorder && !hasConnection) graph.addConnection(codeNode.outputs.events, responseNode.inputs.events);
// };

// export const updateNESTNode = (codeNode: AbstractCodeNode) => {
//     let nestNode: NESTNode | undefined = codeNode.view as NESTNode;
//     if (!nestNode) {
//       const idx = codeNode.indexOfNodeType;
//       nestNode = new NESTNode(codeNode.code?.project.networks, {
//         view: { position: { x: 150 * idx, y: 0 + 50 * (idx % 2) } },
//       });

//       codeNode.view = nestNode;
//       nestNode.codeNodes.node = codeNode;

//       nestNode.init();
//     }

//     const paramsNode = codeNode.getConnectedNodeByInterface("params", "inputs");
//     if (paramsNode) {
//       cleanNESTParameterNode(paramsNode, nestNode);
//     } else {
//       codeNode.inputs.params.setHidden(true);
//     }

//     const spatialNode = codeNode.getConnectedNodeByInterface("positions", "inputs");
//     nestNode.codeNodes.spatial = spatialNode;
//     nestNode.spatial.codeNodes = spatialNode;

//     if (spatialNode) {
//       if (!spatialNode.view) spatialNode.view = nestNode.spatial;
//       spatialNode.onCodeUpdate();
//     } else {
//       codeNode.inputs.positions.setHidden(true);
//     }
//   },
// }

export const updateNESTCreateNode = (codeNode: AbstractCodeNode, nodeState: INESTNodeState): void => {
  codeNode.state.props = nodeState;
  if (codeNode.mask) codeNode.mask.view.load(nodeState.view);

  const codeNodeState: Record<string, unknown> = { model: nodeState.model };
  if (nodeState.size) codeNodeState.size = nodeState.size;
  codeNode.updateInputValues(codeNodeState);

  const defaultParamStates = getNESTModelParameterStates(nodeState.model);

  let paramStates: Record<string, IParamState>;
  if (nodeState.params) {
    const paramKeys = Object.keys(nodeState.params);

    paramStates = {};
    // all param states
    Object.keys(defaultParamStates).forEach((paramId) => {
      const paramState = nodeState.params[paramId] ?? {};

      paramStates[paramId] = {
        ...defaultParamStates[paramId],
        ...paramState,
        hidden: !paramKeys.includes(paramId),
      };
    });
  } else {
    paramStates = defaultParamStates;
  }

  updateNESTParameterNode(codeNode, "params", paramStates);
};

const updateNESTNode = (codeNode: AbstractCodeNode) => {
  if (!codeNode.code.project) return;
  let node = codeNode.mask;

  if (!node) {
    node = codeNode.code.project.network.nodes.addNode({
      model: codeNode.inputs.model.value,
    });
    node.registerCodeNode(codeNode);
  }

  const paramsNode = codeNode.getConnectedNodeByInterface("params", "input");
  if (paramsNode) node.params.registerCodeNode(paramsNode);

  const spatialNode = codeNode.getConnectedNodeByInterface("spatial", "input");
  if (spatialNode) node.spatial.registerCodeNode(spatialNode);

  if (codeNode.state.props?.view) node.view.load(codeNode.state.props.view);

  node.init();
};

// export const updateNESTSpatialNode = (
//   graph: CodeGraph | NESTCodeGraph,
//   codeNode: AbstractCodeNode,
//   spatialState?: INESTNodeSpatialState,
// ) => {
//   if (!codeNode.view) return;

//   let randNode: AbstractCodeNode | null;
//   let spatialNode: AbstractCodeNode | null = codeNode.getConnectedNodeByInterface("positions");

//   if (spatialNode && !spatialState) {
//     randNode = spatialNode.getConnectedNodeByInterface("pos");
//     if (randNode) randNode.remove();
//     delete spatialNode.view.codeNodes.node;
//     spatialNode.remove();
//   } else if (!spatialNode) {
//     spatialNode = loadNESTSpatialFree(graph, graph.nodeIds.indexOf(codeNode.id));
//     graph.addConnection(spatialNode.outputs.out, codeNode.inputs.positions);

//     const randNode = loadNESTRandomUniform(graph, { min: -0.5, max: 0.5 }, graph.nodeIds.indexOf(spatialNode.id));
//     graph.addConnection(randNode.outputs.out, spatialNode.inputs.pos);
//   }

//   codeNode.onUpdate(); // add/remove positions interface in outputs

//   // spatialNode.updateValues(spatialState);
//   nextTick(() => loadNESTDataResponseNode(graph));
// };
