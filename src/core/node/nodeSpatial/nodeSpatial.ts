import { sha1 } from 'object-hash';

import { Config } from '../../common/config';
import { FreePositions } from './freePositions';
import { GridPositions } from './gridPositions';
import { Node } from '../node';

export class NodeSpatial extends Config {
  private _hash: string;
  private _node: Node;
  private _positions: FreePositions | GridPositions | undefined;

  constructor(node: Node, spatial: any) {
    super('NodeSpatial');
    this._node = node;
    this.init(spatial);
  }

  get code(): string {
    return this.positions ? this.positions.toCode() : '';
  }

  get hash(): string {
    return this._hash;
  }

  get node(): Node {
    return this._node;
  }

  get positions(): FreePositions | GridPositions | undefined {
    return this._positions;
  }

  /**
   * Update hash of the spatial node.
   */
  updateHash(): void {
    this._hash = sha1(JSON.stringify(this.toJSON()));
  }

  /**
   * Initialize spatial node.
   */
  init(spatial: any): void {
    if (spatial != undefined) {
      switch (spatial.positions) {
        case 'free':
          this._positions = new FreePositions(this, spatial.specs);
          break;
        case 'grid':
          this._positions = new GridPositions(this, spatial.specs);
          break;
        default:
          this._positions = undefined;
      }
    } else {
      this._positions = undefined;
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
  toJSON(): any {
    let spatial: any;
    if (this._positions == undefined) {
      spatial = {};
    } else {
      spatial = {
        positions: this._positions.name,
        specs: this._positions.toJSON(),
      };
    }
    return spatial;
  }
}
