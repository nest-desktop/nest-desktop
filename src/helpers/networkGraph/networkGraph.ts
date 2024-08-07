// networkGraph.ts

import { Selection, select } from "d3";
import { Ref, UnwrapRef, reactive, watch } from "vue";

import { TConnection, TNetwork, TNode } from "@/types";
import { debounce } from "@/utils/events";

import { BaseObj } from "../common/base";
import { ConnectionGraph } from "../connectionGraph/connectionGraph";
import { BaseNode } from "../node/node";
import { NodeGraph } from "../nodeGraph/nodeGraph";
import { NodeGroupGraph } from "../nodeGraph/nodeGroupGraph";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";

interface IBaseNetworkGraphState {
  hash: string;
  nodeMenu: {
    node: TNode | null;
    offset: number[];
    open: boolean;
  };
}

export class BaseNetworkGraph extends BaseObj {
  private _connectionGraph: ConnectionGraph;
  public _network: TNetwork;
  private _nodeGraph: NodeGraph;
  private _nodeGroupGraph: NodeGroupGraph;
  private _resizeObserver: ResizeObserver;
  private _selector: Selection<any, any, null, undefined>;
  private _state: UnwrapRef<IBaseNetworkGraphState>;
  private _workspace: NetworkGraphWorkspace;

  constructor(ref: Ref<HTMLElement | null>, network: TNetwork) {
    super({
      config: { name: "NetworkGraph" },
      logger: { settings: { minLevel: 3 } },
    });

    this._selector = select(ref.value);
    this._network = network;

    this._workspace = new NetworkGraphWorkspace(this);
    this._connectionGraph = new ConnectionGraph(this);
    this._nodeGraph = new NodeGraph(this);
    this._nodeGroupGraph = new NodeGroupGraph(this);

    this._state = reactive<IBaseNetworkGraphState>({
      hash: "",
      nodeMenu: {
        node: null,
        offset: [0, 0],
        open: false,
      },
    });

    this._resizeObserver = new ResizeObserver(
      debounce(() => {
        this._workspace.updateTransform();
      })
    );
  }

  get connectionGraph(): ConnectionGraph {
    return this._connectionGraph;
  }

  get network(): TNetwork {
    return this._network;
    // const projectStore: TProjectStore = useProjectStore();
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

  get selector(): Selection<any, any, null, undefined> {
    return this._selector;
  }

  get state(): UnwrapRef<IBaseNetworkGraphState> {
    return this._state;
  }

  get workspace(): NetworkGraphWorkspace {
    return this._workspace;
  }

  /**
   * Call on drag start.
   * @param event mouse event
   */
  dragStart(event: MouseEvent | any): void {
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
  dragEnd(event: MouseEvent | any): void {
    this._workspace.state.dragging = false;
    // If-clause to prevent the error message
    // when mouseup happens outside the window.
    if (event.sourceEvent.srcElement.parentNode instanceof BaseNode) {
      select(event.sourceEvent.srcElement.parentNode).classed("active", false);
      select(event.sourceEvent.srcElement).style("cursor", "pointer");
    }
    if (this.network) {
      this.network.clean();
    }

    this._workspace?.updateTransform();
  }

  /**
   * Initialize network graph.
   */
  init(): void {
    this.logger.trace("init");

    this._workspace?.init();
    this.update();

    watch(
      () => [
        this.network.nodes.state.focusedNode,
        this.network.connections.state.focusedConnection,
        this.network.connections.state.selectedNode,
        this.hash,
      ],
      () => this.render()
    );

    watch(
      () => [
        this.network.nodes.all.length,
        this.network.connections.all.length,
      ],
      () => this.update()
    );
  }

  /**
   * Render network graph.
   */
  render(): void {
    this.logger.silly("render");

    this._connectionGraph.render();
    this._nodeGraph.render();
    this._nodeGroupGraph.render();
  }

  /**
   * Reset state of network graph.
   */
  reset(): void {
    this._state.nodeMenu.open = false;
    this._state.nodeMenu.offset = [0, 0];
    this._state.nodeMenu.node = null;
  }

  /**
   * Update network graph.
   *
   * @remarks
   * This function should be called when the network is changed.
   */
  update(): void {
    this.logger.silly("update");

    this._workspace.update();

    this._connectionGraph.update();
    this._nodeGraph.update();
    this._nodeGroupGraph.update();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      nodes: this.network.nodes.nodeItems.map((node: TNode) => ({
        color: node.view.state.color,
        idx: node.idx,
        model: node.modelId,
        size: node.size,
      })),
      connections: this.network.connections.all.map(
        (connection: TConnection) => connection.idx
      ),
    });
  }
}
