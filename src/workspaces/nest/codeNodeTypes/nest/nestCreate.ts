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

import type { ICodeMaskParamState } from "@/codeGraph";
import type { INESTNodeState } from "@/workspaces/nest/types";
import { getNESTModelParameterStates } from "@/workspaces/nest/model";

import type { INESTNodeSpatialState } from "../../network/node/nodeSpatial";
import { loadNESTSpatialFree } from "./nestSpatialFree";
import { nestNodeCollectionType } from "./interfaceTypes";
import { updateNESTParameterNode, updateParameterInterfaces } from "./nestParameters";
import { loadNESTRandomUniform } from "./nestRandomUniform";
import { loadNESTSpatialGrid } from "./nestSpatialGrid";
import { connectToResponseNode } from "./nestDataResponse";

export const nestCreate = defineCodeNode({
  type: "nest.Create",
  title: "create",
  variableName: "n",
  inputs: {
    model: () => new TextInputInterface("model", "iaf_psc_alpha"),
    size: () => new IntegerInterface("size", 1, 1).setOptional(true),
    params: () => new CodeNodeInputInterface("params").setOptional(true),
    positions: () => new CodeNodeInputInterface("positions").setOptional(true),
  },
  outputs: {
    out: () => new CodeNodeOutputInterface().use(setType, nestNodeCollectionType),
    events: () => new CodeNodeOutputInterface("events", ".events").use(displayInSidebar, true).setOptional(true),
    positions: () =>
      new CodeNodeOutputInterface("positions", ".positions").use(displayInSidebar, true).setOptional(true),
  },
  beforeRun() {
    if (!this.code || !this.code.project) return;
    updateNodeMask(this);

    // Connect recorder events to response node.
    if (isRecorderNode(this)) {
      const responseNode = this.getConnectedNodeByInterface("events", "outputs");
      if (!responseNode) connectToResponseNode(this, "events");
    }
  },
  onConnected() {
    if (!this.code || !this.code.project) return;

    const paramsNode = this.getConnectedNodeByInterface("params", "inputs");
    if (paramsNode) {
      let paramStates: Record<string, ICodeMaskParamState>;
      if (this.mask) {
        this.mask.params.registerCodeNode(paramsNode);
        paramStates = this.mask.params.save();
      } else {
        paramStates = getNESTModelParameterStates(this.inputs.model.value);
      }
      updateParameterInterfaces(this, "params", paramStates);
    }

    // if (isRecorderNode(this)) connectToResponseNode(this, "events");
  },
  onUnconnected() {
    const paramsNode = this.getConnectedNodeByInterface("params", "inputs");
    if (!paramsNode) this.inputs.params.setHidden(true);
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

export const isRecorderNode = (codeNode: AbstractCodeNode) =>
  codeNode.inputs.model &&
  (codeNode.inputs.model.value.includes("recorder") || codeNode.inputs.model.value.includes("meter"));

export const loadNESTCreateNode = (graph: CodeGraph, nodeState: INESTNodeState, idx: number = -1): AbstractCodeNode => {
  const codeNode = getNESTCreateNode(graph, idx);

  // Update node params
  updateNESTCreateNode(codeNode, nodeState);

  // Update spatial node.
  if (nodeState.spatial) updateNESTSpatialNode(graph, codeNode, nodeState.spatial);

  return codeNode;
};

const loadNESTSpatial = (
  graph: CodeGraph,
  codeNode: AbstractCodeNode,
  spatialNode: AbstractCodeNode,
  spatialState: INESTNodeSpatialState = {},
) => {
  if (spatialState.positions === "free") {
    spatialNode = loadNESTSpatialFree(graph, spatialState, graph.nodeIds.indexOf(codeNode.id));
    const randNode = loadNESTRandomUniform(graph, { min: -0.5, max: 0.5 }, graph.nodeIds.indexOf(spatialNode.id));
    graph.addConnection(randNode.outputs.out, spatialNode.inputs.pos);
  } else {
    spatialNode = loadNESTSpatialGrid(graph, spatialState, graph.nodeIds.indexOf(codeNode.id));
  }
  graph.addConnection(spatialNode.outputs.out, codeNode.inputs.positions);
  return spatialNode;
};

const removeNESTSpatial = (spatialNode: AbstractCodeNode) => {
  const randNode: AbstractCodeNode | null = spatialNode.getConnectedNodeByInterface("pos", "inputs");
  if (randNode) randNode.remove();
  spatialNode.remove();
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

export const updateNESTCreateNode = (codeNode: AbstractCodeNode, nodeState: INESTNodeState): void => {
  codeNode.state.props = nodeState;
  if (codeNode.mask) codeNode.mask.view.load(nodeState.view);
  codeNode.updateInputValues(nodeState);

  // Load params
  const defaultParamStates = getNESTModelParameterStates(nodeState.model);
  let paramStates: Record<string, ICodeMaskParamState>;
  if (nodeState.params) {
    const paramKeys = Object.keys(nodeState.params);
    if (paramKeys.length === 0) return;

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

    updateNESTParameterNode(codeNode, "params", paramStates);
  }
};

const updateNodeMask = (codeNode: AbstractCodeNode) => {
  if (!codeNode.code || !codeNode.code.project) return;
  let node = codeNode.mask;

  if (!node) {
    node = codeNode.code.project.network.nodes.newNode();
    node.registerCodeNode(codeNode);
  }

  const modelId = codeNode.inputs.model.value;
  if (node.modelId !== modelId) node.loadModel(modelId);

  // params node
  const paramsNode = codeNode.getConnectedNodeByInterface("params", "inputs");
  if (paramsNode) {
    node.params.registerCodeNode(paramsNode);
    // } else {
    //   codeNode.inputs.params.setHidden(true);
  }

  // spatial node
  const spatialNode = codeNode.getConnectedNodeByInterface("positions", "inputs");
  if (spatialNode) {
    const positions = node.spatial.newPositions(codeNode.state.props.spatial.positions);
    if (positions) {
      positions.registerCodeNode(spatialNode);
      positions?.load(codeNode.state.props.specs);
    }
  } else {
    codeNode.inputs.positions.setHidden(true);
  }

  if (codeNode.state.props?.view) node.view.load(codeNode.state.props.view);

  node.init();
};

export const updateNESTSpatialNode = (
  graph: CodeGraph,
  codeNode: AbstractCodeNode,
  spatialState: INESTNodeSpatialState = {},
) => {
  let spatialNode: AbstractCodeNode | null = codeNode.getConnectedNodeByInterface("positions", "inputs");

  if (spatialNode && Object.keys(spatialState).length === 0) {
    removeNESTSpatial(spatialNode);
  } else if (spatialNode && !spatialNode.type.includes(spatialState.positions)) {
    removeNESTSpatial(spatialNode);
    spatialNode = loadNESTSpatial(graph, codeNode, spatialNode, spatialState);
  } else if (!spatialNode) {
    spatialNode = loadNESTSpatial(graph, codeNode, spatialNode, spatialState);
  }
  return spatialNode;
};
