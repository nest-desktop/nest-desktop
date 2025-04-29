// codeGraph.ts

import { Connection, Editor, Graph, IGraphState, NodeInterface } from "baklavajs";
import { nextTick, reactive, UnwrapRef } from "vue";
import toposort from "toposort";

import { AbstractCodeNode } from "./codeNode";
import { BaseCode } from "../code/code";
import { BaseObj } from "../common/base";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
import { NodeOutputInterface } from "./interface/nodeOutputInterface";
import { truncate } from "@/utils/truncate";

interface ICodeGraphState {
  graph: IGraphState;
  token: symbol | null;
}

export class CodeGraph extends BaseObj {
  public _code: BaseCode;
  private _state: UnwrapRef<ICodeGraphState>;

  constructor(code: BaseCode, graphProps?: IGraphState) {
    super();
    this.logger.settings.name = `[${this.shortUuid}] code graph`;
    // this.logger.settings.minLevel = 1;

    this._code = code;

    this._state = reactive({
      graph: graphProps || new Graph(new Editor()).save(),
      token: null,
    });

    this.init();
  }

  get code(): BaseCode {
    return this._code;
  }

  get connections(): Connection[] {
    return this.graph.connections as Connection[];
  }

  set connections(values: Connection[]) {
    this.graph._connections = values as Connection[];
  }

  get graph(): Graph {
    const codeGraphStore = useCodeGraphStore();
    return codeGraphStore.editor.graph as Graph;
  }

  get modules(): string[] {
    let categories = Array.from(
      new Set(
        this.nodes
          .filter((node: AbstractCodeNode) => node.module.length > 0)
          .map((node: AbstractCodeNode) => node.module),
      ),
    );

    this.nodes
      .filter((node: AbstractCodeNode) => node.modules.length > 0)
      .forEach((node: AbstractCodeNode) => {
        categories = categories.concat(node.modules);
      });

    categories.sort();

    const codeGraphStore = useCodeGraphStore();
    return Array.from(new Set(categories.map((category: string) => codeGraphStore.state.modules[category])));
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph.nodes as AbstractCodeNode[];
  }

  set nodes(values: AbstractCodeNode[]) {
    this.graph._nodes = values as AbstractCodeNode[];
  }

  get nodesSegregated(): AbstractCodeNode[] {
    return this.nodes.filter((node: AbstractCodeNode) => !node.state.integrated) as AbstractCodeNode[];
  }

  get state(): UnwrapRef<ICodeGraphState> {
    return this._state;
  }

  get visibleNodes(): AbstractCodeNode[] {
    return this.nodes.filter((node: AbstractCodeNode) => !node.state.hidden) as AbstractCodeNode[];
  }

  /**
   * Add connection of code nodes
   * @param from code node interface
   * @param to code node interface
   */
  addConnection(from: NodeInterface, to: NodeInterface): void {
    from.hidden = false;
    to.hidden = false;
    this.graph.addConnection(from, to);
  }

  /**
   * Add code node to graph.
   * @param node code node
   */
  addNode(node: AbstractCodeNode): void {
    node.code = this.code;
    this.graph.addNode(node);
  }

  /**
   * Add code node at specific column.
   * @param node code node
   */
  addNodeAtColumn(nodeType: new () => AbstractCodeNode, col: number = 0, offset: number = 100) {
    const left = 300;
    const width = 350;
    const space = 70;

    const node = new nodeType();
    this.addNode(node);
    if (node.position) {
      node.position.x = left + col * (width + space);
      node.position.y = offset;
    }

    return node;
  }

  /**
   * Clear code graph.
   */
  clear(): void {
    this.unsubscribe();
    this.nodes = [];
    this.connections = [];
    this.subscribe();
  }

  formatInterfaceLabels(outputInterfaces: NodeOutputInterface[], sorted: boolean = true): string[] {
    const labels: string[] = [];

    if (outputInterfaces.length > 0) {
      outputInterfaces.forEach((outputInterface: NodeOutputInterface) => {
        const node = outputInterface.node as AbstractCodeNode;
        labels.push(node.state.integrated ? node.codeTemplate : outputInterface.label);
      });

      if (sorted) labels.sort();
    }

    return labels;
  }

  formatLabels(nodes: AbstractCodeNode[], sorted: boolean = true): string[] {
    const labels: string[] = [];

    nodes.forEach((node: AbstractCodeNode) => labels.push(node.state.integrated ? node.codeTemplate : node.label));

    if (sorted) labels.sort();
    return labels;
  }

  findNodeByType(nodeType: string): AbstractCodeNode | undefined {
    return this.nodes.find((node: AbstractCodeNode) => node.type === nodeType);
  }

  getNodesBySameType(type: string): AbstractCodeNode[] {
    return this.nodes.filter((node: AbstractCodeNode) => node.type === type) as AbstractCodeNode[];
  }

  getNodesBySameVariableNames(variableName: string): AbstractCodeNode[] {
    return this.nodes.filter((node: AbstractCodeNode) => node.variableName === variableName) as AbstractCodeNode[];
  }

  /**
   * Initialize code graph.
   */
  init(): void {
    this.logger.trace("init");

    if (this.state.token) this.graph.editor.graphEvents.beforeAddNode.unsubscribe(this.state.token);
    this.state.token = Symbol("token");
    this.graph.editor.graphEvents.beforeAddNode.subscribe(this.state.token, (node: AbstractCodeNode) => {
      node.code = this.code;
    });

    // this.nodes.forEach((node) => (node.code = this.code));
  }

  /**
   * Load code graph.
   */
  load(): void {
    this.logger.trace("load", truncate(this.state.graph.id));

    if (this.graph.id === this.state.graph.id) return;
    this.unsubscribe();
    this.graph.load(this.state.graph);
    this.loadStates();
    this.onUpdate();
    this.subscribe();
  }

  /**
   * Load states of code nodes.
   */
  loadStates(): void {
    this.state.graph.nodes.forEach((nodeProps, nodeIdx) => {
      const node: AbstractCodeNode = this.nodes[nodeIdx];
      node.state.integrated = nodeProps.integrated || false;

      Object.entries(nodeProps.inputs).forEach(([inputKey, inputItem]) => {
        // const inputKeys = Object.keys(node.inputs);
        // if (!inputKeys.includes(inputKey)) node.addInput(inputKey, inputValue)
        if (node.inputs[inputKey]) node.inputs[inputKey].hidden = inputItem.hidden;
      });

      Object.entries(nodeProps.outputs).forEach(([outputKey, outputItem]) => {
        if (node.outputs[outputKey]) node.outputs[outputKey].hidden = outputItem.hidden;
      });
    });
  }

  /**
   * Triggers on project update.
   */
  onProjectUpdate = () => {
    this.logger.trace("on project update");

    if (this.nodes.length > 0) {
      this.sortNodes();
      this.nodes.forEach((node) => node.onProjectUpdate());
    }

    nextTick(() => {
      this.code.generate();
      this.save();
    });
  };

  /**
   * Triggers on code graph update.
   */
  onUpdate = () => {
    this.logger.trace("on update");

    if (this.nodes.length > 0) {
      this.sortNodes();
      this.nodes.forEach((node) => node.onGraphUpdate());
    }

    nextTick(() => {
      this.code.generate();
      this.save();
    });
  };

  /**
   * Render node codes.
   */
  renderCodes(): void {
    this.logger.trace("render codes");

    if (this.nodes.length === 0) return;
    this.nodes.forEach((node: AbstractCodeNode) => (node.renderCode ? node.renderCode() : null));
  }

  /**
   * Save code graph.
   * @returns graph state
   */
  save(): IGraphState {
    this.logger.trace("save");
    const graph = this.graph.save();
    this.saveStates(graph);
    this.state.graph = graph;
    return graph;
  }

  /**
   * Save states of code graph.
   * @param graph graph state.
   */
  saveStates(graph: IGraphState): void {
    graph.nodes.forEach((node, nodeIdx) => {
      const integrated = this.nodes[nodeIdx].state.integrated;
      if (integrated) node.integrated = integrated;

      Object.entries(node.inputs).forEach(([inputKey]) => {
        node.inputs[inputKey].hidden = this.graph.nodes[nodeIdx].inputs[inputKey].hidden;
      });

      Object.entries(node.outputs).forEach(([outputKey]) => {
        node.outputs[outputKey].hidden = this.graph.nodes[nodeIdx].outputs[outputKey].hidden;
      });
    });
  }

  /**
   * Sort code nodes.
   */
  sortNodes(): void {
    this.logger.trace("sort nodes");

    const codeGraphStore = useCodeGraphStore();
    if (codeGraphStore.state.autosort) {
      try {
        // Get a list of edges
        const edges = this.connections
          // .filter(
          //   (connection: Connection) =>
          //     this.graph.findNodeById(connection.from.nodeId).outputs.next.id === connection.from.id &&
          //     this.graph.findNodeById(connection.to.nodeId).inputs.prev.id === connection.to.id,
          // )
          .map((connection: Connection) => [connection.from.nodeId, connection.to.nodeId]);

        // Get a list of node
        const nodes = this.nodes.map((node: AbstractCodeNode) => node.id);

        // Get sorted node ids
        const nodeIds = toposort.array(nodes, edges);

        // Update sorted nodes
        this.nodes = nodeIds.map((nodeId: string) => this.graph.findNodeById(nodeId));
      } catch {
        this.logger.warn("Sorting nodes failed.");
      }
    }
  }

  subscribe(): void {
    const codeGraphStore = useCodeGraphStore();
    codeGraphStore.subscribe(this.onUpdate);
  }

  unsubscribe(): void {
    const codeGraphStore = useCodeGraphStore();
    codeGraphStore.unsubscribe();
  }
}
