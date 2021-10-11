import * as d3 from 'd3';

import { Network } from '../network';
import { NetworkGraphWorkspace } from './networkGraphWorkspace';

export class NetworkGraphNodeAddPanel {
  private _workspace: NetworkGraphWorkspace;
  private _selector: d3.Selection<any, any, any, any>;

  constructor(networkGraphWorkspace: NetworkGraphWorkspace) {
    this._workspace = networkGraphWorkspace;
    this._selector = this._workspace.selector.select('g#nodeAddPanel');
    this.init();
  }

  get color(): string {
    return this.network.view.getNodeColor(this.network.nodes.length);
  }

  get network(): Network {
    return this._workspace.network;
  }

  get position(): any {
    return this._workspace.cursorPosition;
  }

  get nodeRadius(): number {
    return this._workspace.networkGraph.config.nodeRadius;
  }

  get strokeWidth(): number {
    return this._workspace.networkGraph.config.strokeWidth;
  }

  /**
   * Initialize panel to add node.
   */
  init(): void {
    this._selector.style('display', 'none');
    this._selector
      .append('circle')
      .attr('class', 'select')
      .attr('fill', 'white')
      .attr('fill-opacity', '0.8')
      .attr('r', this.nodeRadius - this.strokeWidth)
      .on('click', () => {
        this.close();
      })
      .on('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        this._workspace.reset();
      });

    const arcFrame: d3.Arc<any, any> = d3
      .arc()
      .innerRadius(this.nodeRadius - this.strokeWidth)
      .outerRadius(this.nodeRadius * 2);

    const elementTypes: string[] = ['recorder', 'neuron', 'stimulator'];
    elementTypes.forEach((elementType: string, idx: number) => {
      const panel: d3.Selection<any, any, any, any> = this._selector
        .append('g')
        .attr('class', 'select ' + elementType)
        .append('path')
        .datum({
          startAngle: (Math.PI * idx * 2) / 3,
          endAngle: (Math.PI * (idx + 1) * 2) / 3,
        })
        .style('fill', 'white')
        .attr('fill-opacity', '0.8')
        .style('cursor', 'pointer')
        .style('stroke', this.network ? this.color : 'grey')
        .style('stroke-width', this.strokeWidth)
        .attr('d', arcFrame)
        .on('mouseover', () => {
          this._selector
            .select('g.tooltip')
            .style('visibility', 'visible')
            .select('text.label')
            .text(elementType);
          panel.style('fill', this.network ? this.color : 'grey');
          this._selector.selectAll('.' + elementType).style('fill', 'white');
        })
        .on('mouseout', () => {
          this._selector
            .select('g.tooltip')
            .style('visibility', 'hidden')
            .select('text.label')
            .text('');
          panel.style('fill', 'white');
          this._selector.selectAll('.label').style('fill', 'black');
        })
        .on('mouseup', () => {
          this.close();
          this._workspace.animationOff();
          this.network.createNode({
            elementType,
            position: JSON.parse(JSON.stringify(this.position)),
          });
          this._workspace.networkGraph.update();
          this._workspace.networkGraph.workspace.updateTransform();
        });

      const f: number = (idx * 2) / 3 + 1 / 3;
      this._selector
        .append('text')
        .attr('class', 'select label ' + elementType)
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .attr('fill', 'black')
        .attr('dx', Math.sin(Math.PI * f) * 28)
        .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
        .text(elementType.slice(0, 1).toUpperCase());
    });

    this._selector
      .append('g')
      .attr('class', 'tooltip')
      .attr('transform', 'translate(0, -45)')
      .style('visibility', 'hidden');

    this._selector
      .select('g.tooltip')
      .append('rect')
      .attr('transform', 'translate(-37, -14)')
      .attr('width', '74px')
      .attr('height', '16px')
      .attr('fill', 'white');

    this._selector
      .select('g.tooltip')
      .append('text')
      .attr('class', 'label')
      .style('text-anchor', 'middle');
  }

  /**
   * Open panel to add node.
   */
  open(): void {
    this._selector.selectAll('path').style('stroke', () => this.color);
    this._selector
      .style('display', 'block')
      .attr(
        'transform',
        () => `translate(${this.position.x},${this.position.y})`
      )
      .style('opacity', '0.8');
  }

  /**
   * Close panel to add node.
   */
  close(): void {
    // console.log('Close panel');
    this._selector.style('display', 'none').style('opacity', '0');
  }
}
