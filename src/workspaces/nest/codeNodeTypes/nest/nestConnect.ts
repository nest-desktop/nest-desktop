// nestConnect.ts

import { setType } from "@baklavajs/interface-types";

import {
  CodeNodeInputInterface,
  SelectInterface,
  TextInputInterface,
  defineCodeNode,
  getPositionAtColumn,
  type AbstractCodeNode,
  type CodeGraph,
} from "@babsey/code-graph";

import type { INESTConnectionState, INESTSynapseState } from "@/workspaces/nest/types";
import { getNESTModelParameterStates } from "@/workspaces/nest/model";

import {
  // type INESTSynapseCollection,
  nestNodeCollectionType,
} from "./interfaceTypes";
import { type IParamState, updateNESTParameterNode, updateParameterInterfaces } from "./nestParameters";

const ruleItems = [
  "all_to_all",
  "one_to_one",
  "fixed_indegree",
  "fixed_outdegree",
  "fixed_total_number",
  "pairwise_bernoulli",
  "symmetric_pairwise_bernoulli",
];

export const nestConnect = defineCodeNode({
  type: "nest.Connect",
  title: "connect",
  inputs: {
    pre: () => new CodeNodeInputInterface("pre").use(setType, nestNodeCollectionType),
    post: () => new CodeNodeInputInterface("post").use(setType, nestNodeCollectionType),
    conn_spec: () => new SelectInterface("conn_spec", "all_to_all", ruleItems).setOptional(true),
    syn_spec: () => new TextInputInterface("syn_spec", "static_synapse").setOptional(true),
  },
  // onPlaced() {
  //   updateNESTNode(this);
  // },
  afterGraphLoaded() {
    updateNESTNode(this);
  },
  onConnected() {
    if (!this.code.project || !this.mask) return;

    const synParamNode = this.getConnectedNodeByInterface("syn_spec", "input");
    if (synParamNode) {
      this.mask.synapse.params.registerCodeNode(synParamNode);
      updateParameterInterfaces(this, "syn_spec", this.mask.synapse.params.save());
    }
  },
  // optional, add/remove parameter node when select specific rule.
  // update() {
  //   let connSpecNode = this.getConnectedNodeByInterface('conn_spec')
  //   if (['all_to_all', 'one_to_one'].includes(this.inputs.conn_spec.value) || this.inputs.conn_spec.hidden) {
  //     if (connSpecNode) this.graph.removeNode(connSpecNode)
  //   } else {
  //     if (!connSpecNode) {
  //       connSpecNode = new nestParameters()
  //       this.code.addNodeAtCoordinates(connSpecNode, getPositionBeforeNode(this))
  //       this.graph.addConnection(connSpecNode.outputs.out, this.inputs.conn_spec)
  //     }

  //     updateParamState(this, 'conn_spec', getConnSpec(this.inputs.conn_spec))
  //   }
  // },
  // onGraphUpdate() {
  //   let nestConnection = this.view as NESTConnection;
  //   if (!nestConnection) {
  //     const connectionState: Record<string, unknown> = {};

  //     const sourceNode = this.getConnectedNodeByInterface("pre");
  //     if (sourceNode) connectionState.source = sourceNode.view.idx;

  //     const targetNode = this.getConnectedNodeByInterface("post");
  //     if (targetNode) connectionState.target = targetNode.view.idx;

  //     const connSpecNode = this.getConnectedNodeByInterface("conn_spec");
  //     if (connSpecNode) {
  //       const paramState = Object.entries(connSpecNode.inputs).map(([k, v]) => ({ id: k, value: v.value }));
  //       if (paramState.length > 0) connectionState.params = paramState;
  //     }

  //     const synSpecNode = this.getConnectedNodeByInterface("syn_spec");
  //     if (synSpecNode) {
  //       const paramState = Object.entries(synSpecNode.inputs).map(([k, v]) => ({ id: k, value: v.value }));
  //       if (paramState.length > 0) connectionState.synapse = { params: paramState };
  //     }

  //     nestConnection = new NESTConnection(this.code.project.network.connections, connectionState);

  //     this.view = nestConnection;
  //     nestConnection.codeNodes.node = this;

  //     nestConnection.init();
  //   }

  //   const connSpecNode = this.getConnectedNodeByInterface("conn_spec");
  //   if (connSpecNode) {
  //     // cleanNESTParameterNode(connSpecNode, this.view);
  //   } else {
  //     this.inputs.conn_spec.setHidden(true);
  //   }

  //   const synSpecNode = this.getConnectedNodeByInterface("syn_spec");
  //   if (synSpecNode) {
  //     synSpecNode.view = nestConnection.synapse;
  //     cleanNESTParameterNode(synSpecNode, nestConnection);
  //   } else {
  //     this.inputs.syn_spec.setHidden(true);
  //   }

  //   // if (!this.view && !this.view.model && !this.view.model.isRecorder) return;
  //   // updateRecorderNode(this.graph, this.view.recorder.codeNode);
  // },
});

// const getConnSpec = (rule: string) => {
//   const connSpec: Record<string, IParamState> = { rule: { value: rule, items: ruleItems, type: "select" } };

//   switch (rule) {
//     case "fixed_indegree":
//       connSpec["indegree"] = { value: 1, type: "integer", min: 1 };
//       break;
//     case "fixed_outdegree":
//       connSpec["outdegree"] = { value: 1, type: "integer", min: 1 };
//       break;
//     case "fixed_total_number":
//       connSpec["N"] = { value: 1, type: "integer", min: 1 };
//       break;
//     case "pairwise_bernoulli":
//       connSpec["p"] = { value: 0.1, min: 0, max: 1 };
//       break;
//     case "symmetric_pairwise_bernoulli":
//       connSpec["p"] = { value: 0.1, min: 0, max: 1 };
//       break;
//   }

//   return connSpec;
// };

export const addNESTConnectNode = (graph: CodeGraph, idx: number = -1): AbstractCodeNode => {
  if (idx === -1) idx = graph.getNodesByType("nest.Connect").length;
  const codeNode = graph.addNodeAtCoordinates(new nestConnect(), getPositionAtColumn(3, 100 + 200 * idx));
  if (idx === 0) codeNode.state.comments = "Connect nodes";
  return codeNode;
};

export const getNESTConnectNode = (graph: CodeGraph, idx: number = -1): AbstractCodeNode => {
  if (idx === -1) return addNESTConnectNode(graph);
  const codeNodes = graph.getNodesByType("nest.Connect");
  if (idx < codeNodes.length) return codeNodes[idx];
  return addNESTConnectNode(graph);
};

export const loadNESTConnectNode = (
  graph: CodeGraph,
  connectionState: INESTConnectionState,
  nodes: AbstractCodeNode[] = [],
  idx: number = -1,
): AbstractCodeNode => {
  const codeNode = getNESTConnectNode(graph, idx);
  updateNESTConnectNode(codeNode, connectionState);

  if (nodes) {
    const sourceNode = nodes[connectionState.sourceIdx];
    if (sourceNode) graph.addConnection(codeNode.inputs.pre, sourceNode.outputs.out);
    const targetNode = nodes[connectionState.targetIdx];
    if (targetNode) graph.addConnection(targetNode.outputs.out, codeNode.inputs.post);
  }

  return codeNode;
};

export const updateNESTConnectNode = (codeNode: AbstractCodeNode, connectionState: INESTConnectionState): void => {
  if (connectionState) codeNode.state.props = connectionState;

  if (connectionState.params) updateNESTParameterNode(codeNode, "conn_spec", connectionState.params);
  if (connectionState.synapse) updateNESTConnectSynapseNode(codeNode, connectionState.synapse);
};

export const updateNESTConnectSynapseNode = (codeNode: AbstractCodeNode, synapseState: INESTSynapseState): void => {
  if (synapseState) {
    const syn_spec: Record<string, IParamState> = {};
    if (synapseState.model && synapseState.model !== "static_synapse") {
      syn_spec["synapse_model"] = {
        value: synapseState.model,
      } as IParamState;
    }

    const defaultParamStates = getNESTModelParameterStates(synapseState.model ?? "static_synapse");

    let paramStates: Record<string, IParamState>;
    if (synapseState.params) {
      const paramKeys = Object.keys(synapseState.params);

      paramStates = {};
      // all param states
      Object.keys(defaultParamStates).forEach((paramId) => {
        const paramState = synapseState.params[paramId] ?? {};

        paramStates[paramId] = {
          ...defaultParamStates[paramId],
          ...paramState,
          hidden: !paramKeys.includes(paramId),
        };
      });
    } else {
      paramStates = defaultParamStates;
    }

    updateNESTParameterNode(codeNode, "syn_spec", { ...syn_spec, ...paramStates });
  }
};

const updateNESTNode = (codeNode: AbstractCodeNode) => {
  // console.log("after graph loaded", this);
  if (!codeNode.code.project) return;

  let connection = codeNode.mask;

  if (!connection) {
    const source = codeNode.getConnectedNodeByInterface("pre", "input");
    const target = codeNode.getConnectedNodeByInterface("post", "input");

    if (!source || !target) return;

    connection = codeNode.code.project.network.connections.addConnection(codeNode.state.props);
    connection.registerCodeNode(codeNode);

    const connSpecNode = codeNode.getConnectedNodeByInterface("conn_spec", "input");
    connection.params.registerCodeNode(connSpecNode);

    const synSpecNode = codeNode.getConnectedNodeByInterface("syn_spec", "input");
    connection.synapse.params.registerCodeNode(synSpecNode);
  }

  connection.init();
};
