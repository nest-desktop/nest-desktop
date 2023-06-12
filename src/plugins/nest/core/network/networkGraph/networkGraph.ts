// networkGraph.ts
import * as d3 from "d3";

import { ConnectionGraph } from "../../connection/connectionGraph";
import { ModelAssignGraph } from "../../model/modelGraph/modelAssignGraph";
import { Network } from "../network";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { Node } from "../../node/node";
import { NodeGraph } from "../../node/nodeGraph/nodeGraph";

export class NetworkGraph {
  private _config: any = {
    nodeRadius: 24,
    strokeWidth: 3,
    transparentWorkspace: true,
  };
  private _connectionGraph: ConnectionGraph;
  private _modelAssignGraph: ModelAssignGraph;
  private _network: Network | undefined;
  private _nodeGraph: NodeGraph;
  private _selector: d3.Selection<any, any, any, any>;
  private _workspace: NetworkGraphWorkspace;

  constructor(selector: string, network: Network) {
    this._selector = d3.select(selector);
    this._network = network;

    this._workspace = new NetworkGraphWorkspace(this);
    this._modelAssignGraph = new ModelAssignGraph(this);
    this._connectionGraph = new ConnectionGraph(this);
    this._nodeGraph = new NodeGraph(this);
  }

  get config(): any {
    return this._config;
  }

  get network(): Network | undefined {
    return this._network;
  }

  set network(value: Network | undefined) {
    this._network = value;
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
      ); // .raise();
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
    if (this._network) {
      this._network.clean();
    }
    this._workspace.updateTransform();
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
   * Update network graph.
   *
   * @remarks
   * This function should be called when the network is changed.
   */
  update(network: Network | undefined = undefined): void {
    // console.log("Update network graph of " + this._network.project.shortId);
    if (network) {
      this._network = network;
    }

    this._workspace.update();
    this._modelAssignGraph.update();
    this._connectionGraph.update();
    this._nodeGraph.update();
  }

  /**
   * Resize graph.
   */
  resize(width: number, height: number): void {
    this._selector.attr("width", width).attr("height", height);
  }
}
