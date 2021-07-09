import * as d3 from 'd3';

import { Connection } from './connection';
import { NetworkGraph } from '../network/networkGraph';

export class ConnectionGraph {
  private _networkGraph: NetworkGraph;
  private _selector: d3.Selection<any, any, any, any>;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
    this._selector = networkGraph.selector.select('g#connections');
  }

  /**
   * Initialize connection graph.
   *
   * @remark It is only been executed in networkGraph.init().
   * For changing in connection graph, use update.
   */
  init(idx: number, elements: SVGGElement[] | ArrayLike<SVGGElement>): void {
    // console.log('Init connection graph');
    const elem: d3.Selection<any, any, any, any> = d3.select(elements[idx]);

    elem
      .on('mouseover', (_, connection: Connection) => {
        connection.view.focus();
        this._networkGraph.update();
      })
      .on('mouseout', () => {
        this._networkGraph.network.view.resetFocus();
        this._networkGraph.update();
      })
      .on('click', (_, connection: Connection) => {
        if (this._networkGraph.network.view.selectedConnection === connection) {
          this._networkGraph.reset();
        } else {
          this._networkGraph.reset();
          connection.view.select();
        }
        connection.view.focus();
        this._networkGraph.update();
      });

    elem.selectAll('*').remove();
    elem
      .append('path')
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('opacity', 0)
      .style('stroke-width', 40);

    elem
      .append('path')
      .attr('class', 'color')
      .style('fill', 'none')
      .style('stroke-width', this._networkGraph.strokeWidth)
      .style('pointer-events', 'none');
  }

  /**
   * Update connection graph.
   */
  update() {
    // console.log('Update connection graph');
    const duration: number = this._networkGraph.state.dragging ? 0 : 250;
    const t: d3.Transition<any, any, any, any> = d3
      .transition()
      .duration(duration);

    // update connection path
    this._selector.selectAll('g.connection').transition(t).style('opacity', 1);

    this._selector
      .selectAll('g.connection')
      .selectAll('path.color')
      .style('stroke', (connection: Connection) => connection.source.view.color)
      .style(
        'stroke-width',
        (connection: Connection) =>
          (connection.view.isFocused(false) ? 1.2 : 1) *
          this._networkGraph.strokeWidth
      )
      .attr('marker-end', (connection: Connection) =>
        connection.view.markerEnd()
      )
      .style('stroke-dasharray', (connection: Connection) =>
        connection.view.probabilistic() ? '7.85' : ''
      );

    this._selector
      .selectAll('g.connection')
      .selectAll('path')
      .transition(t)
      .attr('d', (connection: Connection) =>
        this.drawPath(
          connection.source.view.position,
          connection.target.view.position
        )
      );
  }

  drawPath(source: any, target: any, config: any = {}): string {
    const r: number = config.radius || 18;

    const x1: number = source.x;
    let y1: number = source.y;
    const x2: number = target.x;
    const y2: number = target.y;

    const dx: number = x2 - x1;
    const dy: number = y2 - y1;
    const dr: number = Math.sqrt(dx * dx + dy * dy);

    // Defaults for normal edge.
    const ellipticalArc: number = config.ellipticalArc || 2.5;
    const xAxisRotation: number = config.xAxisRotation || 0;

    let drx: number = dr * ellipticalArc * 2;
    let dry: number = dr * ellipticalArc; // * 2;
    let largeArc = 0; // 1 or 0
    let sweep = 1; // 1 or 0

    let mx2: number = x2;
    let my2: number = y2;

    // Self edge.
    if (dx === 0 && dy === 0 && !config.isTargetMouse) {
      // Fiddle with this angle to get loop oriented.

      // Needs to be 1.
      largeArc = 1;

      // Change sweep to change orientation of loop.
      sweep = 0;

      // Make drx and dry different to get an ellipse
      // instead of a circle.
      drx = 20;
      dry = 10;

      y1 -= 6;

      mx2 = x2 + 1;
      my2 = y2 - r - 4;
    } else if (!config.isTargetMouse) {
      const a: number = Math.atan2(dy, dx);
      const tr: number = r + 6;
      mx2 = x2 - Math.cos(a) * tr;
      my2 = y2 - Math.sin(a) * tr;
    }

    const d: string = `M${x1.toFixed()},${y1.toFixed()}A${drx},${dry} ${xAxisRotation},${largeArc},${sweep} ${mx2.toFixed()},${my2.toFixed()}`;
    return d;
  }
}
