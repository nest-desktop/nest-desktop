// networkGraph.ts

import type { Ref } from "vue";

import { BaseNetworkGraph } from "@/networkGraph";

import { NESTNetwork } from "../network";

import { NESTModelAssignGraph } from "./helpers/modelAssignGraph";
import { NESTConnectionGraph } from "./helpers/connectionGraph";
import { NESTNodeGraph } from "./helpers/nodeGraph";

export class NESTNetworkGraph extends BaseNetworkGraph<NESTNetwork> {
  private _modelAssignGraph: NESTModelAssignGraph;

  constructor(ref: Ref<null>, network: NESTNetwork) {
    super(ref, network);

    this._connectionGraph = new NESTConnectionGraph(this);
    this._modelAssignGraph = new NESTModelAssignGraph(this);
    this._nodeGraph = new NESTNodeGraph(this);
  }

  get connectionGraph(): NESTConnectionGraph {
    return this._connectionGraph as NESTConnectionGraph;
  }

  get modelAssignGraph(): NESTModelAssignGraph {
    return this._modelAssignGraph;
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  /**
   * Render network graph.
   */
  override render(): void {
    this.logger.silly("render");

    this.modelAssignGraph.render();
    this.connectionGraph.render();
    this.nodeGraph.render();
    // this.nodeGroupGraph.render();
  }

  /**
   * Update network graph.
   *
   * @remarks
   * This function should be called when the network is changed.
   */
  override update(): void {
    this.logger.trace("update");

    this.network.updateStyle();

    this.workspace.update();

    this.modelAssignGraph.update();
    this.connectionGraph.update();
    this.nodeGraph.update();
    // this.nodeGroupGraph.update();
  }
}
