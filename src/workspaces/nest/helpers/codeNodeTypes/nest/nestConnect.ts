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
    model: () => new TextInputInterface("model", "static_synapse").use(displayInSidebar, true).setHidden(true),
    weight: () => new NumberInterface("weight", 1).use(displayInSidebar, true).setHidden(true),
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

    const synSpecs = [];
    if (!this.node.inputs.model.hidden) synSpecs.push(`"synapse_model": "${this.node.inputs.model.value}"`);
    if (!this.node.inputs.weight.hidden) synSpecs.push(`"weight": ${this.node.inputs.weight.value}`);
    if (synSpecs.length > 0) args.push(`syn_spec={\n\t${synSpecs.join(",\n\t")}\n}`);

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
      this.networkItem.changes({ prevenSimulation: true });
    });
  },
  onUpdate({ conn_spec }) {
    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    if (conn_spec === "pairwise_bernoulli")
      inputs.p = () => new NumberInterface("p", 0.1, 0.01, 1).use(displayInSidebar, true).setHidden(true);

    return { inputs, outputs };
  },
});
