import * as d3 from 'd3';

import { Config } from '../../config';
import { Network } from '../network';
import { NetworkGraph } from '../networkGraph';
import { NetworkGraphDragline } from './networkGraphDragline';
import { NetworkGraphGrid } from './networkGraphGrid';
import { NetworkGraphNodeAddPanel } from './networkGraphNodeAddPanel';
import { NetworkGraphZoom } from './networkGraphZoom';
import { Node } from '../../node/node';

export class NetworkGraphWorkspace extends Config {
  private _cursorPosition: any = { x: 0, y: 0 };
  private _dragline: NetworkGraphDragline;
  private _grid: NetworkGraphGrid;
  private _handler: d3.Selection<any, any, any, any>;
  private _networkGraph: NetworkGraph;
  private _nodeAddPanel: NetworkGraphNodeAddPanel;
  private _selector: d3.Selection<any, any, any, any>;
  private _size: any = {
    width: 800,
    height: 600,
  };
  private _state: any = {
    centerNetwork: false,
    centerSelected: false,
    connected: false,
    dragging: false,
    enableConnection: false,
    keyCode: null,
    transforming: false,
    showGrid: false,
  };
  private _zoom: NetworkGraphZoom;

  constructor(networkGraph: NetworkGraph) {
    super('NetworkGraphWorkspace');
    this._selector = d3.select('g#networkWorkspace');
    this._handler = d3.select('rect#workspaceHandler');
    this._networkGraph = networkGraph;

    this._dragline = new NetworkGraphDragline(this);
    this._grid = new NetworkGraphGrid(this);
    this._nodeAddPanel = new NetworkGraphNodeAddPanel(this);
    this._zoom = new NetworkGraphZoom(this);
  }

  get altPressed(): boolean {
    // Alt (left) or AltGr (right)
    return [18, 225].includes(this._state.keyCode);
  }

  get cursorPosition(): any {
    return this._cursorPosition;
  }

  get dragline(): NetworkGraphDragline {
    return this._dragline;
  }

  get grid(): NetworkGraphGrid {
    return this._grid;
  }

  get network(): Network {
    return this._networkGraph.network;
  }

  get networkGraph(): NetworkGraph {
    return this._networkGraph;
  }

  get nodeAddPanel(): NetworkGraphNodeAddPanel {
    return this._nodeAddPanel;
  }

  get selector(): d3.Selection<any, any, any, any> {
    return this._selector;
  }

  get state(): any {
    return this._state;
  }

  get handler(): d3.Selection<any, any, any, any> {
    return this._handler;
  }

  get size(): any {
    return this._size;
  }

  get zoom(): NetworkGraphZoom {
    return this._zoom;
  }

  /**
   * Initialize workspace.
   */
  init(): void {
    this.initTransform();

    d3.select('body')
      .on('keyup', (event: any) => {
        this._state.keyCode = null;
        if (event.keyCode === 27) {
          // Reset workspace when user pressed escape
          this.reset();
          this.update();
        }
      })
      .on('keydown', (event: any) => {
        this._state.keyCode = event.keyCode;
      });

    this._handler
      .on('mousemove', (e: MouseEvent) => {
        this.updateCursorPosition(e);
        this.network.view.resetFocus();
        if (this._state.enableConnection) {
          this._dragline.update(e);
        }
      })
      .on('click', () => {
        if (this._state.enableConnection) {
          this._dragline.hide();
          this._state.enableConnection = false;
        } else {
          this.network.view.resetSelection();
          this.reset();
        }
        this._networkGraph.update();
        this._networkGraph.workspace.updateTransform();
      })
      .on('contextmenu', (e: MouseEvent) => {
        // console.log(event);
        e.preventDefault();
        this.updateCursorPosition(e);
        this._nodeAddPanel.open();
      })
      .call(this._zoom.handler);
  }

  /**
   * Update workspace.
   */
  update(): void {
    this.updateState();
    this._grid.update();
  }

  /**
   * Update cursor position.
   */
  updateCursorPosition(e: MouseEvent): void {
    const position: number[] = d3.pointer(e, this._selector.node());
    this._cursorPosition.x = position[0];
    this._cursorPosition.y = position[1];
  }

  /**
   * Initialize transform of the workspace.
   */
  initTransform(): void {
    this._zoom.transform.x = (this._size.width / 2) * this._zoom.transform.k;
    this._zoom.transform.y = (this._size.height / 2) * this._zoom.transform.k;
    this._handler.call(
      this._zoom.handler.transform,
      d3.zoomIdentity
        .translate(this._zoom.transform.x, this._zoom.transform.y)
        .scale(this._zoom.transform.k)
    );
  }

  /**
   * Update transform of the workspace.
   */
  updateTransform(): void {
    // console.log('Transform network graph');
    if (!this._state.centerNetwork && !this._state.centerSelected) {
      return;
    }
    let x: number = 0,
      y: number = 0;

    if (this._state.centerSelected && this.network.view.selectedNode) {
      const nodePosition: any = this.network.view.selectedNode.view.position;
      x = nodePosition.x;
      y = nodePosition.y;
    } else if (
      this._state.centerSelected &&
      this.network.view.selectedConnection
    ) {
      const selectedConnection = this.network.view.selectedConnection;
      const sourcePosition: any = selectedConnection.source.view.position;
      const targetPosition: any = selectedConnection.target.view.position;
      x = d3.mean([sourcePosition.x, targetPosition.x]);
      y = d3.mean([sourcePosition.y, targetPosition.y]);
    } else if (this._state.centerNetwork && this.network.nodes.length > 0) {
      const networkCenterPos: any = this.centerNetworkPos();
      x = networkCenterPos.x;
      y = networkCenterPos.y;
    }

    this._zoom.transform.x = this._size.width / 2 - x * this._zoom.transform.k;
    this._zoom.transform.y = this._size.height / 2 - y * this._zoom.transform.k;

    this._state.transforming = true;
    this._handler.call(
      this._zoom.handler.transform,
      d3.zoomIdentity
        .translate(this._zoom.transform.x, this._zoom.transform.y)
        .scale(this._zoom.transform.k)
    );
    this._state.transforming = false;
  }

  /**
   * Center position of nodes.
   */
  centerNetworkPos(): { x: number; y: number } {
    // console.log('Center network pos');
    const X: number[] = [];
    const Y: number[] = [];
    this.network.nodes.forEach((node: Node) => {
      X.push(node.view.position.x);
      Y.push(node.view.position.y);
    });
    const x: number = (d3.min(X) + d3.max(X)) / 2;
    const y: number = (d3.min(Y) + d3.max(Y)) / 2;
    return { x, y };
  }

  /**
   * Toggle center of network graph.
   */
  toggleCenterNetwork(): void {
    this.updateConfig({ centerNetwork: !this.config.centerNetwork });
    this.updateState();
    this.updateTransform();
  }

  /**
   * Toggle center of selected.
   */
  toggleCenterSelected(): void {
    this.updateConfig({ centerSelected: !this.config.centerSelected });
    this.updateState();
    this.updateTransform();
  }

  /**
   * Toggle grid graph.
   */
  toggleGrid(): void {
    this.updateConfig({
      showGrid: !this.config.showGrid,
    });
    this.update();
  }

  /**
   * Turn the animation off.
   */
  animationOff(): void {
    this.state.dragging = true;
    this._networkGraph.selector.style('pointer-events', 'none');
    setTimeout(() => {
      this.state.dragging = false;
      this._networkGraph.selector.style('pointer-events', '');
    }, 1);
  }

  /**
   * Update state from config.
   */
  updateState(): void {
    this._state.centerNetwork = this.config.centerNetwork;
    this._state.centerSelected = this.config.centerSelected;
    this._state.showGrid = this.config.showGrid;
  }

  /**
   * Reset graph.
   */
  reset(): void {
    // console.log('Reset graph');
    this._handler.style('cursor', 'default');
    this._nodeAddPanel.close();
    if (!this.altPressed) {
      this._dragline.hide();
      this._state.enableConnection = false;
    }
  }

  /**
   * Resize workspace handler.
   */
  resize(width: number, height: number): void {
    this._size.width = width || this._size.width;
    this._size.height = height || this._size.height;
    this._networkGraph.resize(this._size.width, this._size.height);
    this._handler
      .attr('width', this._size.width)
      .attr('height', this._size.height);
  }
}
