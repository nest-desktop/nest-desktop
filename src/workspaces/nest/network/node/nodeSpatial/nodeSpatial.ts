// nodeSpatial.ts

import { BaseObj, type IBaseState } from "@/core";

import { FreePositions } from "./freePositions";
import { GridPositions, type IGridPositionsState } from "./gridPositions";
import type { IBasePositionsState } from "./basePositions";
import type { NESTNode } from "../node";

export interface INESTNodeSpatialState extends IBaseState {
  positions?: string;
  specs?: IBasePositionsState | IGridPositionsState;
}

export class NESTNodeSpatial extends BaseObj<INESTNodeSpatialState> {
  private _node: NESTNode;
  private _positions: FreePositions | GridPositions | undefined;

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
    return this._positions;
  }

  changes(): void {
    this._node.changes();
  }

  /**
   * Load spatial node from state.
   * @param state spatial node state
   */
  load(state: INESTNodeSpatialState): void {
    this.updatePositions(state.positions);
    this.positions?.load(state.specs);
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
   * Update Positions instance.
   * @param positions string
   */
  updatePositions(positions: string | undefined): void {
    switch (positions) {
      case "free":
        this._positions = new FreePositions(this);
        break;
      case "grid":
        this._positions = new GridPositions(this);
        break;
      default:
        this._positions = undefined;
        break;
    }
  }
}
