// nestConnect.ts

import {
  displayInSidebar,
  NodeInterface,
  NumberInterface,
  SelectInterface,
  setType,
  TextInputInterface,
} from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";

import {
  INESTNodeCollection,
  // INESTSynapseCollection,
  nestNodeCollectionType,
  // nestSynapseCollectionType,
} from "./interfaceTypes";
import { nextTick } from "vue";

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
    const pre = this.node.getConnectedOutputInterfaceByInterface("pre");
    const post = this.node.getConnectedOutputInterfaceByInterface("post");
    if (pre.length === 0 || post.length === 0) return this.type;
    const args = [
      this.code?.graph.formatInterfaceLabels(pre).join("+"),
      this.code?.graph.formatInterfaceLabels(post).join("+"),
    ];
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

    const synSpecs = [];
    let synSpec = "";

    if (this.node.inputs.weight && !this.node.inputs.weight.hidden)
      synSpecs.push(`"weight": ${this.node.inputs.weight.value}`);
    if (this.node.inputs.delay && !this.node.inputs.delay.hidden)
      synSpecs.push(`"delay": ${this.node.inputs.delay.value}`);

    if (!this.node.inputs.syn_spec.hidden)
      if (synSpecs.length === 0) synSpec = `"${this.node.inputs.syn_spec.value}"`;
      else synSpecs.unshift(`"synapse_model": "${this.node.inputs.syn_spec.value}"`);

    if (synSpec.length === 0 && synSpecs.length > 0) synSpec = `{\n\t${synSpecs.join(",\n\t")}\n}`;

    if (args.length === 2) keyword = "syn_spec=";
    if (synSpec.length > 0) args.push(`${keyword}${synSpec}`);

    return `nest.Connect(${args.join(", ")})`;
  },
  onGraphUpdate() {
    if (!this.node && !this.networkItem) return;

    let node;
    const sourceNodes = this.node.getConnectedNodesByInterface("pre");
    if (sourceNodes) node = sourceNodes[0];

    const targetNodes = this.node.getConnectedNodesByInterface("post");
    if (targetNodes) node = targetNodes[0];

    if (node?.networkItem?.model?.isRecorder) {
      this.networkItem.network.project.activities.init();
      this.networkItem.network.project.activityGraph.init();
    }
  },
  onPlaced() {
    if (!this.node.code || !this.node.code.project.network) return;
    const nodeItems = this.code.project.network.nodes.nodeItems;
    this.networkItem = nodeItems[this.indexOfNodeType];
    if (this.networkItem) return;

    nextTick(() => {
      if (!this.node) return;

      const connectionProps: Record<string, unknown> = {};

      const sourceNodes = this.node.getConnectedNodesByInterface("pre");
      if (sourceNodes) connectionProps.source = sourceNodes[0].indexOfNodeType;

      const targetNodes = this.node.getConnectedNodesByInterface("post");
      if (targetNodes) connectionProps.target = targetNodes[0].indexOfNodeType;

      this.networkItem = this.node.code.project.network.connections.addConnection(connectionProps);
      this.networkItem.init();
      this.networkItem.codeNodes.connection = this;
      this.networkItem.changes({ preventSimulation: true });
    });
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

    inputs.weight = () => new NumberInterface("weight", 1).use(displayInSidebar, true).setHidden(true);
    inputs.delay = () => new NumberInterface("delay", 0.1, 0.01, 0.1).use(displayInSidebar, true).setHidden(true);

    return { inputs, outputs };
  },
});
