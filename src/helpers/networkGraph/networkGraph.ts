// networkGraph.ts

import { Ref, UnwrapRef, reactive, watch } from "vue";
import { Selection, select } from "d3";

import { BaseNode } from "../node/node";
import { BaseObj } from "../common/base";
import { ConnectionGraph } from "../connectionGraph/connectionGraph";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { NodeGraph } from "../nodeGraph/nodeGraph";
import { TConnection } from "@/types/connectionTypes";
import { TNetwork } from "@/types/networkTypes";
import { TNode } from "@/types/nodeTypes";
import { debounce } from "@/utils/events";

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
  private _resizeObserver: ResizeObserver;
  private _selector?: Selection<any, any, any, any>;
  private _state: UnwrapRef<IBaseNetworkGraphState>;
  private _workspace: NetworkGraphWorkspace;

  constructor(ref: Ref<null>, network: TNetwork) {
    super({
      config: { name: "NetworkGraph" },
      logger: { settings: { minLevel: 3 } },
    });

    this._selector = select(ref.value);
    this._network = network;

    this._workspace = new NetworkGraphWorkspace(this);
    this._connectionGraph = new ConnectionGraph(this);
    this._nodeGraph = new NodeGraph(this);

    this._state = reactive({
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
    // const projectStore = useProjectStore();
    // return projectStore.project.network;
  }

  get nodeGraph(): NodeGraph {
    return this._nodeGraph;
  }

  get resizeObserver(): ResizeObserver {
    return this._resizeObserver;
  }

  get selector(): Selection<any, any, any, any> | undefined {
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
   * @param event
   */
  dragStart(event: any): void {
    this._workspace.state.dragging = true;
    if (event.sourceEvent.srcElement.parentNode instanceof BaseNode) {
      select(event.sourceEvent.srcElement.parentNode).classed("active", true);
      select(event.sourceEvent.srcElement).style("cursor", "grabbing");
    }
  }

  /**
   * Call on drag end.
   * @param event
   */
  dragEnd(event: any): void {
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
    this._workspace.updateTransform();
  }

  /**
   * Initialize network graph.
   */
  init(): void {
    this.logger.trace("init");
    this._workspace.init();

    watch(
      () => [
        this.network.nodes.state.selectedNode,
        this.network.nodes.state.focusedNode,
        this.network.connections.state.focusedConnection,
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

    this.update();
  }

  /**
   * Render network graph.
   */
  render(): void {
    this.logger.silly("render");
    this._connectionGraph.render();
    this._nodeGraph.render();
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
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      nodes: this.network.nodes.all.map((node: TNode) => ({
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
