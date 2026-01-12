// nodeSpatial.ts

import { BaseObj, type IBaseState } from "@/core";

import { FreePositions } from "./freePositions";
import { GridPositions, type IGridPositionsState } from "./gridPositions";
import type { IBasePositionsState } from "./basePositions";
import type { NESTNode } from "../node";
import { updateNESTSpatialNode } from "@/workspaces/nest/codeNodeTypes/nest";

export interface INESTNodeSpatialState extends IBaseState {
  positions?: string;
  specs?: IBasePositionsState | IGridPositionsState;
}

export class NESTNodeSpatial extends BaseObj<INESTNodeSpatialState> {
  private _node: NESTNode;

  constructor(node: NESTNode) {
    super({
      config: { name: "NESTNodeSpatial", simulator: "nest" },
    });

    this._node = node;
  }

  get hasGridPositions(): boolean {
    return this.positions?.name === "grid";
  }

  get hasPositions(): boolean {
    return this.positions != undefined;
  }

  get node(): NESTNode {
    return this._node;
  }

  get positions(): FreePositions | GridPositions | undefined {
    const spatialNode = this.node.codeNode.getConnectedNodeByInterface("positions", "input");
    if (!spatialNode) return;
    return spatialNode.mask;
  }

  // changes(): void {
  //   this._node.changes();
  // }

  /**
   * Load spatial node from state.
   * @param state spatial node state
   */
  load(state: INESTNodeSpatialState = {}): void {
    console.log("load node spatial");

    const spatialNode = updateNESTSpatialNode(this.node.codeNode.graph, this.node.codeNode, state);
    if (!spatialNode) return;

    const positions = this.newPositions(state?.positions);
    if (positions) {
      positions.registerCodeNode(spatialNode);
      positions?.load(state?.specs);
    }
  }

  /**
   * Create new positions instance.
   * @param positions string
   */
  newPositions(positionsName: string | undefined): FreePositions | GridPositions | undefined {
    switch (positionsName) {
      case "free":
        return new FreePositions(this);
      case "grid":
        return new GridPositions(this);
    }
  }

  /**
   * Save spatial node to state.
   * @return spatial node state
   */
  override save(): INESTNodeSpatialState {
    const state: INESTNodeSpatialState = {};
    if (this.positions) {
      state.positions = this.positions.name;
      state.specs = this.positions.save();
    }
    return state;
  }

  /**
   * Toggle positions.
   */
  togglePositions(): void {
    let state: INESTNodeSpatialState = {};

    if (!this.hasPositions) {
      state = {
        positions: this.node.size === 1 ? "grid" : "free",
        specs: { numDimensions: 2 },
      };
    }

    this.load(state);
  }
}
