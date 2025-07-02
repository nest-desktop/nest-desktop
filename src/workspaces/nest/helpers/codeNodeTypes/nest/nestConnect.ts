// nestConnect.ts

import {
  displayInSidebar,
  NodeInterface,
  NumberInterface,
  SelectInterface,
  setType,
  TextInputInterface,
} from "baklavajs";
import { nextTick } from "vue";

import { AbstractCodeNode, formatInterfaceLabel, formatInterfaceLabels } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { IParamProps } from "@/helpers/common/parameter";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

import nestConnect from "./nestConnect";
import { INESTConnectionProps, NESTConnection } from "../../connection/connection";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import { addParameterNode } from "./nestParameters";

import {
  INESTNodeCollection,
  // INESTSynapseCollection,
  nestNodeCollectionType,
  // nestSynapseCollectionType,
} from "./interfaceTypes";
import { NESTNode } from "../../node/node";

export default defineDynamicCodeNode({
  type: "nest.Connect",
  title: "connect nodes",
  inputs: {
    pre: () => new NodeInputInterface<INESTNodeCollection>("pre").use(setType, nestNodeCollectionType),
    post: () => new NodeInputInterface<INESTNodeCollection>("post").use(setType, nestNodeCollectionType),
    conn_spec: () =>
      new SelectInterface("conn_spec", "all_to_all", [
        "all_to_all",
        "one_to_one",
        "fixed_indegree",
        "fixed_outdegree",
        "pairwise_bernoulli",
      ])
        .use(displayInSidebar, true)
        .setHidden(true),
    syn_spec: () => new TextInputInterface("syn_spec", "static_synapse").use(displayInSidebar, true).setHidden(true),
  },
  codeTemplate() {
    if (!this.node) return this.type;
    const pre = this.node.getConnectedOutputInterfacesByInterface("pre");
    const post = this.node.getConnectedOutputInterfacesByInterface("post");
    if (pre.length === 0 || post.length === 0) return this.type;
    const args = [formatInterfaceLabels(pre).join("+"), formatInterfaceLabels(post).join("+")];
    let keyword = "";

    const connSpecs = [];
    let connSpec = "";

    if (this.node.inputs.p && !this.node.inputs.p.hidden) connSpecs.push(`"p": ${this.node.inputs.p.value}`);
    if (this.node.inputs.indegree && !this.node.inputs.indegree.hidden)
      connSpecs.push(`"indegree": ${this.node.inputs.indegree.value}`);
    if (this.node.inputs.outdegree && !this.node.inputs.outdegree.hidden)
      connSpecs.push(`"outdegree": ${this.node.inputs.outdegree.value}`);

    if (this.node.inputs.conn_spec && !this.node.inputs.conn_spec.hidden)
      if (connSpecs.length === 0) connSpec = `"${this.node.inputs.conn_spec.value}"`;
      else connSpecs.unshift(`"rule": "${this.node.inputs.conn_spec.value}"`);

    if (connSpec.length === 0 && connSpecs.length > 0) connSpec = `{\n\t${connSpecs.join(",\n\t")}\n}`;
    if (connSpec.length > 0) args.push(`${connSpec}`);

    let synSpec = "";
    if (!this.node.inputs.syn_spec.hidden) {
      const synSpecNode = this.node.getConnectedOutputInterfaceByInterface("syn_spec");
      if (synSpecNode != undefined) synSpec = `${formatInterfaceLabel(synSpecNode)}`;
      else synSpec = `"${this.node.inputs.syn_spec.value}"`;
    }
    if (args.length === 2) keyword = "syn_spec=";
    if (synSpec.length > 0) args.push(`${keyword}${synSpec}`);

    return `nest.Connect(${args.join(", ")})`;
  },
  onGraphUpdate() {
    if (!this.node || !this.node.networkItem) return;

    let node: AbstractCodeNode | null = null;
    const sourceNodes = this.node.getConnectedNodesByInterface("pre");
    if (sourceNodes) node = sourceNodes[0];

    const targetNodes = this.node.getConnectedNodesByInterface("post");
    if (targetNodes) node = targetNodes[0];

    if (!node) return;

    const nestNode = node.networkItem as NESTNode;
    if (nestNode.model?.isRecorder && this.node.networkItem) {
      nestNode.network.project.activities.init();
      nestNode.network.project.activityGraph.init();
    }
  },
  onPlaced() {
    // console.log("on placed");

    if (!this.node || !this.node.code || !this.node.code.project.network) return;
    const nodeItems = this.code.project.network.nodes.nodeItems;
    this.node.networkItem = nodeItems[this.indexOfNodeType];
    if (this.node.networkItem) return;

    nextTick(() => {
      if (!this.node) return;

      const connectionProps: Record<string, unknown> = {};

      const sourceNode = this.node.getConnectedNodeByInterface("pre");
      if (sourceNode) connectionProps.source = sourceNode.indexOfNodeType;

      const targetNode = this.node.getConnectedNodeByInterface("post");
      if (targetNode) connectionProps.target = targetNode.indexOfNodeType;

      const synParamNode = this.node.getConnectedNodeByInterface("syn_spec");
      if (synParamNode) {
        const paramProps = Object.entries(synParamNode.inputs).map(([k, v]) => ({ id: k, value: v.value }));
        if (paramProps.length > 0) connectionProps.synapse = { params: paramProps };
      }

      this.node.networkItem = this.node.code.project.network.connections.addConnection(connectionProps);
      this.node.networkItem.init();
      this.node.networkItem.codeNodes.connection = this;

      if (synParamNode) {
        this.node.networkItem.codeNodes.param = synParamNode;
        synParamNode.networkItem = this.node.networkItem.synapse;
      }

      this.node.networkItem.onUpdate({ preventSimulation: true });
    });
  },

  onProjectUpdate() {
    if (!this.node || !this.node.networkItem) return;
    const connection: NESTConnection = this.node.networkItem as NESTConnection;

    let synSpecNode = this.node.getConnectedNodeByInterface("syn_spec");
    if (!synSpecNode && connection.synapse?.paramsVisible.length > 0) {
      const position = { ...this.node.position };
      position.x -= 400;
      position.y += 75;
      synSpecNode = addParameterNode(this.code.graph, [], position);
      this.code.graph.addConnection(synSpecNode.outputs.out, this.node.inputs.syn_spec);
    } else if (synSpecNode && connection.synapse?.paramsVisible.length === 0) {
      synSpecNode?.remove();
      this.node.inputs.syn_spec.setHidden(true);
    }

    if (synSpecNode) {
      synSpecNode.networkItem = connection.synapse;
      synSpecNode.onUpdate();
      synSpecNode.onProjectUpdate();
    }
  },
  onUpdate({ conn_spec }) {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    switch (conn_spec) {
      case "pairwise_bernoulli":
        inputs.p = () => new NumberInterface("p", 0.1, 0.01, 1).use(displayInSidebar, true);
        break;
      case "fixed_indegree":
        inputs.indegree = () => new NumberInterface("indegree", 1).use(displayInSidebar, true);
        break;
      case "fixed_outdegree":
        inputs.outdegree = () => new NumberInterface("outdegree", 1).use(displayInSidebar, true);
        break;
    }

    // inputs.weight = () => new NumberInterface("weight", 1).use(displayInSidebar, true).setHidden(true);
    // inputs.delay = () => new NumberInterface("delay", 0.1, 0.01, 0.1).use(displayInSidebar, true).setHidden(true);

    return { inputs, outputs };
  },
});

export const connectNodes = (
  graph: CodeGraph | NESTCodeGraph,
  connectionsProps?: INESTConnectionProps[],
  nodes: AbstractCodeNode[] = [],
): AbstractCodeNode[] => {
  if (!connectionsProps || connectionsProps.length === 0) return [];
  let codeNode: AbstractCodeNode;
  const codeNodes: AbstractCodeNode[] = [];

  connectionsProps.forEach((connectionProps: INESTConnectionProps, idx: number) => {
    // nest.Connect
    codeNode = graph.addNodeAtColumn(nestConnect, 3, 100 + 200 * idx, connectionProps);
    codeNode.state.props = connectionProps;

    if (idx === 0) codeNode.state.comments = "Connect nodes";

    if (connectionProps.params) {
      const params = connectionProps.params.filter((param: IParamProps) => ("visible" in param ? param.visible : true));

      if (params && params.length > 0) {
        const position = { ...codeNode.position };
        position.x -= 400;
        position.y += 75;
        const paramsNode = addParameterNode(graph, params, position);
        graph.addConnection(paramsNode.outputs.out, codeNode.inputs.conn_spec);
      }
    }

    if (connectionProps.synapse) {
      const syn_spec: IParamProps[] = [];
      if (connectionProps.synapse.model && connectionProps.synapse.model !== "static_synapse") {
        syn_spec.push({
          id: "synapse_model",
          value: connectionProps.synapse.model,
        });
      }

      // params
      const synParams = connectionProps.synapse.params?.filter((param: IParamProps) =>
        "visible" in param ? param.visible : true,
      );
      if (synParams && synParams.length > 0)
        synParams.forEach((param: IParamProps) => {
          syn_spec.push(param);
        });

      if (syn_spec.length > 0) {
        const position = { ...codeNode.position };
        position.x -= 400;
        position.y += 75;
        const paramsNode = addParameterNode(graph, syn_spec, position);
        graph.addConnection(paramsNode.outputs.out, codeNode.inputs.syn_spec);
      }
    }

    if (nodes) {
      graph.addConnection(codeNode.inputs.pre, nodes[connectionProps.source].outputs.out);
      graph.addConnection(nodes[connectionProps.target].outputs.out, codeNode.inputs.post);
    }

    codeNodes.push(codeNode);
  });

  return codeNodes;
};
