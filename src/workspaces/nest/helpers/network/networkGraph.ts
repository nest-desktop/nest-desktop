// networkGraph.ts

import { Ref } from "vue";

import { BaseNetworkGraph } from "@/helpers/networkGraph/networkGraph";

import { NESTModelAssignGraph } from "../model/modelAssignGraph";
import { NESTNetwork } from "./network";
import { NESTConnectionGraph } from "../connection/connectionGraph";
import { NESTNodeGraph } from "../node/nodeGraph";

export class NESTNetworkGraph extends BaseNetworkGraph {
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
    this.nodeGroupGraph.render();
  }

  /**
   * Update network graph.
   *
   * @remarks
   * This function should be called when the network is changed.
   */
  override update(): void {
    this.logger.trace("update");

    this.workspace.update();

    this.modelAssignGraph.update();
    this.connectionGraph.update();
    this.nodeGraph.update();
    this.nodeGroupGraph.update();
  }
}
