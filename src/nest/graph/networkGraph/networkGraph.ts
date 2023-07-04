// networkGraph.ts

import { ILogObj, Logger } from "tslog";
import { Ref, watch } from "vue";
import { Selection, select } from "d3";

import { logger as mainLogger } from "@/utils/logger";

import { ConnectionGraph } from "../connectionGraph";
import { ModelAssignGraph } from "../modelAssignGraph";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { Node } from "@nest/core/node/node";
import { NodeGraph } from "../nodeGraph/nodeGraph";
import { debounce } from "@/utils/events";
import { Network } from "@/nest/core/network/network";

export class NetworkGraph {
  private _config: any = {
    nodeRadius: 24,
    strokeWidth: 3,
    transparentWorkspace: true,
  };
  private _connectionGraph: ConnectionGraph;
  private _logger: Logger<ILogObj>;
  private _modelAssignGraph: ModelAssignGraph;
  private _network: Network;
  private _nodeGraph: NodeGraph;
  private _selector?: Selection<any, any, any, any>;
  private _workspace: NetworkGraphWorkspace;
  private _resizeObserver: ResizeObserver;

  constructor(ref: Ref<null>, network: Network) {
    this._selector = select(ref.value);
    this._network = network;

    this._workspace = new NetworkGraphWorkspace(this);
    this._modelAssignGraph = new ModelAssignGraph(this);
    this._connectionGraph = new ConnectionGraph(this);
    this._nodeGraph = new NodeGraph(this);

    this._logger = mainLogger.getSubLogger({
      name: `[${this._network.project.shortId}] network graph`,
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

  get workspace(): NetworkGraphWorkspace {
    return this._workspace;
  }

  /**
   * Call on drag start.
   */
  dragStart(event: any): void {
    this._workspace.state.dragging = true;
    if (event.sourceEvent.srcElement.parentNode instanceof Node) {
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
    if (event.sourceEvent.srcElement.parentNode instanceof Node) {
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
      ],
      () => this.render()
    );
    this.update();
  }

  /**
   * Render network graph.
   */
  render(): void {
    this._logger.silly("render");
    this._modelAssignGraph.render();
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
    this._modelAssignGraph.update();
    this._connectionGraph.update();
    this._nodeGraph.update();
  }
}
