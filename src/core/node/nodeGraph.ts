import * as d3 from 'd3';

import { NetworkGraph } from '../network/networkGraph';
import { Node } from './node';

function anglePoint(deg: number, radius: number, y0: number = 0): number[] {
  const radian: number = (deg / 180) * Math.PI;
  return [Math.cos(radian) * radius, y0 - Math.sin(radian) * radius];
}

function getHexagonPoints(radius: number): string {
  const a: number = radius * 1.1;
  const p0: number[] = anglePoint(0, a, 4);
  const p1: number[] = anglePoint(60, a, 4);
  const p2: number[] = anglePoint(120, a, 4);
  const p3: number[] = anglePoint(180, a, 4);
  const p4: number[] = anglePoint(240, a, 4);
  const p5: number[] = anglePoint(300, a, 4);
  const points: string = [
    p0.join(','),
    p1.join(','),
    p2.join(','),
    p3.join(','),
    p4.join(','),
    p5.join(','),
  ].join(',');
  return points;
}

function getRectanglePoints(radius: number): string {
  const a: number = radius * Math.sqrt(Math.PI / 2);
  const b = 8;
  const p0: number[] = anglePoint(45 - b, a, 4);
  const p1: number[] = anglePoint(135 + b, a, 4);
  const p2: number[] = anglePoint(225 - b, a, 4);
  const p3: number[] = anglePoint(315 + b, a, 4);
  // const points: string = [[-x,y].join(','),[2*x,0].join(','),[-x,-y].join(',')].join(',');
  const points: string = [
    [p0[0] + b, p0[1]].join(','),
    [p1[0] + b, p1[1]].join(','),
    [p2[0] - b, p2[1]].join(','),
    [p3[0] - b, p3[1]].join(','),
  ].join(',');
  return points;
}

// function getRhombusPoints(radius: number): string {
//   const a: number = radius + 4;
//   const b: number = radius - 4;
//   const points: string = [
//     [a, 0].join(','),
//     [0, b].join(','),
//     [-a, 0].join(','),
//     [0, -b].join(','),
//   ].join(' ');
//   return points;
// }

// function getSquarePoints(radius: number): string {
//   const a: number = radius / 2. * Math.sqrt(Math.PI);
//   const points: string = [[-a, -a].join(','), [a, -a].join(','), [a, a].join(','), [-a, a].join(',')].join(' ');
//   return points;
// }

function getSquarePoints(radius: number): string {
  const a: number = radius * Math.sqrt(Math.PI / 2);
  const p0: number[] = anglePoint(45, a, 4);
  const p1: number[] = anglePoint(135, a, 4);
  const p2: number[] = anglePoint(225, a, 4);
  const p3: number[] = anglePoint(315, a, 4);
  const points: string = [
    p0.join(','),
    p1.join(','),
    p2.join(','),
    p3.join(','),
  ].join(',');
  return points;
}

function getTrianglePoints(radius: number): string {
  const a: number = radius * Math.sqrt(Math.PI / 2);
  const p0: number[] = anglePoint(90, a, 4);
  const p1: number[] = anglePoint(210, a, 4);
  const p2: number[] = anglePoint(330, a, 4);
  // const points: string = [[-x,y].join(','),[2*x,0].join(','),[-x,-y].join(',')].join(',');
  const points: string = [p0.join(','), p1.join(','), p2.join(',')].join(',');
  return points;
}

function getPoints(node: Node, radius: number): string {
  switch (node.model.elementType) {
    case 'stimulator':
      return getHexagonPoints(radius);
    case 'recorder':
      return getRectanglePoints(radius);
    case 'neuron':
      if (node.view.weight === 'excitatory') {
        return getTrianglePoints(radius);
      } else {
        return getSquarePoints(radius);
      }
    default:
      return getSquarePoints(radius);
  }
}

export class NodeGraph {
  private _connectorRadius: number = 6;
  private _networkGraph: NetworkGraph;
  private _nodeRadius: number = 20;
  private _selector: d3.Selection<any, any, any, any>;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
    this._selector = networkGraph.selector.select('g#nodes');
  }

  get nodeRadius(): number {
    return this._nodeRadius;
  }

  /**
   * Initialize node graph.
   *
   * @remark It is only been executed in networkGraph.init().
   * For changing in node graph, use update().
   */
  init(
    node: Node,
    idx: number,
    elements: SVGGElement[] | ArrayLike<SVGGElement>
  ): void {
    // console.log('Init node graph');
    const elem: d3.Selection<any, any, any, any> = d3.select(elements[idx]);
    elem.selectAll('*').remove();

    const connector: d3.Selection<any, any, any, any> = elem
      .append('g')
      .attr('class', 'connector')
      .on('mousedown.drag', null);

    connector
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .style('opacity', 0)
      .attr('stroke-width', 16);

    connector
      .append('path')
      .attr('class', 'color')
      .attr('fill', 'none')
      .attr('stroke-width', this._networkGraph.strokeWidth)
      .style('pointer-events', 'none');

    const connectorEnd = connector.append('g').attr('class', 'end');

    connectorEnd
      .append('circle')
      .attr('class', 'color')
      .attr('fill', 'white')
      .attr('r', '6px')
      .attr('stroke-width', this._networkGraph.strokeWidth)
      .style('cursor', 'pointer')
      .on('mousedown', (e: MouseEvent) => {
        this._networkGraph.reset();
        this._networkGraph.network.view.selectedNode = node;
        this._networkGraph.state.enableConnection = true;
        this._networkGraph.dragLine(e);
        this._networkGraph.update();
      });

    // Connector plus symbol made of lines (white lines for spacing):
    // hline white
    // coordinates with current config: x1: 30, y1: 25.5, x2: 39.5, y2: 25.5
    connectorEnd
      .append('line')
      .attr('stroke-width', 4)
      .attr('stroke', 'white')
      .attr('x1', this._connectorRadius / 3)
      .attr('x2', (23 / 12) * this._connectorRadius)
      .attr('y1', -(13 / 12) * this._connectorRadius)
      .attr('y2', -(13 / 12) * this._connectorRadius)
      .style('pointer-events', 'none');
    // vline white
    // coordinates with current config: x1: 35, y1: 21.5, x2: 35, y2: 31
    connectorEnd
      .append('line')
      .attr('stroke-width', 4)
      .attr('stroke', 'white')
      .attr('x1', (7 / 6) * this._connectorRadius)
      .attr('x2', (7 / 6) * this._connectorRadius)
      .attr('y1', -(21 / 12) * this._connectorRadius)
      .attr('y2', -(1 / 6) * this._connectorRadius)
      .style('pointer-events', 'none');
    // hline colored
    // coordinates with current config: x1: 31.5, y1: 25.5, x2: 38.5, y2: 25.5
    connectorEnd
      .append('line')
      .attr('class', 'color')
      .attr('stroke-width', 1.25)
      .attr('x1', (7 / 12) * this._connectorRadius)
      .attr('x2', (21 / 12) * this._connectorRadius)
      .attr('y1', -(13 / 12) * this._connectorRadius)
      .attr('y2', -(13 / 12) * this._connectorRadius)
      .style('pointer-events', 'none');
    // vline colored
    // coordinates with current config: x1: 35, y1: 22, x2: 35, y2: 29.5
    connectorEnd
      .append('line')
      .attr('class', 'color')
      .attr('stroke-width', 1.25)
      .attr('x1', (7 / 6) * this._connectorRadius)
      .attr('x2', (7 / 6) * this._connectorRadius)
      .attr('y1', -(5 / 3) * this._connectorRadius)
      .attr('y2', -(5 / 12) * this._connectorRadius)
      .style('pointer-events', 'none');

    const soma: d3.Selection<any, any, any, any> = elem
      .append('g')
      .attr('class', 'soma');

    if (
      node.model.elementType == 'neuron' &&
      node.view.weight == 'inhibitory'
    ) {
      soma.append('circle').attr('class', 'shape').attr('r', this._nodeRadius);
    } else {
      soma
        .append('polygon')
        .attr('class', 'shape')
        .attr('points', getPoints(node, this._nodeRadius));
    }

    soma
      .selectAll('.shape')
      .style('stroke', node.view.color)
      .style('stroke-width', this._networkGraph.strokeWidth);

    soma
      .append('text')
      .attr('dy', () =>
        node.model.elementType == 'neuron' && node.view.weight == 'inhibitory'
          ? '0.4em'
          : '0.7em'
      )
      .text(() => node.view.label);

    soma.on('click', () => {
      if (
        this._networkGraph.network.view.selectedNode &&
        this._networkGraph.state.enableConnection
      ) {
        this._networkGraph.cursorPosition = JSON.parse(
          JSON.stringify(node.view.position)
        );
        this._networkGraph.state.connected = true;
        this._networkGraph.network.connectNodes(
          this._networkGraph.network.view.selectedNode,
          node
        );
        this._networkGraph.reset();
        node.view.focus();
      } else if (this._networkGraph.network.view.selectedNode === node) {
        this._networkGraph.reset();
        node.view.focus();
      } else {
        this._networkGraph.reset();
        node.view.select();
        node.view.focus();
      }
      this._networkGraph.state.enableConnection =
        [18, 225].includes(this._networkGraph.state.keyCode) &&
        this._networkGraph.network.view.selectedNode;
      this._networkGraph.update();
    });

    elem.on('mouseover', () => {
      this._networkGraph.network.view.focusedNode = node;
      if (
        this._networkGraph.network.view.selectedNode &&
        this._networkGraph.state.enableConnection
      ) {
        this._networkGraph.drawLineNodes(
          this._networkGraph.network.view.selectedNode,
          node
        );
      }
      this._networkGraph.update();
    });

    elem.on('mouseout', () => {
      this._networkGraph.network.view.resetFocus();
      this._networkGraph.update();
    });
  }

  /**
   * Update node graph.
   */
  update() {
    // console.log('Update node graph');
    const duration: number = this._networkGraph.state.dragging ? 0 : 250;
    const t: d3.Transition<any, any, any, any> = d3
      .transition()
      .duration(duration);

    // update node group
    this._selector
      .selectAll('g.node')
      .transition(t)
      .style('opacity', 1)
      .attr(
        'transform',
        (node: Node) =>
          `translate(${node.view.position.x},${node.view.position.y}) scale( ${
            node.view.isFocused() ? 1.2 : 1
          })`
      );

    // update node shape
    this._selector
      .selectAll('g.node')
      .selectAll('.shape')
      .style('stroke', (node: Node) => node.view.color)
      .style(
        'stroke-width',
        (node: Node) => (node.n > 1 ? 1.5 : 1) * this._networkGraph.strokeWidth
      )
      .style('stroke-dasharray', (node: Node) =>
        node.view.isSelected() ? '7.85' : ''
      );

    const connector: d3.Selection<any, any, any, any> =
      this._selector.selectAll('g.connector');

    connector
      .transition(t)
      .style('opacity', (node: Node) =>
        (node.view.isFocused() || node.view.isSelected()) &&
        !this._networkGraph.state.enableConnection &&
        !this._networkGraph.state.dragging
          ? '1'
          : '0'
      );

    // connector animation
    const connectorEndPos: any = {
      x: this._nodeRadius + 8,
      y: this._nodeRadius + 12,
    };

    connector
      .selectAll('path')
      .transition(t)
      .attr('d', (node: Node) =>
        this._networkGraph.connectionGraph.drawPath(
          { x: 0, y: 0 },
          (node.view.isFocused() || node.view.isSelected()) &&
            !this._networkGraph.state.enableConnection &&
            !this._networkGraph.state.dragging
            ? connectorEndPos
            : { x: 0, y: 0 },
          { isTargetMouse: true }
        )
      );

    connector
      .select('.end')
      .transition(t)
      .attr('transform', (node: Node) =>
        (node.view.isFocused() || node.view.isSelected()) &&
        !this._networkGraph.state.enableConnection &&
        !this._networkGraph.state.dragging
          ? `translate(${connectorEndPos.x}, ${connectorEndPos.y})`
          : 'translate(0,0)'
      );

    connector
      .selectAll('line')
      .transition(t)
      .attr(
        'opacity',
        (node: Node) =>
          node.view.isFocused() || node.view.isSelected() ? 1 : 0
        // remove node.view.isSelected() for only hover appearance of the plus symbol
      );

    connector
      .selectAll('.color')
      .transition(t)
      .style('stroke', (node: Node) => node.view.color);
  }
}
