// networkGraph.ts

import { select } from "d3";
import { type Ref, type UnwrapRef, nextTick, reactive, watch } from "vue";

import type { TConnection, TNode, TNodeGroup, TSelection } from "@/types";
import { BaseNode, type BaseNetwork } from "@/network";
import { BaseObj } from "@/core";
import { debounce } from "@/utils";

import { ConnectionGraph } from "../connectionGraph";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { NodeGraph, NodeGroupGraph } from "../nodeGraph";

interface IBaseNetworkGraphState {
  contextMenu: {
    connection: TConnection | null;
    modelValue: boolean;
    node: TNode | null;
    nodeGroup: TNodeGroup | null;
    target: [x: number, y: number];
  };
  hash: string;
}

export class BaseNetworkGraph<TNetwork extends BaseNetwork = BaseNetwork> extends BaseObj {
  private _nodeGroupGraph: NodeGroupGraph;
  private _resizeObserver: ResizeObserver;
  private _selector: TSelection;
  private _state: UnwrapRef<IBaseNetworkGraphState> = reactive<IBaseNetworkGraphState>({
    contextMenu: {
      connection: null,
      modelValue: false,
      node: null,
      nodeGroup: null,
      target: [0, 0], // "cursor" for v-menu doesn't work.
    },
    hash: "",
  });
  private _workspace: NetworkGraphWorkspace;
  public _connectionGraph: ConnectionGraph;
  public _nodeGraph: NodeGraph;
  public _network: TNetwork;

  constructor(ref: Ref<HTMLElement | null>, network: TNetwork) {
    super({
      config: { name: "NetworkGraph" },
    });

    this._selector = select(ref.value);
    this._network = network;

    this._workspace = new NetworkGraphWorkspace(this);
    this._connectionGraph = new ConnectionGraph(this);
    this._nodeGraph = new NodeGraph(this);
    this._nodeGroupGraph = new NodeGroupGraph(this);

    this._resizeObserver = new ResizeObserver(debounce(() => this._workspace.updateTransform()));
  }

  get connectionGraph(): ConnectionGraph {
    return this._connectionGraph;
  }

  // override get hashObject(): IBaseState {
  //   return {
  //     nodes: this.network.nodes.nodeItems.map((node: TNode) => ({
  //       color: node.view.state.color,
  //       idx: node.idx,
  //       model: node.modelId,
  //       size: node.size.value,
  //     })),
  //     connections: this.network.connections.all.map((connection: TConnection) => connection.idx),
  //   };
  // }

  get network(): TNetwork {
    return this._network;
    // const projectStore = useProjectStore();
    // return projectStore.state.project.network;
  }

  get nodeGraph(): NodeGraph {
    return this._nodeGraph;
  }

  get nodeGroupGraph(): NodeGroupGraph {
    return this._nodeGroupGraph;
  }

  get resizeObserver(): ResizeObserver {
    return this._resizeObserver;
  }

  get selector(): TSelection {
    return this._selector;
  }

  get state(): UnwrapRef<IBaseNetworkGraphState> {
    return this._state;
  }

  get workspace(): NetworkGraphWorkspace {
    return this._workspace;
  }

  /**
   * Close context menu.
   */
  closeContextMenu(): void {
    this._state.contextMenu = {
      modelValue: false,
      connection: null,
      node: null,
      nodeGroup: null,
      target: [0, 0],
    };
  }

  /**
   * Call on drag start.
   * @param event mouse event
   */
  dragStart(event: MouseEvent): void {
    this._workspace.state.dragging = true;
    if (event.sourceEvent.srcElement.parentNode instanceof BaseNode) {
      select(event.sourceEvent.srcElement.parentNode).classed("active", true);
      select(event.sourceEvent.srcElement).style("cursor", "grabbing");
    }
  }

  /**
   * Call on drag end.
   * @param event mouse event
   */
  dragEnd(event: MouseEvent): void {
    this._workspace.state.dragging = false;
    // If-clause to prevent the error message
    // when mouseup happens outside the window.
    if (event.sourceEvent.srcElement.parentNode instanceof BaseNode) {
      select(event.sourceEvent.srcElement.parentNode).classed("active", false);
      select(event.sourceEvent.srcElement).style("cursor", "pointer");
    }
    if (this.network) this.network.clean();

    this._workspace?.updateTransform();
  }

  /**
   * Initialize network graph.
   */
  init(): void {
    this.logger.trace("init");

    this.workspace?.init();
    this.update();

    watch(
      () => [
        this.network.nodes.state.focusedNode,
        this.network.connections.state.focusedConnection,
        this.network.connections.state.selectedNode,
      ],
      () => nextTick(() => this.render()),
    );

    watch(
      () => [this.network.nodes.length, this.network.connections.length],
      () => this.update(),
    );
  }

  /**
   * Open contect menu
   * @param target position of mouse
   * @param props network props
   */
  openContextMenu(
    target: [number, number],
    props: { connection?: TConnection; node?: TNode; nodeGroup?: TNodeGroup },
  ): void {
    this.logger.trace("open context menu");

    if (this.state.contextMenu.modelValue) {
      this.state.contextMenu.modelValue = false;
      setTimeout(() => this.openContextMenu(target, props), 200);
      return;
    }

    this.state.contextMenu.connection = (props.connection as TConnection) || null;
    this.state.contextMenu.node = (props.node as TNode) || null;
    this.state.contextMenu.nodeGroup = (props.nodeGroup as TNodeGroup) || null;

    this.state.contextMenu.target = target;
    this.state.contextMenu.modelValue = true;
  }

  /**
   * Render network graph.
   */
  render(): void {
    this.logger.silly("render");

    this.connectionGraph.render();
    this.nodeGraph.render();
    this.nodeGroupGraph.render();
  }

  /**
   * Reset state of network graph.
   */
  resetState(): void {
    this.state.contextMenu.modelValue = false;
  }

  /**
   * Update network graph.
   * @remarks This function should be called when the network is changed.
   */
  update(): void {
    this.logger.trace("update");

    this.network.updateStyle();
    this.workspace.update();

    this.connectionGraph.update();
    this.nodeGraph.update();
    this.nodeGroupGraph.update();
  }
}
