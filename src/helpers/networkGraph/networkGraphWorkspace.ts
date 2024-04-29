// networkGraphWorkspace.ts

import { nextTick } from "vue";
import { Selection, max, min, pointer, select, zoomIdentity } from "d3";

import { BaseObj } from "../common/base";
import { NetworkGraphDragline } from "./networkGraphDragline";
import { NetworkGraphGrid } from "./networkGraphGrid";
import { NetworkGraphNodeAddPanel } from "./networkGraphNodeAddPanel";
import { NetworkGraphZoom } from "./networkGraphZoom";
import { TNetwork } from "@/types/networkTypes";
import { TNetworkGraph } from "@/types/networkGraphTypes";
import { TNode } from "@/types/nodeTypes";

export interface INetworkGraphWorkspaceState {
  centerNetwork: boolean;
  centerSelected: boolean;
  connected: boolean;
  cursorPosition: { x: number; y: number };
  dragLine: boolean;
  dragging: boolean;
  keyCode: number;
  showGrid: boolean;
  transforming: boolean;
}

export class NetworkGraphWorkspace extends BaseObj {
  private _dragline: NetworkGraphDragline;
  private _grid: NetworkGraphGrid;
  private _handler: Selection<any, any, any, any>;
  private _networkGraph: TNetworkGraph;
  private _nodeAddPanel: NetworkGraphNodeAddPanel;
  private _selector: Selection<any, any, any, any>;
  private _size: { height: number; width: number } = {
    height: 600,
    width: 800,
  };
  private _state: INetworkGraphWorkspaceState = {
    centerNetwork: false,
    centerSelected: false,
    connected: false,
    cursorPosition: { x: 0, y: 0 },
    dragLine: false,
    dragging: false,
    keyCode: -1,
    showGrid: false,
    transforming: false,
  };
  private _zoom: NetworkGraphZoom;

  constructor(networkGraph: TNetworkGraph) {
    super({
      config: { name: "NetworkGraphWorkspace" },
      logger: { settings: { minLevel: 3 } },
    });

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

  get network(): TNetwork | undefined {
    return this._networkGraph.network;
  }

  get networkGraph(): TNetworkGraph {
    return this._networkGraph;
  }

  get nodeAddPanel(): NetworkGraphNodeAddPanel {
    return this._nodeAddPanel;
  }

  get selector(): Selection<any, any, any, any> {
    return this._selector;
  }

  get state(): INetworkGraphWorkspaceState {
    return this._state;
  }

  get handler(): Selection<any, any, any, any> {
    return this._handler;
  }

  get size(): { height: number; width: number } {
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
    nextTick(() => {
      this.state.dragging = false;
      this._networkGraph.selector?.style("pointer-events", "");
    });
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
    this.network.nodes.nodes.forEach((node: TNode) => {
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
      .on("keyup", (event: { keyCode: number }) => {
        this._state.keyCode = -1;
        if (event.keyCode === 27) {
          // Reset workspace when user pressed escape.
          this.reset();
          this.update();
        }
      })
      .on("keydown", (event: { keyCode: number }) => {
        this._state.keyCode = event.keyCode;
      });

    this._handler
      .on("mousemove", (event: MouseEvent) => {
        const position: number[] = pointer(event, this._selector.node());
        this.updateCursorPosition({ x: position[0], y: position[1] });
        if (this._state.dragLine) {
          this._dragline.update(event);
        }
      })
      .on("click", () => {
        this.reset();
        this.network?.state.unselectAll();
        this.update();
      })
      .on("contextmenu", (event: MouseEvent) => {
        event.preventDefault();
        this.reset();

        this.network?.state.unselectAll();
        const position: number[] = pointer(event, this._selector.node());
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
    this._networkGraph.reset();
    this._nodeAddPanel.close();
    this._dragline.hide();
  }

  /**
   * Toggle center of network graph.
   */
  toggleCenterNetwork(): void {
    this.config?.update({
      centerNetwork: !this.config?.localStorage.centerNetwork,
    });
    this.updateState();
    this.updateTransform();
  }

  /**
   * Toggle center of selected.
   */
  toggleCenterSelected(): void {
    this.config?.update({
      centerSelected: !this.config?.localStorage.centerSelected,
    });
    this.updateState();
    this.updateTransform();
  }

  /**
   * Toggle grid graph.
   */
  toggleGrid(): void {
    this.config?.update({
      showGrid: !this.config?.localStorage.showGrid,
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
   * @param position
   */
  updateCursorPosition(
    position: { x: number; y: number } = { x: 0, y: 0 }
  ): void {
    this._state.cursorPosition.x = position.x;
    this._state.cursorPosition.y = position.y;
  }

  /**
   * Update state from config.
   */
  updateState(): void {
    const localStorage = this.config?.localStorage;
    this._state.centerNetwork = localStorage.centerNetwork;
    this._state.centerSelected = localStorage.centerSelected;
    this._state.showGrid = localStorage.showGrid;
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
      const nodePosition: { x: number; y: number } =
        nodes.state.selectedNode.view.state.position;
      x = nodePosition.x;
      y = nodePosition.y;
    } else if (this._state.centerNetwork && nodes.all.length > 0) {
      const networkCenterPos: { x: number; y: number } =
        this.centerNetworkPos();
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
