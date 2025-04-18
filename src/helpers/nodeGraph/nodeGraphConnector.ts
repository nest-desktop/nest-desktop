// nodeGraphConnector.ts

import { drag, select, transition } from "d3";

import { TDragBehavior, TNetworkGraph, TNode, TNodeGroup, TSelection, TTransition } from "@/types";

import { BaseObj } from "../common/base";
import { darkMode } from "../common/theme";
import { drawPathMouse } from "../connectionGraph/connectionGraphPath";

export class NodeGraphConnector extends BaseObj {
  private _connectorRadius: number = 6;
  private _networkGraph: TNetworkGraph;

  constructor(networkGraph: TNetworkGraph) {
    super();

    this._networkGraph = networkGraph;
  }

  get bgColor(): string {
    if (!this._networkGraph.network) return "white";
    return darkMode() ? "#121212" : "white";
  }

  get nodeRadius(): number {
    return this._networkGraph.config?.localStorage.nodeRadius;
  }

  get strokeWidth(): number {
    return this._networkGraph.config?.localStorage.strokeWidth;
  }

  /**
   * Call on dragging.
   * @param event mouse event
   * @param node node or node group object
   */
  drag(event: MouseEvent, node: TNode | TNodeGroup): void {
    node.selectForConnection();
    this._networkGraph.workspace.reset();
    this._networkGraph.workspace.dragline.init(event);
  }

  /**
   * Call on drag end.
   * @param event mouse event
   */
  dragEnd(event: MouseEvent): void {
    // this._networkGraph.workspace.dragline.hide();
    // this._networkGraph.workspace.state.dragLine = false;

    const network = this._networkGraph.network;
    const workspace = this._networkGraph.workspace;

    if (network.connections.state.selectedNode && network.nodes.state.focusedNode && workspace.state.dragLine) {
      this._networkGraph.network.connectNodes(
        network.connections.state.selectedNode.idx,
        network.nodes.state.focusedNode.idx,
      );
    }

    if (!workspace.altPressed) {
      workspace.reset();
      network.nodes.resetState();
    }

    this._networkGraph.dragEnd(event);
  }

  /**
   * Initialize a node connector.
   * @param selector
   */
  init(selector: TSelection): void {
    this.logger.trace("init");

    const connector: TSelection = selector
      .append("g")
      .attr("class", "connector")
      .style("cursor", "pointer")
      .style("opacity", 0)
      .on("mousedown.drag", null);

    connector.append("path").attr("fill", "none").attr("stroke", "white").style("opacity", 0).attr("stroke-width", 16);

    connector.append("path").attr("class", "color").attr("fill", "none").attr("stroke-width", this.strokeWidth);

    const dragging: TDragBehavior = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      .on("drag", (e: MouseEvent, n: TNode | TNodeGroup | unknown) => this.drag(e, n as TNode | TNodeGroup))
      .on("end", (e: MouseEvent) => this.dragEnd(e));

    const connectorEnd = connector.append("g").attr("class", "end");

    connectorEnd
      .append("circle")
      .attr("class", "color")
      .attr("r", "6px")
      .attr("stroke-width", this.strokeWidth)
      .on("click", (e: MouseEvent, n: TNode | TNodeGroup) => {
        this.drag(e, n);
        this.render();
      })
      .call(dragging, null);

    // Connector plus symbol made of lines (white lines for spacing):
    // hline white
    // coordinates with current config: x1: 30, y1: 25.5, x2: 39.5, y2: 25.5
    connectorEnd
      .append("line")
      .attr("class", "bgcolor")
      .attr("stroke-width", 4)
      .attr("x1", this._connectorRadius / 3)
      .attr("x2", (23 / 12) * this._connectorRadius)
      .attr("y1", -(13 / 12) * this._connectorRadius)
      .attr("y2", -(13 / 12) * this._connectorRadius)
      .style("pointer-events", "none");

    // vline white
    // coordinates with current config: x1: 35, y1: 21.5, x2: 35, y2: 31
    connectorEnd
      .append("line")
      .attr("class", "bgcolor")
      .attr("stroke-width", 4)
      .attr("x1", (7 / 6) * this._connectorRadius)
      .attr("x2", (7 / 6) * this._connectorRadius)
      .attr("y1", -(21 / 12) * this._connectorRadius)
      .attr("y2", -(1 / 6) * this._connectorRadius)
      .style("pointer-events", "none");

    // hline colored
    // coordinates with current config: x1: 31.5, y1: 25.5, x2: 38.5, y2: 25.5
    connectorEnd
      .append("line")
      .attr("class", "color")
      .attr("stroke-width", 1.25)
      .attr("x1", (7 / 12) * this._connectorRadius)
      .attr("x2", (21 / 12) * this._connectorRadius)
      .attr("y1", -(13 / 12) * this._connectorRadius)
      .attr("y2", -(13 / 12) * this._connectorRadius)
      .style("pointer-events", "none");

    // vline colored
    // coordinates with current config: x1: 35, y1: 22, x2: 35, y2: 29.5
    connectorEnd
      .append("line")
      .attr("class", "color")
      .attr("stroke-width", 1.25)
      .attr("x1", (7 / 6) * this._connectorRadius)
      .attr("x2", (7 / 6) * this._connectorRadius)
      .attr("y1", -(5 / 3) * this._connectorRadius)
      .attr("y2", -(5 / 12) * this._connectorRadius)
      .style("pointer-events", "none");
  }

  /**
   * Render all node connectors.
   */
  render(): void {
    this.logger.trace("render");

    const connector: TSelection = select("g#nodes").selectAll("g.node").selectAll("g.connector");

    const workspace = this._networkGraph.workspace;
    const connectionDrag: boolean = workspace.state.dragLine || workspace.state.dragging;

    const duration: number = connectionDrag ? 0 : 250;
    const t: TTransition = transition().duration(duration);

    connector
      .transition(t)
      .delay(this._networkGraph.network?.nodes.state.focusedNode || workspace.state.dragLine ? 0 : 1000)
      .style("opacity", (n: TNode | TNodeGroup) => (n.view.isFocused && !connectionDrag ? "1" : "0"));

    // Connector animation.
    const connectorEndPos: { x: number; y: number } = {
      x: this.nodeRadius + 8,
      y: this.nodeRadius + 12,
    };

    connector
      .selectAll("path")
      .transition(t)
      .attr(
        "d",
        (
          n: TNode | TNodeGroup | any, // TODO: no any!
        ) => drawPathMouse({ x: 0, y: 0 }, n.view.isFocused && !connectionDrag ? connectorEndPos : { x: 0, y: 0 }),
      );

    connector
      .select(".end")
      .transition(t)
      .attr("transform", (n: TNode | TNodeGroup) =>
        n.view.isFocused && !connectionDrag
          ? `translate(${connectorEndPos.x}, ${connectorEndPos.y})`
          : "translate(0,0)",
      );

    connector.selectAll(".color").style("stroke", "currentcolor");
    connector.selectAll("line.bgcolor").attr("stroke", this.bgColor);
    connector.select("circle.color").attr("fill", this.bgColor);
  }
}
