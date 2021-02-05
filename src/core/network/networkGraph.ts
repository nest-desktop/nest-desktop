import * as d3 from 'd3';

import { Connection } from '../connection/connection';
import { drawPath } from '../connection/connectionGraph';
import { Network } from './network';
import { getPoints } from '../node/nodeGraph';
import { Node } from '../node/node';

export class NetworkGraph {
  private _cursorPosition: any = { x: 0, y: 0 };
  private _height: number = 600;
  private _network: Network;
  private _networkCenter: any = { x: 0, y: 0 };
  private _nodeRadius: number = 20;
  private _selector: d3.Selection<any, any, any, any>;
  private _state: any = {
    autofocus: true,
    dragging: false,
    keyCode: null,
    resizing: false,
  };
  private _strokeWidth: number = 4;
  private _width: number = 800;
  private _zoom: any;

  constructor(selector: string) {
    this._selector = d3.select(selector);
    this.init();
  }

  get autofocus(): boolean {
    return this._state.autofocus;
  }

  get network(): Network {
    return this._network;
  }

  set network(value: Network) {
    this._network = value;
  }

  drawNode(node: Node, elem: d3.Selection<any, any, any, any>): void {
    if (
      node.model.elementType == 'neuron' &&
      node.view.weight == 'inhibitory'
    ) {
      elem
        .append('circle')
        .attr('class', 'shape')
        .attr('r', this._nodeRadius);
    } else {
      elem
        .append('polygon')
        .attr('class', 'shape')
        .attr('points', getPoints(node, this._nodeRadius));
    }

    elem
      .selectAll('.shape')
      .style('stroke', node.view.color)
      .style('stroke-width', this._strokeWidth);

    elem
      .append('text')
      .attr('dy', () =>
        node.model.elementType == 'neuron' && node.view.weight == 'inhibitory'
          ? '0.4em'
          : '0.7em'
      )
      .text(() => node.view.label);

    elem.on('mouseover', () => {
      this._network.view.focusedNode = node;
      const selectedNode: Node = this._network.view.selectedNode;
      if (selectedNode && this._state.connectNode) {
        this._selector
          .selectAll('.dragline')
          .style('opacity', 1)
          .attr('d', () =>
            drawPath(selectedNode.view.position, node.view.position)
          );
      }
      this.updateNetworkGraph();
    });

    elem.on('mouseout', () => {
      this._network.view.resetFocus();
      this.updateNetworkGraph();
    });

    elem.on('click', () => {
      if (this._network.view.selectedNode && this._state.connectNode) {
        this._network.connectNodes(this._network.view.selectedNode, node);
        this.initNetworkGraph();
        if (this._state.keyCode !== 17) {
          this.reset();
        }
      } else if (this._network.view.selectedNode) {
        this.reset();
      } else {
        this.reset();
        this._network.view.selectedNode = node;
      }
      this._network.view.focusedNode = node;
      this.updateNetworkGraph();
      this.centerNetworkGraph();
      this.resize();
    });
  }

  initPanel(): void {
    const selectPanel: d3.Selection<any, any, any, any> = this._selector.select(
      'g#panel'
    );
    selectPanel.style('display', 'none');
    selectPanel
      .append('circle')
      .attr('class', 'select')
      .attr('fill', 'white')
      .attr('fill-opacity', '0.8')
      .attr('r', this._nodeRadius - this._strokeWidth)
      .on('click', () => {
        this.reset();
      })
      .on('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        this.reset();
      });

    const arcFrame: d3.Arc<any, any> = d3
      .arc()
      .innerRadius(this._nodeRadius - this._strokeWidth)
      .outerRadius(this._nodeRadius * 2);

    const elementTypes: string[] = ['recorder', 'neuron', 'stimulator'];
    elementTypes.forEach((elementType: string, idx: number) => {
      const panel: d3.Selection<any, any, any, any> = selectPanel
        .append('path')
        .attr('class', 'select ' + elementType)
        .datum({
          startAngle: (Math.PI * idx * 2) / 3,
          endAngle: (Math.PI * (idx + 1) * 2) / 3,
        })
        .style('fill', 'white')
        .attr('fill-opacity', '0.8')
        .style('cursor', 'pointer')
        .style('stroke', () => {
          return this._network
            ? this._network.view.getNodeColor(this._network.nodes.length)
            : 'grey';
        })
        .style('stroke-width', this._strokeWidth)
        .attr('d', arcFrame)
        .on('mouseover', () => {
          // tooltip
          //   .style('visibility', 'visible')
          //   .select('.label')
          //   .text(elementType);
          panel.style('fill', () => {
            return this._network
              ? this._network.view.getNodeColor(this._network.nodes.length)
              : 'grey';
          });
        })
        .on('mouseout', () => {
          // tooltip
          //   .style('visibility', 'hidden')
          //   .select('.label')
          //   .text('');
          panel.style('fill', 'white');
        })
        .on('mouseup', () => {
          this.reset();
          this._network.createNode({
            elementType,
            position: JSON.parse(JSON.stringify(this._cursorPosition)),
          });
          this.update();
        });

      const f: number = (idx * 2) / 3 + 1 / 3;
      selectPanel
        .append('text')
        .attr('class', 'select label')
        .style('font-size', '11px')
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .attr('fill', 'black')
        .attr('dx', Math.sin(Math.PI * f) * 28)
        .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
        .text(elementType.slice(0, 1).toUpperCase());
    });
  }

  resetDragLine(): void {
    this._selector.selectAll('.dragline').style('opacity', 0);
  }

  dragLine(e: MouseEvent): void {
    const selectedNode: Node = this._network.view.selectedNode;
    const source: any = selectedNode.view.position;
    const position: number[] = d3.pointer(
      e,
      this._selector.select('g#network').node()
    );
    const target: any = {
      x: position[0],
      y: position[1],
    };
    this._selector
      .selectAll('.dragline')
      .style('opacity', 0.5)
      .style('stroke', selectedNode.view.color)
      .attr('d', () => drawPath(source, target, { isTargetMouse: true }));
  }

  initZoom(): void {
    this._zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [this._width, this._height],
      ])
      .scaleExtent([0.5, 2])
      .on('zoom', ({ transform }) => {
        if (this._state.resizing) {
          this._selector
            .select('g#network')
            .transition()
            .attr('transform', transform);
        } else {
          this._selector.select('g#network').attr('transform', transform);
        }
      });
  }

  initBackground(): void {
    this._selector
      .select('rect#background')
      .on('mousemove', (e: MouseEvent) => {
        this._network.view.resetFocus();
        if (this._network.view.selectedNode) {
          this._state.connectNode = true;
          this.dragLine(e);
        }
      })
      .on('click', () => this.reset())
      .on('contextmenu', (e: MouseEvent) => {
        // console.log(event);
        e.preventDefault();
        const position: number[] = d3.pointer(
          e,
          this._selector.select('g#network').node()
        );
        this._cursorPosition.x = position[0];
        this._cursorPosition.y = position[1];

        // if (
        //   this._network.view.selectedNode ||
        //   this._network.view.selectedConnection
        // ) {
        //   return;
        // }
        this._selector
          .select('g#panel')
          .selectAll('path')
          .style('stroke', () =>
            this._network.view.getNodeColor(this._network.nodes.length)
          );
        this._selector
          .select('g#panel')
          .style('display', 'block')
          .attr(
            'transform',
            () =>
              `translate(${this._cursorPosition.x},${this._cursorPosition.y})`
          )
          .style('opacity', '0.8');

        // const tooltip = selectPanel.select('.tooltip');
        // var tooltip = select.append('svg:text')
        //   .attr('class', 'tooltip')
        //   .attr('transform', 'translate(0, -45)')
        //   .style('visibility', 'hidden');
      })
      .call(this._zoom);
  }

  initNetworkGraph() {
    // console.log('Init network graph');
    const connections: d3.Selection<any, any, any, any> = this._selector
      .select('g#connections')
      .selectAll('path.connection')
      .data(this._network.connections);

    connections
      .enter()
      .append('path')
      .attr('class', 'connection')
      .style('fill', 'none')
      .style('stroke-width', this._strokeWidth)
      .style('opacity', 0)
      .attr('d', (d: Connection) => d.view.drawPath())
      .merge(connections);

    connections.exit().remove();

    const nodes: d3.Selection<any, any, any, any> = this._selector
      .select('g#nodes')
      .selectAll('g.node')
      .data(this._network.nodes);

    nodes
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('idx', (d: Node) => d.idx)
      .attr(
        'transform',
        (d: Node) =>
          `translate(${d.view.position.x},${d.view.position.y}) scale( ${
            d.view.isFocused() ? 1.2 : 1
          })`
      )
      .call(
        d3
          .drag()
          .on('start', (event: any) => {
            this._state.dragging = true;
            d3.select(event.sourceEvent.srcElement.parentNode).classed(
              'active',
              true
            );
            // .raise();
          })
          .on('drag', (event: MouseEvent, d: Node) => {
            d.view.position.x = event.x;
            d.view.position.y = event.y;
            this.updateNetworkGraph();
          })
          .on('end', (event: any) => {
            this._state.dragging = false;
            d3.select(event.sourceEvent.srcElement.parentNode).classed(
              'active',
              false
            );
            // d3.selectAll("g.node").sort((a,b) => d3.ascending(a.idx, b.idx))
            this.centerNetworkGraph();
            this.resize();
          })
      )
      .style('opacity', 0)
      .merge(nodes)
      .each((node: Node, idx: number, elements: any[]) => {
        const elem: d3.Selection<any, any, any, any> = d3.select(elements[idx]);
        elem.selectAll('*').remove();
        this.drawNode(node, elem);
      });

    nodes.exit().remove();
  }

  updateNetworkGraph() {
    // console.log('Update network graph');
    if (!this._state.dragging) {
      this._selector
        .selectAll('path.connection')
        .style('stroke', (d: Connection) => d.source.view.color)
        .attr('marker-end', (d: Connection) => d.view.markerEnd())
        .transition()
        .attr('d', (d: Connection) => d.view.drawPath())
        .style('opacity', 1);

      this._selector
        .selectAll('g.node')
        .transition()
        .attr(
          'transform',
          (d: Node) =>
            `translate(${d.view.position.x},${d.view.position.y}) scale( ${
              d.view.isFocused() ? 1.2 : 1
            })`
        )
        .style('opacity', 1);

      this._selector
        .selectAll('.shape')
        .style('stroke', (d: Node) => d.view.color)
        .style('stroke-dasharray', (d: Node) =>
          d.view.isSelected() ? '7.85' : ''
        );
    } else {
      this._selector
        .selectAll('path.connection')
        .style('stroke', (d: Connection) => d.source.view.color)
        .attr('marker-end', (d: Connection) => d.view.markerEnd())

        .attr('d', (d: Connection) => d.view.drawPath())
        .style('opacity', 1);

      this._selector
        .selectAll('g.node')
        .attr(
          'transform',
          (d: Node) =>
            `translate(${d.view.position.x},${d.view.position.y}) scale( ${
              d.view.isFocused() ? 1.2 : 1
            })`
        )
        .style('opacity', 1);

      this._selector
        .selectAll('g.node')
        .selectAll('.shape')
        .style('stroke', (d: Node) => d.view.color)
        .style('stroke-dasharray', (d: Node) =>
          d.view.isSelected() ? '7.85' : ''
        );
    }
  }

  centerNetworkGraph(): void {
    // console.log('center network graph');
    const x: number[] = [];
    const y: number[] = [];
    this._network.nodes.forEach((node: Node) => {
      x.push(node.view.position.x);
      y.push(node.view.position.y);
    });
    this._networkCenter.x = (d3.min(x) + d3.max(x)) / 2;
    this._networkCenter.y = (d3.min(y) + d3.max(y)) / 2;
  }

  resize(width: number = null, height: number = null): void {
    this._state.resizing = true;
    this._width = width || this._width;
    this._height = height || this._height;
    this._selector.attr('width', this._width).attr('height', this._height);
    this._selector
      .select('rect#background')
      .attr('width', this._width)
      .attr('height', this._height);

    if (this._state.autofocus) {
      const x = this._width / 2 - this._networkCenter.x;
      const y = this._height / 2 - this._networkCenter.y;
      this._selector
        .select('rect#background')
        .call(this._zoom.transform, d3.zoomIdentity.translate(x, y));
    }
    this._state.resizing = false;
  }

  toggleAutofocus(): void {
    this._state.autofocus = !this._state.autofocus;
    this.centerNetworkGraph();
    this.resize();
  }

  init(): void {
    // console.log('Init');
    d3.select('body')
      .on('keyup', (event: any) => {
        if (event.keyCode === 27) {
          this.reset();
        }
        this._state.keyCode = null;
      })
      .on('keydown', (event: any) => {
        this._state.keyCode = event.keyCode;
      });
    this.initZoom();
    this.initPanel();
    this.initBackground();
  }

  update(): void {
    // console.log('Update');
    this.initNetworkGraph();
    this.updateNetworkGraph();
    this.centerNetworkGraph();
  }

  reset(): void {
    // console.log('Reset network graph');
    this._state.connectNode = false;
    this._selector
      .select('g#panel')
      .style('display', 'none')
      .style('opacity', '0');
    this._network.view.reset();
    this.resetDragLine();
  }
}
