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
import { IParamProps } from "@/helpers/common/parameter";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { NodeOutputInterface } from "@/helpers/codeGraph/interface/nodeOutputInterface";
import { defineDynamicCodeNode } from "@/helpers/codeGraph/dynamicCodeNode";
import { numberType, stringType } from "@/helpers/codeNodeTypes/base/interfaceTypes";

import nestCreate from "./nestCreate";
import { INESTNodeCollection, nestNodeCollectionType } from "./interfaceTypes";
import { INESTNodeSpatialProps } from "../../node/nodeSpatial/nodeSpatial";
import { NESTCodeGraph } from "../../codeGraph/codeGraph";
import { NESTNode } from "../../node/node";
import { getNESTDataResponseNode } from "./nestDataResponse";
import { loadNESTRandomUniform } from "./nestRandomUniform";
import { loadNESTSpatialFree } from "./nestSpatialFree";
import { updateNESTParameterNode } from "./nestParameters";

export interface INESTNodeProps {
  model?: string;
  params?: IParamProps[];
  size?: number;
  spatial?: INESTNodeSpatialProps;
}

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
    if (!this.node) return;

    if (!this.node.view) {
      const idx = this.node.indexOfNodeType;
      const node = new NESTNode(this.node.code?.project.network.nodes, {
        view: { position: { x: 150 * idx, y: 0 + 50 * (idx % 2) } },
      });

      this.node.view = node;
      node.codeNodes.node = this.node;

      node.init();
    }

    // const paramsProps = this.node.view.paramJSON;
    // const paramsNode = updateNESTParameterNode(this.node.graph, this.node, paramsProps);

    const paramsNode = this.node.getConnectedNodeByInterface("params");
    if (paramsNode) {
      this.node.view.codeNodes.params = paramsNode;

      this.node.view.paramsAll.forEach((param) => (param.codeNodes.node = paramsNode));
      if (!paramsNode.view) paramsNode.view = this.node.view;

      paramsNode.onUpdate();
    }

    const spatialNode = this.node.getConnectedNodeByInterface("positions");
    this.node.view.codeNodes.spatial = spatialNode;
    this.node.view.spatial.codeNodes.node = spatialNode;
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

export const addNESTCreateNode = (graph: CodeGraph | NESTCodeGraph, idx: number = -1): AbstractCodeNode => {
  if (idx === -1) idx = graph.nodes.filter((node: AbstractCodeNode) => node.type === "nest.Create").length;
  const codeNode = graph.addNodeAtColumn(nestCreate, 1, 100 + 290 * idx);
  if (idx === 0) codeNode.state.comments = "Create nodes";
  return codeNode;
};

export const loadNESTCreateNode = (
  graph: CodeGraph | NESTCodeGraph,
  nodeProps: INESTNodeProps,
  idx: number = -1,
): AbstractCodeNode => {
  const codeNode = addNESTCreateNode(graph, idx);
  codeNode.state.props = nodeProps;

  const codeNodeProps: Record<string, unknown> = { model: nodeProps.model };
  if (nodeProps.size) codeNodeProps.size = nodeProps.size;
  codeNode.updateValues(codeNodeProps);

  // params
  if (nodeProps.params) {
    const paramsProps = nodeProps.params.filter((param: IParamProps) => ("visible" in param ? param.visible : true));
    updateNESTParameterNode(graph, codeNode, paramsProps);
  }

  // positions
  if (nodeProps.spatial) {
    const randNode = loadNESTRandomUniform(graph, { min: -0.5, max: 0.5 }, graph.nodes.indexOf(codeNode));
    const spatialNode = loadNESTSpatialFree(graph, graph.nodes.indexOf(codeNode));

    graph.addConnection(randNode.outputs.out, spatialNode.inputs.pos);
    graph.addConnection(spatialNode.outputs.out, codeNode.inputs.positions);

    codeNode.events.update.emit({
      type: "input",
      intf: codeNode.inputs.positions,
      name: "positions",
    });
  }

  return codeNode;
};

export const updateRecorderNode = (graph: CodeGraph | NESTCodeGraph, codeNode: AbstractCodeNode) => {
  if (!codeNode.outputs.events || !codeNode.view) return;

  const responseNode = getNESTDataResponseNode(graph);

  const isRecorder = codeNode.view.model.isRecorder;
  const hasConnection = codeNode.code.graph.hasConnection(codeNode.outputs.events, responseNode.inputs.events);

  if (!isRecorder && hasConnection) {
    graph.connections
      .filter(
        (connection: Connection) =>
          connection.from.id === codeNode.outputs.events.id || connection.to.id === codeNode.outputs.events.id,
      )
      .forEach((connection: Connection) => graph.removeConnection(connection));
  } else if (isRecorder && !hasConnection) graph.addConnection(codeNode.outputs.events, responseNode.inputs.events);
};

export const updateNESTSpatialNode = (
  graph: CodeGraph | NESTCodeGraph,
  codeNode: AbstractCodeNode,
  spatialProps?: INESTNodeSpatialProps,
) => {
  if (!codeNode.view) return;

  let randNode: AbstractCodeNode | null;
  let spatialNode: AbstractCodeNode | null;

  spatialNode = codeNode.getConnectedNodeByInterface("positions");

  if (spatialNode && !spatialProps) {
    randNode = spatialNode.getConnectedNodeByInterface("pos");
    if (randNode) randNode.remove();
    delete spatialNode.view.codeNodes.node;
    // delete spatialNode.view;
    spatialNode.remove();
    codeNode.inputs.positions.setHidden(true);
  } else if (!spatialNode) {
    const randNode = loadNESTRandomUniform(graph, { min: -0.5, max: 0.5 }, graph.nodes.indexOf(codeNode));
    spatialNode = loadNESTSpatialFree(graph, graph.nodes.indexOf(codeNode));

    graph.addConnection(randNode.outputs.out, spatialNode.inputs.pos);
    graph.addConnection(spatialNode.outputs.out, codeNode.inputs.positions);

    // if (codeNode.view) {
    //   spatialNode.view = codeNode.view.spatial;
    //   spatialNode.view.codeNodes.node = spatialNode;
    // }
  }

  spatialNode.onGraphUpdate();

  // spatialNode.updateValues(spatialProps);
};
