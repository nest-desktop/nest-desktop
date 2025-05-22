// nestCreate.ts

import {
  IntegerInterface,
  NodeInterface,
  SelectInterface,
  TextInputInterface,
  displayInSidebar,
  setType,
} from "baklavajs";
import { nextTick } from "vue";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { useAppStore } from "@/stores/appStore";

import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";
import { NESTNode } from "../../node/node";
import { NESTModel } from "../../model/model";

export default defineDynamicCodeNode({
  type: "nest.Create",
  title: "create node",
  variableName: "node",
  inputs: {
    model: () => new TextInputInterface("model", "iaf_psc_alpha").use(setType, stringType),
    size: () => new IntegerInterface("size", 1, 1).use(setType, numberType).use(displayInSidebar, true).setHidden(true),
    params: () => new NodeInputInterface("params").use(displayInSidebar, true).setHidden(true),
    positions: () => new NodeInputInterface("positions").use(displayInSidebar, true).setHidden(true),
  },
  outputs: {
    out: () => new NodeOutputInterface<INESTNodeCollection>().use(setType, nestNodeCollectionType),
  },
  codeTemplate() {
    if (!this.node) return this.type;

    const props = this.node.toJSON();
    const args: string[] = [];
    let keyword: string = "";

    args.push("{{ &model }}");

    if ("size" in props) args.push("{{ &size }}");

    keyword = args.length < 2 ? "params=" : "";
    if ("params" in props) args.push(`${keyword}{{ &params }}`);

    keyword = args.length < 3 ? "positions=" : "";
    if ("positions" in props) args.push(`${keyword}{{ &positions }}`);

    // const model = this.node.getConnectedOutputInterfaceByInterface("model");
    // if (model.length > 0) args.push(`"${this.code?.graph.formatInterfaceLabels(model).join(", ")}"`);
    // else args.push(`"${this.node.inputs.model.value}"`);

    // const size = this.node.getConnectedOutputInterfaceByInterface("size");
    // if (size.length > 0) args.push(`${this.code?.graph.formatInterfaceLabels(size).join(", ")}`);
    // else if (!this.node.inputs.size.hidden) args.push(`${this.node.inputs.size.value}`);

    // keyword = args.length < 2 ? "params=" : "";
    // const params = this.node.getConnectedOutputInterfaceByInterface("params");
    // if (params.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(params).join(", ")}`);

    // keyword = args.length < 3 ? "positions=" : "";
    // const positions = this.node.getConnectedOutputInterfaceByInterface("positions");
    // if (positions.length > 0) args.push(`${keyword}${this.code?.graph.formatInterfaceLabels(positions).join(", ")}`);

    return `nest.Create(${args.join(", ")})`;
  },
  onGraphUpdate() {
    if (!this.node || !this.node.networkItem) return;

    const appStore = useAppStore();
    const modelDBStore = appStore.currentWorkspace.stores.modelDBStore;
    const modelIds = modelDBStore.state.models.map((model: NESTModel) => model.id);

    const node: NESTNode = this.node.networkItem as NESTNode;
    if (node.modelId !== this.node.inputs.model.value && modelIds.includes(this.node.inputs.model.value))
      node.modelId = this.node.inputs.model.value;
    if (node.size !== this.node.inputs.size.value) node.size = this.node.inputs.size.value;
  },
  onPlaced() {
    if (!this.node || !this.node?.code?.project?.network) return;

    const nodeItems = this.code.project.network.nodes.nodeItems;
    this.node.networkItem = nodeItems[this.indexOfNodeType];
    if (this.node.networkItem) return;

    nextTick(() => {
      const nodeProps: Record<string, unknown> = { model: this.node.inputs.model.value };
      if (!this.node.inputs.size.hidden) nodeProps.size = this.node.inputs.size.value;

      const paramNodes = this.node.getConnectedNodesByInterface("params");
      let paramNode;
      if (paramNodes && paramNodes.length > 0) {
        paramNode = paramNodes[0];
        const paramProps = Object.entries(paramNode.inputs).map(([k, v]) => ({ id: k, value: v.value }));
        if (paramProps.length > 0) nodeProps.params = paramProps;
      }

      const idx = this.node.indexOfNodeType;
      nodeProps.view = { position: { x: 150 * idx, y: 0 + 50 * (idx % 2) } };

      const node: NESTNode = this.node.code.project.network.nodes.addNode(nodeProps);
      node.init();

      this.node.networkItem = node;
      this.node.networkItem.codeNodes.node = this;
      if (paramNode) {
        this.networkItem.codeNodes.param = paramNode;
        paramNode.networkItem = this.networkItem;
      }
      this.networkItem.changes({ preventSimulation: true });

      if (this.networkItem.model)
        this.variableName = this.networkItem.model.isNeuron ? "n" : this.networkItem.model.abbreviation;
    });
  },
  onProjectUpdate() {
    if (!this.node || !this.node.networkItem) return;
    const node: NESTNode = this.node.networkItem as NESTNode;

    if (node.model) this.variableName = node.model.isNeuron ? "n" : node.model.abbreviation;
    if (this.node.inputs.model.value !== node.modelId) this.node.inputs.model.value = node.modelId;
    if (this.node.inputs.size.value !== node.size) this.node.inputs.size.value = node.size;
  },
  onUpdate({ model }) {
    if (!this.node) return {};

    const inputs: Record<string, () => NodeInterface> = {};
    const outputs: Record<string, () => NodeInterface> = {};

    inputs.model = () => new SelectInterface("model", "iaf_psc_alpha", ["iaf_psc_alpha", "iaf_cond_alpha"]);

    if (model.includes("recorder") || model.includes("meter")) {
      outputs.events = () => new NodeOutputInterface("events", ".events");
      outputs.times = () =>
        new NodeOutputInterface("times", ".events['times']").use(displayInSidebar, true).setHidden(true);
      outputs.senders = () =>
        new NodeOutputInterface("senders", ".events['senders']").use(displayInSidebar, true).setHidden(true);
    }

    const positions = this.node.getConnectedNodesByInterface("positions") || [];
    if (positions.length > 0)
      outputs.positions = () => new NodeOutputInterface("positions").use(displayInSidebar, true).setHidden(true);

    return { inputs, outputs };
  },
  toJSON() {
    if (!this.node) return {};

    const props: Record<string, unknown> = {};

    const model = this.node.getConnectedOutputInterfaceByInterface("model");
    if (model.length > 0) props["model"] = this.code?.graph.formatInterfaceLabels(model).join(", ");
    else props["model"] = `"${this.node.inputs.model.value}"`;

    const size = this.node.getConnectedOutputInterfaceByInterface("size");
    if (size.length > 0) props["size"] = this.code?.graph.formatInterfaceLabels(size).join(", ");
    else if (!this.node.inputs.size.hidden) props["size"] = this.node.inputs.size.value;

    const params = this.node.getConnectedOutputInterfaceByInterface("params");
    if (params.length > 0 && !this.node.inputs.params.hidden)
      props["params"] = this.code?.graph.formatInterfaceLabels(params).join(", ");

    const positions = this.node.getConnectedOutputInterfaceByInterface("positions");
    if (positions.length > 0 && !this.node.inputs.positions.hidden)
      props["positions"] = this.code?.graph.formatInterfaceLabels(positions).join(", ");

    return props;
  },
});
