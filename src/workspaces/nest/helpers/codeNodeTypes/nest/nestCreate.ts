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

import { AbstractCodeNode, formatInterfaceLabel, formatLabel } from "@/helpers/codeGraph/codeNode";
import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { INodeGroupProps } from "@/helpers/node/nodeGroup";
import { IParamProps } from "@/helpers/common/parameter";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import nestCreate from "../../codeNodeTypes/nest/nestCreate";
import nestRandomUniform from "./nestRandomUniform";
import nestSpatialFree from "./nestSpatialFree";
import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";
import { INESTNodeProps } from "../../node/node";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import { addParameterNode } from "./nestParameters";

export default defineDynamicCodeNode({
  type: "nest.Create",
  title: "create node",
  variableName: "node",
  inputs: {
    model: () => new TextInputInterface("model", "iaf_psc_alpha").use(setType, stringType).use(displayInSidebar, true),
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
    if (!this.node.view) {
      const idx = this.node.indexOfNodeType;
      this.node.view = this.node.code.project.network.nodes.createNode(this.node, {
        view: { position: { x: 150 * idx, y: 0 + 50 * (idx % 2) } },
      });
    }

    const paramNode = this.node.getConnectedNodeByInterface("params");
    if (paramNode) {
      this.node.view.codeNodes.param = paramNode;
      this.node.view.paramsAll.forEach((param) => (param.codeNodes.node = paramNode));

      if (!paramNode.view) paramNode.view = this.node.view;

      paramNode.onUpdate();
    }
  },
  onModelUpdate() {
    if (!this.node) return;
    if (this.node.view) this.node.variableName = this.node.view.variableName;
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

    const positions = this.node.getConnectedNodeByInterface("positions");
    if (positions)
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
      if (paramsNode.subgraph) {
        const subgraph = paramsNode.subgraph;
        const connection = subgraph.connections.find(
          (connection: Connection) => connection.to.nodeId === subgraph.outputs[0].nodeId,
        );
        if (connection) {
          const node = subgraph.findNodeById(connection.from.nodeId);
          if (node) props["params"] = formatLabel(node);
        }
      } else {
        const params = this.node.getConnectedOutputInterfaceByInterface("params");
        if (params && !this.node.inputs.params.hidden) {
          props["params"] = formatInterfaceLabel(params);
        }
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
  idx: number = -1,
): AbstractCodeNode => {
  if (idx === -1) {
    idx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Create").length;
  }

  const codeNode = graph.addNodeAtColumn(nestCreate, 1, 100 + 290 * idx, nodeProps);
  if (idx === 0) codeNode.state.comments = "Create nodes";
  // codeNode.variableName = nodeProps.model as string;
  codeNode.inputs.model.value = nodeProps.model;
  codeNode.inputs.size.value = nodeProps.size ?? 1;
  codeNode.inputs.size.setHidden(nodeProps.size ? nodeProps.size === 1 : true);
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
    if (codeNode.view?.codeNodes) codeNode.view.codeNodes.params = paramsNode;
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

  const allNodes: AbstractCodeNode[] = [];
  const spatialNodes: AbstractCodeNode[] = [];
  const weightRecorders: AbstractCodeNode[] = [];

  nodesProps.forEach((nodeProps: INESTNodeProps | INodeGroupProps) => {
    const codeNode: AbstractCodeNode = createNode(graph, nodeProps as INESTNodeProps);
    allNodes.push(codeNode);
  });

  return { allNodes, spatialNodes, weightRecorders };
};
