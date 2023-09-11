// networkGraph.ts

import { Ref } from "vue";

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";

import { NESTModelAssignGraph } from "../model/modelAssignGraph";
import { NESTNetwork } from "./network";

export class NESTNetworkGraph extends BaseNetworkGraph {
  private _modelAssignGraph: NESTModelAssignGraph;

  constructor(ref: Ref<null>, network: NESTNetwork) {
    super(ref, network);
    this._modelAssignGraph = new NESTModelAssignGraph(this);
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  /**
   * Render network graph.
   */
  render(): void {
    this.logger.silly("render");
    this._modelAssignGraph.render();
    this.connectionGraph.render();
    this.nodeGraph.render();
  }

  /**
   * Update network graph.
   *
   * @remarks
   * This function should be called when the network is changed.
   */
  update(): void {
    this.logger.silly("update");
    this.workspace.update();
    this._modelAssignGraph.update();
    this.connectionGraph.update();
    this.nodeGraph.update();
  }
}
