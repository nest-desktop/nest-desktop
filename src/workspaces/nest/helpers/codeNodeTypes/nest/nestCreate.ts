// nestCreate.ts

import {
  Connection,
  IntegerInterface,
  NodeInterface,
  SelectInterface,
  TextInputInterface,
  displayInSidebar,
  setType,
} from "baklavajs";
import { nextTick } from "vue";

import { AbstractCodeNode, formatInterfaceLabel } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { INodeGroupProps } from "@/helpers/node/nodeGroup";
import { IParamProps } from "@/helpers/common/parameter";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";
import { useAppStore } from "@/stores/appStore";

import nestCreate from "../../codeNodeTypes/nest/nestCreate";
import nestRandomUniform from "./nestRandomUniform";
import nestSpatialFree from "./nestSpatialFree";
import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";
import { INESTNodeProps } from "../../node/node";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import { NESTModel } from "../../model/model";
import { NESTNode } from "../../node/node";
import { addParameterNode } from "./nestParameters";

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
    // if (model != undefined) args.push(`"${formatInterfaceLabel(model)}"`);
    // else args.push(`"${this.node.inputs.model.value}"`);

    // const size = this.node.getConnectedOutputInterfaceByInterface("size");
    // if (size != undefined) args.push(`${formatInterfaceLabel(size)}`);
    // else if (!this.node.inputs.size.hidden) args.push(`${this.node.inputs.size.value}`);

    // keyword = args.length < 2 ? "params=" : "";
    // const params = this.node.getConnectedOutputInterfaceByInterface("params");
    // if (params != undefined) args.push(`${keyword}${formatInterfaceLabel(params)}`);

    // keyword = args.length < 3 ? "positions=" : "";
    // const positions = this.node.getConnectedOutputInterfaceByInterface("positions");
    // if (positions != undefined) args.push(`${keyword}${formatInterfaceLabel(positions)}`);

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
    if (node.view.showSize == this.node.inputs.size.hidden) node.view.showSize = !this.node.inputs.size.hidden;
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

      const paramNode = this.node.getConnectedNodeByInterface("params");
      if (paramNode) {
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

      this.networkItem.onUpdate({ preventSimulation: true });

      if (this.networkItem.model)
        this.variableName = this.networkItem.model.isNeuron ? "n" : this.networkItem.model.abbreviation;
    });
  },
  onProjectUpdate() {
    if (!this.node || !this.node.networkItem) return;
    const node: NESTNode = this.node.networkItem as NESTNode;

    if (node.model) this.variableName = node.model.isNeuron ? "n" : node.model.abbreviation;
    if (this.node.inputs.model.value != node.modelId) this.node.inputs.model.value = node.modelId;
    if (this.node.inputs.size.value != node.size) this.node.inputs.size.value = node.size;
    if (this.node.inputs.size.hidden == node.view.showSize) this.node.inputs.size.setHidden(!node.view.showSize);

    let paramNode = this.node.getConnectedNodeByInterface("params");
    if (!paramNode && node.paramsVisible.length > 0) {
      const position = { ...this.node.position };
      position.x -= 400;
      position.y += 50;
      paramNode = addParameterNode(this.code.graph, [], position);
      this.code.graph.addConnection(paramNode.outputs.out, this.node.inputs.params);
    } else if (paramNode && node.paramsVisible.length === 0) {
      paramNode?.remove();
      this.node.inputs.params.setHidden(true);
    }

    if (paramNode) {
      paramNode.networkItem = node;
      paramNode.onUpdate();
      paramNode.onProjectUpdate();
    }
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
    if (model != undefined) props["model"] = formatInterfaceLabel(model);
    else props["model"] = `"${this.node.inputs.model.value}"`;

    const size = this.node.getConnectedOutputInterfaceByInterface("size");
    if (size != undefined) props["size"] = formatInterfaceLabel(size);
    else if (!this.node.inputs.size.hidden) props["size"] = this.node.inputs.size.value;

    const paramsNode = this.node.getConnectedNodeByInterface("params");
    if (paramsNode != undefined)
      if (paramsNode instanceof AbstractCodeNode) {
        const params = this.node.getConnectedOutputInterfaceByInterface("params");
        if (params && !this.node.inputs.params.hidden) {
          props["params"] = formatInterfaceLabel(params);
        }
      } else {
        const subgraph = paramsNode.subgraph;
        const connection = subgraph.connections.find(
          (connection: Connection) => connection.to.nodeId === subgraph.outputs[0].nodeId,
        );
        const node = subgraph.findNodeById(connection.from.nodeId);
        props["params"] = formatInterfaceLabel(node.outputs.out);
      }

    const positions = this.node.getConnectedOutputInterfaceByInterface("positions");
    if (positions != undefined && !this.node.inputs.positions.hidden)
      props["positions"] = formatInterfaceLabel(positions);

    return props;
  },
});

export const createNode = (
  graph: CodeGraph | NESTCodeGraph,
  nodeProps: INESTNodeProps,
  idx: number = 0,
): AbstractCodeNode => {
  const codeNode = graph.addNodeAtColumn(nestCreate, 1, 100 + 290 * idx, nodeProps);
  if (idx === 0) codeNode.state.comments = "Create nodes";
  // codeNode.variableName = nodeProps.model as string;
  codeNode.inputs.model.value = nodeProps.model;
  codeNode.inputs.size.value = nodeProps.size ?? 1;
  codeNode.inputs.size.hidden = nodeProps.size ? nodeProps.size === 1 : true;
  if (nodeProps.model === "weight_recorder") {
    codeNode.variableName = "wr";
    // weightRecorders.push(codeNode);
  }

  // params
  const params = nodeProps.params?.filter((param: IParamProps) => ("visible" in param ? param.visible : true));
  if (params && params.length > 0) {
    const position = { ...codeNode.position };
    position.x -= 400;
    position.y += 50;
    const paramsNode = addParameterNode(graph, params, position);
    graph.addConnection(paramsNode.outputs.out, codeNode.inputs.params);
  }

  // positions
  if (nodeProps.spatial) {
    const randNode = graph.addNodeAtColumn(nestRandomUniform, -2, 900);
    randNode.state.integrated = true;
    randNode.inputs.min.value = -0.5;
    randNode.inputs.max.value = 0.5;
    const posNode = graph.addNodeAtColumn(nestSpatialFree, -1, 900, nodeProps.spatial);
    posNode.state.integrated = true;

    graph.addConnection(randNode.outputs.out, posNode.inputs.pos);
    graph.addConnection(posNode.outputs.out, codeNode.inputs.positions);

    codeNode.events.update.emit({
      type: "input",
      intf: codeNode.inputs.positions,
      name: "positions",
    });
    // spatialNodes.push(codeNode);
  }

  return codeNode;
};

export const createNodes = (
  graph: CodeGraph | NESTCodeGraph,
  nodesProps?: (INESTNodeProps | INodeGroupProps)[],
): Record<string, AbstractCodeNode[]> => {
  if (!nodesProps || nodesProps.length === 0) return {};

  const nodes: AbstractCodeNode[] = [];
  const spatialNodes: AbstractCodeNode[] = [];
  const weightRecorders: AbstractCodeNode[] = [];

  nodesProps.forEach((nodeProps: INESTNodeProps | INodeGroupProps, idx: number) => {
    const codeNode: AbstractCodeNode = createNode(graph, nodeProps as INESTNodeProps, idx);

    // const paramsNode = codeNode.getConnectedNodeByInterface("params");
    // if (paramsNode)
    //   nodeProps.params.forEach((param) => {
    //     if ("visible" in param ? param.visible : true) {
    //       const paramInterface = createParameterInterface(param);
    //       paramsNode.addInput(param.id, paramInterface);
    //     }
    //   });

    nodes.push(codeNode);
  });

  return { all: nodes, spatial: spatialNodes, weightRecorders };
};
