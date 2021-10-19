import * as d3 from 'd3';

import { NetworkGraph } from '../../network/networkGraph/networkGraph';
import { Node } from '../node';
import { NodeGraphConnector } from './nodeGraphConnector';
import { NodeGraphShape } from './nodeGraphShape';

export class NodeGraph {
  private _networkGraph: NetworkGraph;
  private _nodeGraphConnector: NodeGraphConnector;
  private _nodeGraphShape: NodeGraphShape;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
    this._nodeGraphConnector = new NodeGraphConnector(networkGraph);
    this._nodeGraphShape = new NodeGraphShape(networkGraph);
  }

  get network(): any {
    return this._networkGraph.network;
  }

  get state(): any {
    return this._networkGraph.workspace.state;
  }

  /**
   * Initialize node graph.
   */
  init(
    node: Node,
    idx: number,
    elements: SVGGElement[] | ArrayLike<SVGGElement>
  ): void {
    // console.log('Init node graph');
    const elem: d3.Selection<any, any, any, any> = d3.select(elements[idx]);
    elem.selectAll('*').remove();

    this._nodeGraphConnector.init(elem, node);
    this._nodeGraphShape.init(elem, node);

    elem.on('mouseover', (_, n: Node) => {
      node.state.focus();
      // Draw line between selected node and focused node.
      if (node.state.isAnySelected() && this.state.enableConnection) {
        this._networkGraph.workspace.dragline.drawLineNodes(
          this.network.state.selectedNode,
          n
        );
      }
      this.render();
    });

    elem.on('mouseout', () => {
      // console.log('Node mouse out');
      this.network.state.resetFocus();
      this.render();
    });
  }

  /**
   * Update nodes in network graph.
   *
   * @remarks
   * This function should be called when nodes is changed.
   */
  update() {
    const nodes: d3.Selection<any, any, any, any> = this._networkGraph.selector
      .select('g#nodes')
      .selectAll('g.node')
      .data(this.network.nodes, (n: Node) => n.hash);

    nodes
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('idx', (n: Node) => n.idx)
      .attr('weight', (n: Node) => n.view.weight)
      .attr(
        'transform',
        (n: Node) =>
          `translate(${n.view.position.x},${n.view.position.y}) scale( ${
            n.state.isFocused() ? 1.2 : 1
          })`
      )
      .style('opacity', 0)
      .call(
        d3
          .drag()
          .on('start', (e: MouseEvent) => this._networkGraph.dragStart(e))
          .on('drag', (e: MouseEvent, n: Node) => this.drag(e, n))
          .on('end', (e: MouseEvent) => this._networkGraph.dragEnd(e))
      )
      .each((n: Node, i: number, e) => this.init(n, i, e));

    nodes.exit().remove();

    this.render();
  }

  /**
   * Drag node graph.
   */
  drag(event: MouseEvent, node: Node): void {
    if (!this.state.enableConnection) {
      node.view.position.x = event.x;
      node.view.position.y = event.y;
      this._networkGraph.render();
    }
  }

  /**
   * Render node graph.
   */
  render() {
    // console.log('Update node graph');

    this._nodeGraphShape.render();
    this._nodeGraphConnector.render();

    const duration: number = this.state.dragging ? 0 : 250;
    const t: d3.Transition<any, any, any, any> = d3
      .transition()
      .duration(duration);

    const nodes = d3.select('g#nodes').selectAll('g.node');
    nodes
      .transition(t)
      .style('opacity', 1)
      .attr(
        'transform',
        (n: Node) =>
          `translate(${n.view.position.x},${n.view.position.y}) scale( ${
            n.state.isFocused() ? 1.2 : 1
          })`
      );
  }
}
