// codeGraph.ts

import { Connection, Editor, Graph, IGraphState, NodeInterface } from "baklavajs";
import { reactive, UnwrapRef } from "vue";

import { AbstractCodeNode } from "./codeNode";
import { BaseCode } from "../code/code";
import { BaseObj } from "../common/base";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
import { NodeOutputInterface } from "./interface/nodeOutputInterface";

interface ICodeGraphState {
  graph: IGraphState;
  token: symbol | null;
}

export class CodeGraph extends BaseObj {
  public _code: BaseCode;
  private _state: UnwrapRef<ICodeGraphState>;

  constructor(code: BaseCode, graphProps?: IGraphState) {
    super({
      logger: { settings: { minLevel: 2 } },
    });
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
    this.graph._nodes = values;
  }

  get nodesSegregated(): AbstractCodeNode[] {
    return this.graph.nodes.filter((node: AbstractCodeNode) => !node.state.integrated) as AbstractCodeNode[];
  }

  get state(): UnwrapRef<ICodeGraphState> {
    return this._state;
  }

  get visibleNodes(): AbstractCodeNode[] {
    return this.graph.nodes.filter((node: AbstractCodeNode) => !node.state.hidden) as AbstractCodeNode[];
  }

  addConnection(from: NodeInterface, to: NodeInterface): void {
    from.hidden = false;
    to.hidden = false;
    this.graph.addConnection(from, to);
  }

  addNode(node: AbstractCodeNode): void {
    node.code = this.code;
    this.graph.addNode(node);
  }

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

  addNodeWithCoordinates(nodeType: new () => AbstractCodeNode, x: number, y: number) {
    const node = new nodeType();
    this.addNode(node);
    if (node.position) {
      node.position.x = x;
      node.position.y = y;
    }
    return node;
  }

  clear(): void {
    this.unsubscribe();
    this.nodes = [];
    this.connections = [];
    this.subscribe();
  }

  formatInterfaceLabels(outputInterfaces: NodeOutputInterface[], sorted: boolean = true): string[] {
    const labels: string[] = [];

    outputInterfaces.forEach((outputInterface: NodeOutputInterface) => {
      const node = outputInterface.node as AbstractCodeNode;
      labels.push(node.state.integrated ? node.codeTemplate : outputInterface.label);
    });

    if (sorted) labels.sort();
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

  init(): void {
    this.logger.trace("init");

    if (this.state.token) this.graph.editor.graphEvents.beforeAddNode.unsubscribe(this.state.token);
    this.state.token = Symbol("token");
    this.graph.editor.graphEvents.beforeAddNode.subscribe(this.state.token, (node: AbstractCodeNode) => {
      node.code = this.code;
    });

    // this.nodes.forEach((node) => (node.code = this.code));
  }

  load(): void {
    this.logger.trace("load", this.state.graph.id);

    if (this.graph.id === this.state.graph.id) return;
    this.unsubscribe();
    this.graph.load(this.state.graph);
    this.loadStates();
    this.subscribe();
  }

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

  onUpdate = () => {
    this.code.generate();
    this.save();
  };

  renderCodes(): void {
    if (this.nodes.length === 0) return;
    this.nodes.forEach((node: AbstractCodeNode) => (node.renderCode ? node.renderCode() : null));
  }

  save(): IGraphState {
    this.logger.trace("save");
    const graph = this.graph.save();
    this.saveStates(graph);
    this.state.graph = graph;
    return graph;
  }

  saveStates(graph: IGraphState): void {
    graph.nodes.forEach((node, nodeIdx) => {
      const integrated = this.graph.nodes[nodeIdx].state.integrated;
      if (integrated) node.integrated = integrated;

      Object.entries(node.inputs).forEach(([inputKey, _]) => {
        node.inputs[inputKey].hidden = this.graph.nodes[nodeIdx].inputs[inputKey].hidden;
      });

      Object.entries(node.outputs).forEach(([outputKey, _]) => {
        node.outputs[outputKey].hidden = this.graph.nodes[nodeIdx].outputs[outputKey].hidden;
      });
    });
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
