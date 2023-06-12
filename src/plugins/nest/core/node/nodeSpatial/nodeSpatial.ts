// nodeSpatial.ts

import { sha1 } from "object-hash";

import { Config } from "@/helpers/config";
import { FreePositions, FreePositionsProps } from "./freePositions";
import { GridPositions, GridPositionsProps } from "./gridPositions";
import { Node } from "../node";

export interface NodeSpatialProps {
  positions?: string;
  specs?: FreePositionsProps | GridPositionsProps;
}

export class NodeSpatial extends Config {
  private _hash: string = "";
  private _node: Node;
  private _positions: FreePositions | GridPositions | undefined;

  constructor(node: Node, spatial?: NodeSpatialProps) {
    super("NodeSpatial");
    this._node = node;

    if (spatial) {
      this.init(spatial);
    }
  }

  get code(): string {
    // return this.positions ? this.positions.toPythonCode() : '';
    return "";
  }

  get hash(): string {
    return this._hash;
  }

  get node(): Node {
    return this._node;
  }

  // get positions(): FreePositions | GridPositions | undefined {
  //   return this._positions;
  // }

  /**
   * Update hash of the spatial node.
   */
  updateHash(): void {
    this._hash = sha1(JSON.stringify(this.toJSON()));
  }

  /**
   * Initialize spatial node.
   */
  init(spatial: NodeSpatialProps): void {
    switch (spatial.positions) {
      case "free":
        this._positions = new FreePositions(this, spatial.specs);
        break;
      case "grid":
        this._positions = new GridPositions(this, spatial.specs);
        break;
    }
  }

  /**
   * Check if it has positions (free or grid) component.
   */
  get hasPositions(): boolean {
    return this._positions != undefined;
  }

  /**
   * Serialize for JSON.
   * @return spatial object
   */
  toJSON(): NodeSpatialProps {
    const spatial: NodeSpatialProps = {};
    if (this._positions != undefined) {
      spatial.positions = this._positions.name;
      spatial.specs = this._positions.toJSON();
    }
    return spatial;
  }
}
