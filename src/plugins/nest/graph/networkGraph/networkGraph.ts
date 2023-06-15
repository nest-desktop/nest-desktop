// networkGraph.ts

import { Ref } from "vue";
import * as d3 from "d3";

import { ConnectionGraph } from "../connectionGraph";
import { ModelAssignGraph } from "../modelAssignGraph";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { Node } from "@nest/core/node/node";
import { NodeGraph } from "../nodeGraph/nodeGraph";
import { useProjectStore } from "@nest/store/project/projectStore";

export class NetworkGraph {
  private _config: any = {
    nodeRadius: 24,
    strokeWidth: 3,
    transparentWorkspace: true,
  };
  private _connectionGraph: ConnectionGraph;
  private _modelAssignGraph: ModelAssignGraph;
  private _nodeGraph: NodeGraph;
  private _selector: d3.Selection<any, any, any, any>;
  private _workspace: NetworkGraphWorkspace;

  constructor(ref: Ref<null>) {
    this._selector = d3.select(ref.value);

    this._workspace = new NetworkGraphWorkspace(this);
    this._modelAssignGraph = new ModelAssignGraph(this);
    this._connectionGraph = new ConnectionGraph(this);
    this._nodeGraph = new NodeGraph(this);
  }

  get config(): any {
    return this._config;
  }

  get network(): any {
    const projectStore = useProjectStore();
    return projectStore.project.network;
  }

  get nodeGraph(): NodeGraph {
    return this._nodeGraph;
  }

  get selector(): d3.Selection<any, any, any, any> {
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
      d3.select(event.sourceEvent.srcElement.parentNode).classed(
        "active",
        true
      );
      d3.select(event.sourceEvent.srcElement).style("cursor", "grabbing");
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
      d3.select(event.sourceEvent.srcElement.parentNode).classed(
        "active",
        false
      );
      d3.select(event.sourceEvent.srcElement).style("cursor", "pointer");
    }
    if (this.network) {
      this.network.clean();
    }
    this._workspace.updateTransform();
  }

  init(): void {
    this.update();
    this.observeSize();
  }

  /**
   * Render network graph.
   */
  render(): void {
    // console.log("Render network graph of " + this._network.project.shortId);
    this._modelAssignGraph.render();
    this._connectionGraph.render();
    this._nodeGraph.render();
  }

  /**
   * Observe size changing in graph layout.
   */
  observeSize(): void {
    const resizeObserver = new ResizeObserver(() => {
      this._workspace.updateTransform();
    });
    // @ts-ignore
    resizeObserver.observe(this._selector.node().parentNode);
  }

  /**
   * Update network graph.
   *
   * @remarks
   * This function should be called when the network is changed.
   */
  update(): void {
    // console.log("Update network graph of " + this._network.project.shortId);

    this._workspace.update();
    this._modelAssignGraph.update();
    this._connectionGraph.update();
    this._nodeGraph.update();
  }
}
