// networkGraphDragline.ts

import * as d3 from 'd3';
import drawPath from '@/helpers/graph/connectionGraphPath';

import { Network } from '@nest/core/network/network';
import { NetworkGraphWorkspace } from './networkGraphWorkspace';
import { Node } from '@nest/core/node/node';

export class NetworkGraphDragline {
  private _workspace: NetworkGraphWorkspace;

  constructor(networkGraphWorkspace: NetworkGraphWorkspace) {
    this._workspace = networkGraphWorkspace;
  }

  get network(): Network | undefined {
    return this._workspace.networkGraph.network;
  }

  /**
   * Initialize drag line.
   */
  init(e: MouseEvent): void {
    this._workspace.state.enableConnection = true;
    this.update(e);
    this._workspace.update();
  }

  /**
   * Update drag line.
   */
  update(e: MouseEvent): void {
    if (this.network && this.network.state.selectedNode != null) {
      const selectedNode: Node = this.network.state.selectedNode;
      const sourcePosition: any = selectedNode.view.position;
      const position: number[] = d3.pointer(e, this._workspace.selector.node());
      const targetPosition: any = {
        x: position[0],
        y: position[1],
      };

      this._workspace.selector
        .select('.dragline')
        .style('opacity', 0.5)
        .style('stroke', selectedNode.view.color)
        .attr(
          'd',
          drawPath(sourcePosition, targetPosition, {
            isTargetMouse: true,
          })
        );
    } else {
      console.log('No node was selected when dragLine() got executed!');
    }
  }

  /**
   * Draw path of the drag line.
   */
  drawPath(sourcePos: any, targetPos: any, options: any = {}): void {
    this._workspace.selector
      .select('.dragline')
      .style('opacity', 1)
      .attr('d', drawPath(sourcePos, targetPos, options));
  }

  /**
   * Hide drag line.
   */
  hide(): void {
    this._workspace.selector
      .select('.dragline')
      .style('opacity', 0)
      .attr('d', 'M0,0L0,0');
  }
}
