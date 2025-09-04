// codeNode.ts
// Adapted from https://github.com/newcat/baklavajs/blob/987018200389bd86c48544ac4afa7a393fe1e9bc/packages/core/src/node.ts

import Mustache from "mustache";
import {
  AbstractNode,
  Connection,
  Graph,
  NodeInterface,
  NodeInterfaceDefinition,
  NodeInterfaceDefinitionStates,
} from "baklavajs";
import { reactive, UnwrapRef } from "vue";

import { logger as mainLogger } from "@/utils/logger";
import { truncate } from "@/utils/truncate";

import { BaseCode } from "../code/code";
import { CodeGraph } from "./codeGraph";
import { NodeInputInterface } from "./interface/nodeInputInterface";
import { NodeOutputInterface } from "./interface/nodeOutputInterface";

interface IAbstractCodeNodeState {
  codeTemplate: string;
  commented: boolean;
  comments: string;
  hidden: boolean;
  integrated: boolean;
  props: unknown;
  role: string;
  script: string;
  token: symbol | null;
}

export interface ICodeNodeState<I, O> {
  type: string;
  title: string;
  id: string;
  inputs: NodeInterfaceDefinitionStates<I> & NodeInterfaceDefinitionStates<Record<string, NodeInterface<any>>>;
  integrated: boolean;
  outputs: NodeInterfaceDefinitionStates<O> & NodeInterfaceDefinitionStates<Record<string, NodeInterface<any>>>;
}

export interface CodeNodeInterface extends NodeInterface<unknown> {
  type?: string;
}

interface CodeNodeConnection extends Connection {
  from: CodeNodeInterface;
  to: CodeNodeInterface;
}

export abstract class AbstractCodeNode extends AbstractNode {
  abstract inputs: Record<string, CodeNodeInterface>;
  abstract outputs: Record<string, CodeNodeInterface>;

  private _code: BaseCode | undefined;
  private _view: unknown | undefined;
  private _state: UnwrapRef<IAbstractCodeNodeState> = reactive({
    codeTemplate: "",
    commented: false,
    comments: "",
    hidden: false,
    integrated: false,
    props: null,
    role: "",
    script: "",
    token: null,
  });

  public logger = mainLogger.getSubLogger({
    name: `[${truncate(this.id)}] ${this.constructor.name}`,
    // minLevel: 1,
  });
  public modules: string[] = [];
  public variableName: string = "x";

  constructor() {
    super();

    this.twoColumn = true;
  }

  get code(): BaseCode | undefined {
    return this._code;
  }

  set code(value: BaseCode) {
    this._code = value;
  }

  abstract get codeTemplate(): string;

  abstract set codeTemplate(value: string);

  get idx(): number {
    return this.code?.graph?.nodesSegregated.indexOf(this) ?? -1;
  }

  get idxByVariableNames(): number {
    return this.code?.graph?.getNodesBySameVariableNames(this.variableName).indexOf(this) ?? -1;
  }

  get indexOfNodeType(): number {
    const nodeIds = this.code?.graph.nodesSegregated
      .filter((node: AbstractCodeNode) => node.type === this.type)
      .map((node: AbstractCodeNode) => node.id);
    if (nodeIds) return nodeIds.indexOf(this.id);
    return -1;
  }

  get label(): string {
    return this.variableName + (this.idxByVariableNames + 1);
  }

  get module(): string {
    if (!this.type.includes(".")) return "";
    const modules = this.type.split(".");
    return modules.slice(0, modules.length - 1).join(".");
  }

  get nOutputs(): number {
    return Object.keys(this.outputs).length;
  }

  get nInputs(): number {
    return Object.keys(this.inputs).length;
  }

  get node(): AbstractCodeNode {
    return this;
  }

  get shortId(): string {
    return truncate(this.id);
  }

  get script(): string {
    return this._state.script;
  }

  get state(): UnwrapRef<IAbstractCodeNodeState> {
    return this._state;
  }

  get subgraph(): boolean {
    return false;
  }

  get view(): unknown | undefined {
    return this._view;
  }

  set view(value: unknown) {
    this._view = value;
  }

  // calculate?: CalculateFunction<any, any> | undefined;

  /**
   * Get connected node input interface to the node interface.
   * @param nodeInterface string
   * @returns node input interface instance
   */
  getConnectedInputInterfaceByInterface(nodeInterface: string): NodeInputInterface | null {
    const nodeInterfaces = this.getConnectedInputInterfacesByInterface(nodeInterface);
    return nodeInterfaces.length > 0 ? nodeInterfaces[0] : null;
  }

  /**
   * Get connected node input interfaces to the node interface.
   * @param nodeInterface string
   * @returns node input interface instances
   */
  getConnectedInputInterfacesByInterface(nodeInterface: string): NodeInputInterface[] {
    return this.getConnectedInterfacesByInterface(nodeInterface, "outputs") as NodeInputInterface[];
  }

  /**
   * Get connected node to the node interface.
   * @param nodeInterface string
   * @returns code node instance or null
   */
  getConnectedInterfaceByInterface(nodeInterface: string, type?: "inputs" | "outputs"): NodeInterface | null {
    const interfaces = this.getConnectedInterfacesByInterface(nodeInterface, type);
    return interfaces.length > 0 ? interfaces[0] : null;
  }

  /**
   * Get connected node interface to the node interface.
   * @param nodeInterface string
   * @returns node interface instances
   */
  getConnectedInterfacesByInterface(nodeInterface: string, type?: "inputs" | "outputs"): NodeInterface[] {
    let nodeInterfaces: NodeInterface[] = [];

    if (type !== "outputs" && nodeInterface in this.inputs) {
      const sources = this.graph?.connections
        .filter((c: CodeNodeConnection) => c.from.type !== "_node")
        .filter(
          (c: CodeNodeConnection) =>
            c.to.id === this.inputs[nodeInterface].id || c.from.id === this.inputs[nodeInterface].id,
        )
        .map((c: CodeNodeConnection) => c.from);
      if (sources) nodeInterfaces = nodeInterfaces.concat(sources);
    }

    if (type !== "inputs" && nodeInterface in this.outputs) {
      const targets = this.graph?.connections
        .filter((c: CodeNodeConnection) => c.to.type !== "_node")
        .filter(
          (c: CodeNodeConnection) =>
            c.from.id === this.outputs[nodeInterface].id || c.from.id === this.outputs[nodeInterface].id,
        )
        .map((c: CodeNodeConnection) => c.to);
      if (targets) nodeInterfaces = nodeInterfaces.concat(targets);
    }

    return nodeInterfaces;
  }

  /**
   * Get connected node to the node interface.
   * @param nodeInterface string
   * @returns node interface instance or null
   */
  getConnectedNodeByInterface(nodeInterface: string, type?: "inputs" | "outputs"): AbstractCodeNode | null {
    const nodes = this.getConnectedNodesByInterface(nodeInterface, type);
    return nodes.length > 0 ? nodes[0] : null;
  }

  /**
   * Get connected nodes to the node.
   * @param type inputs or outputs
   * @returns code node instances
   */
  getConnectedNodes(type?: "inputs" | "outputs"): AbstractCodeNode[] {
    let nodeIds: string[] = [];

    if (type !== "inputs") {
      const targets = this.graph?.connections
        .filter((c: CodeNodeConnection) => c.from.type !== "node")
        .filter((c: CodeNodeConnection) => c.from.nodeId === this.id)
        .map((c: CodeNodeConnection) => c.to.nodeId);
      if (targets) nodeIds = nodeIds.concat(targets);
    }

    if (type !== "outputs") {
      const sources = this.graph?.connections
        .filter((c: CodeNodeConnection) => c.from.type !== "node")
        .filter((c: CodeNodeConnection) => c.to.nodeId === this.id)
        .map((c: CodeNodeConnection) => c.from.nodeId);

      if (sources) nodeIds = nodeIds.concat(sources);
    }

    if (!nodeIds || nodeIds.length == 0) return [];
    return nodeIds.map((nodeId: string) => this.graph?.findNodeById(nodeId)) as AbstractCodeNode[];
  }

  /**
   * Get connected nodes to the node interface.
   * @param nodeInterface string
   * @returns code node instances
   */
  getConnectedNodesByInterface(nodeInterface: string, type?: "inputs" | "outputs"): AbstractCodeNode[] {
    let nodeIds: string[] = [];

    if (type !== "outputs" && nodeInterface in this.inputs) {
      const sources = this.graph?.connections
        .filter(
          (c: CodeNodeConnection) =>
            c.to.id === this.inputs[nodeInterface].id || c.from.id === this.inputs[nodeInterface].id,
        )
        .map((c: CodeNodeConnection) => c.from.nodeId);
      if (sources) nodeIds = nodeIds.concat(sources);
    }

    if (type !== "inputs" && nodeInterface in this.outputs) {
      const targets = this.graph?.connections
        .filter(
          (c: CodeNodeConnection) =>
            c.from.id === this.outputs[nodeInterface].id || c.from.id === this.outputs[nodeInterface].id,
        )
        .map((c: CodeNodeConnection) => c.to.nodeId);
      if (targets) nodeIds = nodeIds.concat(targets);
    }

    if (!nodeIds || nodeIds.length == 0) return [];
    return nodeIds.map((nodeId) => this.graph?.findNodeById(nodeId)) as AbstractCodeNode[];
  }

  /**
   * Get connected node output interface to the node interface.
   * @param nodeInterface string
   * @returns node output interface instance
   */
  getConnectedOutputInterfaceByInterface(nodeInterface: string): NodeOutputInterface | undefined {
    const nodeInterfaces = this.getConnectedOutputInterfacesByInterface(nodeInterface);
    return nodeInterfaces.length > 0 ? nodeInterfaces[0] : undefined;
  }

  /**
   * Get connected node output interfaces to the node interface.
   * @param nodeInterface string
   * @returns node output interface instances
   */
  getConnectedOutputInterfacesByInterface(nodeInterface: string): NodeOutputInterface[] {
    return this.getConnectedInterfacesByInterface(nodeInterface, "inputs") as NodeOutputInterface[];
  }

  /**
   * Get connected node output interface to the node interface.
   * @param nodeInterface string
   * @returns string
   */
  getConnectedOutputVariableByInterface(nodeInterface: string): string | undefined {
    const sourceNodeInterface = this.getConnectedOutputInterfaceByInterface(nodeInterface);
    return this.code?.graph && sourceNodeInterface ? formatInterfaceLabel(sourceNodeInterface) : undefined;
  }

  getInputValue(name: string): string {
    const outputInterface = this.getConnectedOutputInterfaceByInterface(name);
    if (outputInterface) return `${formatInterfaceLabel(outputInterface)}`;
    else return `${this.inputs[name].value}`;
  }

  /**
   * Initialize code node interface.
   * @param type input or output
   * @param key  key for events
   * @param intf code node interface
   */
  private override initializeIntf(type: "input" | "output", key: string, intf: CodeNodeInterface): void {
    intf.isInput = type === "input";
    intf.nodeId = this.id;
    intf.graphId = this.graph?.id;
    intf.events.setValue.subscribe(this, () => this.events.update.emit({ type, name: key, intf }));
  }

  abstract onGraphUpdate(): void;

  abstract onModelUpdate(): void;

  /**
   * Remove this node.
   */
  remove(): void {
    this.graph?.removeNode(this);
  }

  /**
   * Render code of this node.
   */
  renderCode(): void {
    this.logger.trace("render code");

    this._state.script = Mustache.render(this.codeTemplate, this.toJSON());
    if (this.getConnectedNodes("outputs").length > 0) {
      this._state.script = `${this.label} = ${this._state.script}`;
    }

    if (this._state.commented) {
      this._state.script = `# ${this._state.script}`;
      this._state.script = this._state.script.replaceAll("\n", "\n# ");
    }

    if (this._state.comments) {
      this._state.script = `\n# ${this._state.comments}\n${this._state.script}`;
    }
  }

  toJSON(): Record<string, unknown> {
    const props: Record<string, unknown> = {};

    if (this.node && this.node.nInputs > 0) {
      Object.entries(this.node?.inputs).forEach((input) => {
        if (!input[1].hidden && input[1].value != null) props[input[0]] = input[1].value;
      });
    }

    return props;
  }

  updateValues(props: Record<string, unknown>): void {
    Object.keys(props).forEach((key: string) => {
      if (!(key in this.inputs)) return;
      this.inputs[key].value = props[key];
      this.inputs[key].setHidden(false);
    });
  }
}

export abstract class CodeNode<I, O> extends AbstractCodeNode {
  abstract inputs: NodeInterfaceDefinition<I>;
  abstract outputs: NodeInterfaceDefinition<O>;

  public load(state: ICodeNodeState<I, O>): void {
    super.load(state);
    loadNodeState(this.graph, state);
  }

  public save(): ICodeNodeState<I, O> {
    const state = super.save() as ICodeNodeState<I, O>;
    saveNodeState(this.graph, state);
    return state;
  }
  /**
   * The default implementation does nothing.
   * Overwrite this method to do calculation.
   * @param inputs Values of all input interfaces
   * @param globalValues Set of values passed to every node by the engine plugin
   * @return Values for output interfaces
   */
  // public calculate?: CalculateFunction<I, O>;
}

export type AbstractCodeNodeConstructor = new () => AbstractCodeNode;

/**
 * Format labels for output interfaces.
 * @param outputInterfaces output interface of the node
 * @param sorted boolean
 * @returns string array
 */
export const formatInterfaceLabels = (outputInterfaces: NodeOutputInterface[], sorted: boolean = true): string[] => {
  if (outputInterfaces.length === 0) return [];
  const labels: string[] = [];

  outputInterfaces.forEach((outputInterface: NodeOutputInterface) => {
    if (!outputInterface.node) return;
    labels.push(formatInterfaceLabel(outputInterface));
  });

  if (sorted) labels.sort();
  return labels;
};

/**
 * Format label for output interface.
 * @param outputInterface output interface of the node
 * @returns string
 */
export const formatInterfaceLabel = (outputInterface: NodeOutputInterface): string => {
  if (!outputInterface.node) return "";
  return outputInterface.node.state.integrated ? outputInterface.node.codeTemplate : outputInterface.label;
};

/**
 * Format node label.
 * @param node code node
 * @returns string
 */
export const formatLabel = (node: AbstractCodeNode): string => {
  return node.state.integrated ? node.codeTemplate : node.label;
};

/**
 * Format node labels.
 * @param nodes code nodes
 * @param sorted boolean
 * @returns string array
 */
export const formatLabels = (nodes: AbstractCodeNode[], sorted: boolean = true): string[] => {
  if (nodes.length === 0) return [];

  const labels = nodes.map((node: AbstractCodeNode) => formatLabel(node));

  if (sorted) labels.sort();
  return labels;
};

/**
 * Load node state.
 * @param graph code graph
 * @param nodeState node state
 */
export const loadNodeState = (graph: CodeGraph | Graph | undefined, nodeState: ICodeNodeState<any, any>): void => {
  if (!graph) return;

  const node = graph.findNodeById(nodeState.id);
  if (!node) return;

  if (!node.subgraph) {
    if (node.state) node.state.integrated = nodeState.integrated;

    Object.entries(nodeState.inputs).forEach(([inputKey, inputItem]) => {
      if (inputKey === "_node") return;
      if (node.inputs[inputKey]) node.inputs[inputKey].hidden = inputItem.hidden;
    });

    Object.entries(nodeState.outputs).forEach(([outputKey, outputItem]) => {
      if (outputKey === "_node") return;
      if (node.outputs[outputKey]) node.outputs[outputKey].hidden = outputItem.hidden;
    });
  }
};

/**
 * Save state of node.
 * @param graph code graph
 * @param nodeState node state
 */
export const saveNodeState = (graph: CodeGraph | Graph | undefined, nodeState: ICodeNodeState<any, any>): void => {
  if (!graph) return;

  const node = graph.findNodeById(nodeState.id);
  if (!node) return;

  if (!node.subgraph) {
    if (node.state) nodeState.integrated = node.state.integrated;

    Object.entries(nodeState.inputs).forEach(([inputKey]) => {
      if (inputKey === "_node") return;
      if (node.inputs[inputKey]) nodeState.inputs[inputKey].hidden = node.inputs[inputKey].hidden;
    });

    Object.entries(nodeState.outputs).forEach(([outputKey]) => {
      if (outputKey === "_node") return;
      if (node.outputs[outputKey]) nodeState.outputs[outputKey].hidden = node.outputs[outputKey].hidden;
    });
  }
};
