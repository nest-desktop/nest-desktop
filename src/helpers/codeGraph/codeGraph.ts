// codeGraph.ts

import { Connection, Graph, IEditorState, IGraphState, NodeInterface } from "baklavajs";
import { nextTick, reactive, UnwrapRef } from "vue";
import toposort from "toposort";

import { truncate } from "@/utils/truncate";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import { AbstractCodeNode } from "./codeNode";
import { BaseCode } from "../code/code";
import { BaseObj } from "../common/base";

interface ICodeGraphState {
  editor: IEditorState | null;
  // graph?: IGraphState | null;
  token: symbol | null;
}

export class CodeGraph extends BaseObj {
  codeGraphStore = useCodeGraphStore();

  public _code: BaseCode | null;
  // private _graph: Graph = new Graph(new Editor());
  private _state: UnwrapRef<ICodeGraphState>;

  constructor(code: BaseCode | null, editorState?: IGraphState) {
    super();
    this.logger.settings.name = `[${this.shortUuid}] code graph`;
    // this.logger.settings.minLevel = 1;

    this._code = code;

    this._state = reactive({
      editor: editorState || null,
      // graph: null,
      token: null,
    });

    this.init();
  }

  get code(): BaseCode | null {
    return this._code;
  }

  get codeNodes(): AbstractCodeNode[] {
    return getCodeNodes(this);
  }

  get connections(): Connection[] {
    return this.graph.connections as Connection[];
  }

  get graph(): Graph {
    return this.codeGraphStore.editor.graph as Graph;
  }

  get modules(): string[] {
    let categories = Array.from(
      new Set(
        this.nodes
          .filter((node: AbstractCodeNode) => node.module?.length > 0)
          .map((node: AbstractCodeNode) => node.module),
      ),
    );

    this.nodes
      .filter((node: AbstractCodeNode) => node.modules?.length > 0)
      .forEach((node: AbstractCodeNode) => {
        categories = categories.concat(node.modules);
      });

    categories.sort();

    return Array.from(new Set(categories.map((category: string) => this.codeGraphStore.state.modules[category])));
  }

  get nodes(): AbstractCodeNode[] {
    return this.graph.nodes as AbstractCodeNode[];
  }

  get nodesSegregated(): AbstractCodeNode[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => !node.state?.integrated) as AbstractCodeNode[];
  }

  get state(): UnwrapRef<ICodeGraphState> {
    return this._state;
  }

  get visibleNodes(): AbstractCodeNode[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => !node.state?.hidden) as AbstractCodeNode[];
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
    if (this.code) node.code = this.code;
    this.graph.addNode(node);
  }

  /**
   * Add code node at specific column.
   * @param nodeType
   * @param col column
   * @param offset number
   * @param props optional
   * @returns Abstract code node
   */
  addNodeAtColumn(
    nodeType: new () => AbstractCodeNode,
    col: number = 0,
    offset: number = 100,
    props?: unknown,
  ): AbstractCodeNode {
    const left = 300;
    const width = 350;
    const space = 70;

    const node = new nodeType();
    if (props) node.state.props = props;

    this.addNode(node);
    if (node.position) {
      node.position.x = left + col * (width + space);
      node.position.y = offset;
    }

    return node;
  }

  /**
   * Add code node at coordinates.
   * @param nodeType
   * @param position
   * @param props optional
   * @returns Abstract code node
   */
  addNodeAtCoordinates(
    nodeType: new () => AbstractCodeNode,
    position: { x: number; y: number } = { x: 0, y: 0 },
    props?: unknown,
  ): AbstractCodeNode {
    const node = new nodeType();
    if (props) node.state.props = props;

    this.addNode(node);
    if (node.position) node.position = position;

    return node;
  }

  /**
   * Clear code graph.
   */
  clear(): void {
    this.unsubscribe();
    this.graph._nodes = [];
    this.graph._connections = [];
    this.subscribe();
  }

  findNodeById(id: string): AbstractCodeNode | undefined {
    return this.graph.findNodeById(id) as AbstractCodeNode;
  }

  findNodeByType(nodeType: string): AbstractCodeNode | undefined {
    return this.codeNodes.find((node: AbstractCodeNode) => node.type === nodeType);
  }

  getNodesBySameType(type: string): AbstractCodeNode[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => node.type === type) as AbstractCodeNode[];
  }

  getNodesBySameVariableNames(variableName: string): AbstractCodeNode[] {
    return this.codeNodes.filter((node: AbstractCodeNode) => node.variableName === variableName) as AbstractCodeNode[];
  }

  /**
   * Initialize code graph.
   */
  init(): void {
    this.logger.trace("init");

    if (this.state.token) this.graph.editor.graphEvents.beforeAddNode.unsubscribe(this.state.token);
    this.state.token = Symbol("token");
    this.graph.editor.graphEvents.beforeAddNode.subscribe(this.state.token, (node: AbstractCodeNode) => {
      if (this.code) node.code = this.code;
    });

    this.subscribe();
  }

  /**
   * Load code graph.
   * @param state graph state.
   */
  load(state: IEditorState): string[] {
    this.logger.trace("load:", truncate(state.graph.id));

    if (!state) return [];
    this.unsubscribe();

    state.graph.id = this.uuid;
    // const warnings: string[] = this.graph.load(state.graph);
    const warnings: string[] = this.codeGraphStore.editor.load(state);

    this.onUpdate();
    this.subscribe();
    return warnings;
  }

  /**
   * Triggers on project update.
   */
  onProjectUpdate = () => {
    this.logger.trace("on project update:", truncate(this.uuid), truncate(this.graph.id));
    if (this.uuid !== this.graph.id) return;

    if (this.nodes.length > 0) {
      this.sortNodes();
      this.codeNodes.forEach((node) => node.onProjectUpdate());
    }

    nextTick(() => {
      try {
        this._state.editor = this.save();
      } catch {
        this.logger.warn("Save editor state failed.");
      }

      this.code?.generate();
    });
  };

  /**
   * Triggers on code graph update.
   */
  onUpdate = () => {
    this.logger.trace("on update:", truncate(this.uuid), truncate(this.graph.id));
    if (this.uuid !== this.graph.id) return;

    if (this.nodes.length > 0) {
      this.sortNodes();
      this.codeNodes.forEach((node) => node.onGraphUpdate());
    }

    nextTick(() => {
      try {
        this._state.editor = this.save();
      } catch {
        this.logger.warn("Save editor state failed.");
      }

      this.code?.generate();
    });
  };

  /**
   * Render node codes.
   */
  renderCodes(): void {
    this.logger.trace("render codes");

    if (this.codeNodes.length === 0) return;
    this.codeNodes.forEach((node) => (node.renderCode ? node.renderCode() : null));
  }

  /**
   * Save code graph.
   * @returns graph state
   */
  save(): IEditorState {
    this.logger.trace("save");

    const editorState = this.codeGraphStore.editor.save();
    editorState.graph.id = this.uuid;

    return JSON.parse(JSON.stringify(editorState));
  }

  /**
   * Sort code nodes.
   */
  sortNodes(): void {
    if (this.nodes.length === 0 || this.connections.length === 0) return;
    this.logger.trace("sort nodes");

    this.unsubscribe();
    const codeGraphStore = useCodeGraphStore();
    if (codeGraphStore.state.autosort) {
      try {
        // Get a list of edges
        const edges: [string, string | undefined][] = this.connections
          // .filter(
          //   (connection: Connection) =>
          //     this.graph.findNodeById(connection.from.nodeId).outputs.node.id === connection.from.id &&
          //     this.graph.findNodeById(connection.to.nodeId).inputs.node.id === connection.to.id,
          // )
          .map((connection: Connection) => [connection.from.nodeId, connection.to.nodeId]);

        // Get a list of node
        const nodes = this.nodes.map((node: AbstractCodeNode) => node.id);

        // Get sorted node ids
        const nodeIds = toposort.array(nodes, edges);

        // Update sorted nodes
        this.graph._nodes = nodeIds.map((nodeId: string) => this.graph.findNodeById(nodeId)) as AbstractCodeNode[];
      } catch {
        this.logger.warn("Sorting nodes failed.");
      }
    }
    this.subscribe();
  }

  subscribe(): void {
    this.logger.trace("subscribe");
    this.codeGraphStore.subscribe(this.onUpdate);
  }

  toJSON(): IEditorState | null {
    return this.state.editor;
  }

  unsubscribe(): void {
    this.logger.trace("unsubscribe");
    this.codeGraphStore.unsubscribe();
  }
}

const getCodeNodes = (graph: CodeGraph | Graph): AbstractCodeNode[] => {
  let nodes: AbstractCodeNode[] = [];

  graph.nodes.forEach((node) => {
    if (node instanceof AbstractCodeNode) {
      nodes.push(node);
    } else if (node.subgraph) {
      nodes = nodes.concat(getCodeNodes(node.subgraph));
    }
  });

  return nodes;
};
