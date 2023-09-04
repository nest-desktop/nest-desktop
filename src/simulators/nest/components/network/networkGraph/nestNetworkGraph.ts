// networkGraph.ts

import { Ref } from "vue";

import { BaseNetworkGraph } from "@/components/network/networkGraph/baseNetworkGraph";

import { NESTNetwork } from "@nest/components/network/nestNetwork";
import { NESTModelAssignGraph } from "@nest/components/model/nestModelAssignGraph";

export class NESTNetworkGraph extends BaseNetworkGraph {
  private _modelAssignGraph: NESTModelAssignGraph;

  constructor(ref: Ref<null>, network: NESTNetwork) {
    super(ref, network);
    this._modelAssignGraph = new NESTModelAssignGraph(this);
  }

  get network(): NESTNetwork {
    return this.baseNetwork as NESTNetwork;
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
