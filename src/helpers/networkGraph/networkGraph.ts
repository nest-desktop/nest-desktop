// networkGraph.ts

import { ILogObj, Logger } from "tslog";
import { Ref, UnwrapRef, reactive, watch } from "vue";
import { Selection, select } from "d3";

import { BaseNode } from "@/helpers/node/node";
import { Connection } from "@/types/connectionTypes";
import { ConnectionGraph } from "@/helpers/connectionGraph/connectionGraph";
import { Network } from "@/types/networkTypes";
import { NetworkGraphWorkspace } from "@/helpers/networkGraph/networkGraphWorkspace";
import { Node } from "@/types/nodeTypes";
import { NodeGraph } from "@/helpers/nodeGraph/nodeGraph";
import { debounce } from "@/utils/events";
import { logger as mainLogger } from "@/helpers/common/logger";
import { sha1 } from "object-hash";
import { truncate } from "@/utils/truncate";

interface BaseNetworkGraphState {
  hash: string;
}

export class BaseNetworkGraph {
  private _config = {
    nodeRadius: 24,
    strokeWidth: 3,
    transparentWorkspace: true,
  };
  private _connectionGraph: ConnectionGraph;
  private _logger: Logger<ILogObj>;
  public _network: Network;
  private _nodeGraph: NodeGraph;
  private _resizeObserver: ResizeObserver;
  private _selector?: Selection<any, any, any, any>;
  private _state: UnwrapRef<BaseNetworkGraphState>;
  private _workspace: NetworkGraphWorkspace;

  constructor(ref: Ref<null>, network: Network) {
    this._selector = select(ref.value);
    this._network = network;

    this._workspace = new NetworkGraphWorkspace(this);
    this._connectionGraph = new ConnectionGraph(this);
    this._nodeGraph = new NodeGraph(this);

    this._logger = mainLogger.getSubLogger({
      name: `[${this.network.project.shortId}] network graph`,
      minLevel: 3,
    });

    this._state = reactive({
      hash: "xxx",
    });

    this._resizeObserver = new ResizeObserver(
      debounce(() => {
        this._workspace.updateTransform();
      })
    );
  }

  get config(): any {
    return this._config;
  }

  get connectionGraph(): ConnectionGraph {
    return this._connectionGraph;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get network(): Network {
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

  get state(): UnwrapRef<BaseNetworkGraphState> {
    return this._state;
  }

  get workspace(): NetworkGraphWorkspace {
    return this._workspace;
  }

  /**
   * Call on drag start.
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
    this._logger.trace("init");
    this._workspace.init();

    watch(
      () => [
        this.network.nodes.state.selectedNode,
        this.network.nodes.state.focusedNode,
        this.network.connections.state.focusedConnection,
        this._state.hash,
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
    this._logger.silly("render");
    this._connectionGraph.render();
    this._nodeGraph.render();
  }

  /**
   * Update network graph.
   *
   * @remarks
   * This function should be called when the network is changed.
   */
  update(): void {
    this._logger.silly("update");
    this._workspace.update();
    this._connectionGraph.update();
    this._nodeGraph.update();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._state.hash = truncate(
      sha1({
        nodes: this.network.nodes.all.map((node: Node) => node.state.graphHash),
        connections: this.network.connections.all.map(
          (connection: Connection) => connection.state.graphHash
        ),
      })
    );
  }
}
