// networkGraphWorkspace.ts

import { Selection, max, min, pointer, select, zoomIdentity } from "d3";

import { Config } from "@/helpers/config";
import { Network } from "@/types/networkTypes";
import { Node } from "@/types/nodeTypes";

import { NetworkGraph } from "./networkGraph";
import { NetworkGraphDragline } from "./networkGraphDragline";
import { NetworkGraphGrid } from "./networkGraphGrid";
import { NetworkGraphNodeAddPanel } from "./networkGraphNodeAddPanel";
import { NetworkGraphZoom } from "./networkGraphZoom";

export class NetworkGraphWorkspace extends Config {
  private _dragline: NetworkGraphDragline;
  private _grid: NetworkGraphGrid;
  private _handler: Selection<any, any, any, any>;
  private _networkGraph: NetworkGraph;
  private _nodeAddPanel: NetworkGraphNodeAddPanel;
  private _selector: Selection<any, any, any, any>;
  private _size: any = {
    width: 800,
    height: 600,
  };
  private _state: any = {
    centerNetwork: false,
    centerSelected: false,
    connected: false,
    cursorPosition: { x: 0, y: 0 },
    dragLine: false,
    dragging: false,
    keyCode: undefined,
    showGrid: false,
    transforming: false,
  };
  private _zoom: NetworkGraphZoom;

  constructor(networkGraph: NetworkGraph) {
    super("NetworkGraphWorkspace");
    this._selector = select("g#networkWorkspace");
    this._handler = select("rect#workspaceHandler");
    this._networkGraph = networkGraph;

    this._dragline = new NetworkGraphDragline(this);
    this._grid = new NetworkGraphGrid(this);
    this._nodeAddPanel = new NetworkGraphNodeAddPanel(this);
    this._zoom = new NetworkGraphZoom(this);
  }

  get altPressed(): boolean {
    // Alt (left) or AltGr (right).
    return [18, 225].includes(this._state.keyCode);
  }

  get dragline(): NetworkGraphDragline {
    return this._dragline;
  }

  get grid(): NetworkGraphGrid {
    return this._grid;
  }

  get network(): Network | undefined {
    return this._networkGraph.network;
  }

  get networkGraph(): NetworkGraph {
    return this._networkGraph;
  }

  get nodeAddPanel(): NetworkGraphNodeAddPanel {
    return this._nodeAddPanel;
  }

  get selector(): Selection<any, any, any, any> {
    return this._selector;
  }

  get state(): any {
    return this._state;
  }

  get handler(): Selection<any, any, any, any> {
    return this._handler;
  }

  get size(): any {
    return this._size;
  }

  get zoom(): NetworkGraphZoom {
    return this._zoom;
  }

  /**
   * Turn the animation off.
   */
  animationOff(): void {
    this.state.dragging = true;
    this._networkGraph.selector?.style("pointer-events", "none");
    setTimeout(() => {
      this.state.dragging = false;
      this._networkGraph.selector?.style("pointer-events", "");
    }, 1);
  }

  /**
   * Center position of nodes.
   */
  centerNetworkPos(): { x: number; y: number } {
    if (this.network == undefined) {
      return { x: 0, y: 1 };
    }

    const X: number[] = [];
    const Y: number[] = [];
    this.network.nodes.all.forEach((node: Node) => {
      X.push(node.view.state.position.x);
      Y.push(node.view.state.position.y);
    });
    const x: number = ((min(X) || 0) + (max(X) || 1)) / 2;
    const y: number = ((min(Y) || 0) + (max(Y) || 1)) / 2;
    return { x, y };
  }

  /**
   * Initialize workspace.
   */
  init(): void {
    this.initTransform();

    select("body")
      .on("keyup", (event: any) => {
        this._state.keyCode = null;
        if (event.keyCode === 27) {
          // Reset workspace when user pressed escape.
          this.reset();
          this.update();
        }
      })
      .on("keydown", (event: any) => {
        this._state.keyCode = event.keyCode;
      });

    this._handler
      .on("mousemove", (e: MouseEvent) => {
        const position: number[] = pointer(e, this._selector.node());
        this.updateCursorPosition({ x: position[0], y: position[1] });
        if (this._state.dragLine) {
          this._dragline.update(e);
        }
      })
      .on("click", () => {
        this.reset();
        if (this.network && this.network.nodes.state.selectedNode) {
          this.network.nodes.unselectNode();
        }
        this.update();
      })
      .on("contextmenu", (e: MouseEvent) => {
        e.preventDefault();
        const position: number[] = pointer(e, this._selector.node());
        this.updateCursorPosition({ x: position[0], y: position[1] });
        this._nodeAddPanel.open();
      })
      .call(this._zoom.handler);
  }

  /**
   * Initialize transform of the workspace.
   */
  initTransform(): void {
    this._zoom.transform.x = (this._size.width / 2) * this._zoom.transform.k;
    this._zoom.transform.y = (this._size.height / 2) * this._zoom.transform.k;
    this._handler.call(
      this._zoom.handler.transform,
      zoomIdentity
        .translate(this._zoom.transform.x, this._zoom.transform.y)
        .scale(this._zoom.transform.k)
    );
  }

  /**
   * Reset graph.
   */
  reset(): void {
    this._handler.style("cursor", "default");
    this._nodeAddPanel.close();
    this._dragline.hide();
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
   * Update workspace.
   */
  update(): void {
    this.updateState();
    this._grid.update();
    this._nodeAddPanel.update();
  }

  /**
   * Update cursor position.
   */
  updateCursorPosition(position: any = { x: 0, y: 0 }): void {
    this._state.cursorPosition.x = position.x;
    this._state.cursorPosition.y = position.y;
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
   * Update transform of the workspace.
   */
  updateTransform(): void {
    if (
      this.network == undefined ||
      (!this._state.centerNetwork && !this._state.centerSelected)
    )
      return;

    const bbox = this._handler.node().getBBox();

    let x: number = 0,
      y: number = 0;

    const nodes = this.network.nodes;
    if (this._state.centerSelected && nodes.state.selectedNode) {
      const nodePosition: any = nodes.state.selectedNode.view.state.position;
      x = nodePosition.x;
      y = nodePosition.y;
    } else if (this._state.centerNetwork && nodes.all.length > 0) {
      const networkCenterPos: any = this.centerNetworkPos();
      x = networkCenterPos.x;
      y = networkCenterPos.y;
    }

    this._zoom.transform.x = bbox.width / 2 - x * this._zoom.transform.k;
    this._zoom.transform.y = bbox.height / 2 - y * this._zoom.transform.k;

    this._state.transforming = true;
    this._handler.call(
      this._zoom.handler.transform,
      zoomIdentity
        .translate(this._zoom.transform.x, this._zoom.transform.y)
        .scale(this._zoom.transform.k)
    );
    this._state.transforming = false;
  }
}
