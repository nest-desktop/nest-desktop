// nodeGraphConnector.ts

import { drag, select, transition } from "d3";

import type { TDragBehavior, TNetworkGraph, TNode, TSelection, TTransition } from "@/types";
import { BaseObj } from "@/core";
import { darkMode } from "@/theme";

import { drawPathMouse } from "../connectionGraph";

export class NodeGraphConnector extends BaseObj {
  private _connectorRadius: number = 6;
  private _networkGraph: TNetworkGraph;

  constructor(networkGraph: TNetworkGraph) {
    super();

    this._networkGraph = networkGraph;
  }

  get connectorRadius(): number {
    return this._connectorRadius;
  }

  get bgColor(): string {
    if (!this.networkGraph.network) return "white";
    return darkMode() ? "#121212" : "white";
  }

  get networkGraph(): TNetworkGraph {
    return this._networkGraph;
  }

  get nodeRadius(): number {
    return this.networkGraph.config?.localStorage.nodeRadius;
  }

  get strokeWidth(): number {
    return this.networkGraph.config?.localStorage.strokeWidth;
  }

  /**
   * Call on dragging.
   * @param event mouse event
   * @param node node or node group instance
   */
  drag(event: MouseEvent, node: TNode): void {
    node.selectForConnection();
    this.networkGraph.workspace.reset();
    this.networkGraph.workspace.dragline.init(event);
  }

  /**
   * Call on drag end.
   * @param event mouse event
   */
  dragEnd(event: MouseEvent): void {
    // this.networkGraph.workspace.dragline.hide();
    // this.networkGraph.workspace.state.dragLine = false;

    const network = this.networkGraph.network;
    const workspace = this.networkGraph.workspace;

    if (network.connections.state.selectedNode && network.nodes.state.focusedNode && workspace.state.dragLine) {
      this.networkGraph.network.connectNodes(
        network.connections.state.selectedNode.idx,
        network.nodes.state.focusedNode.idx,
      );
    }

    if (!workspace.altPressed) {
      workspace.reset();
      network.nodes.resetState();
    }

    this.networkGraph.dragEnd(event);
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
      .on("start", (e: MouseEvent) => this.networkGraph.dragStart(e))
      .on("drag", (e: MouseEvent, n: TNode | unknown) => this.drag(e, n as TNode))
      .on("end", (e: MouseEvent) => this.dragEnd(e));

    const connectorEnd = connector.append("g").attr("class", "end");

    connectorEnd
      .append("circle")
      .attr("class", "color")
      .attr("r", "6px")
      .attr("stroke-width", this.strokeWidth)
      .on("click", (e: MouseEvent, n: TNode) => {
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
      .attr("x1", this.connectorRadius / 3)
      .attr("x2", (23 / 12) * this.connectorRadius)
      .attr("y1", -(13 / 12) * this.connectorRadius)
      .attr("y2", -(13 / 12) * this.connectorRadius)
      .style("pointer-events", "none");

    // vline white
    // coordinates with current config: x1: 35, y1: 21.5, x2: 35, y2: 31
    connectorEnd
      .append("line")
      .attr("class", "bgcolor")
      .attr("stroke-width", 4)
      .attr("x1", (7 / 6) * this.connectorRadius)
      .attr("x2", (7 / 6) * this.connectorRadius)
      .attr("y1", -(21 / 12) * this.connectorRadius)
      .attr("y2", -(1 / 6) * this.connectorRadius)
      .style("pointer-events", "none");

    // hline colored
    // coordinates with current config: x1: 31.5, y1: 25.5, x2: 38.5, y2: 25.5
    connectorEnd
      .append("line")
      .attr("class", "color")
      .attr("stroke-width", 1.25)
      .attr("x1", (7 / 12) * this.connectorRadius)
      .attr("x2", (21 / 12) * this.connectorRadius)
      .attr("y1", -(13 / 12) * this.connectorRadius)
      .attr("y2", -(13 / 12) * this.connectorRadius)
      .style("pointer-events", "none");

    // vline colored
    // coordinates with current config: x1: 35, y1: 22, x2: 35, y2: 29.5
    connectorEnd
      .append("line")
      .attr("class", "color")
      .attr("stroke-width", 1.25)
      .attr("x1", (7 / 6) * this.connectorRadius)
      .attr("x2", (7 / 6) * this.connectorRadius)
      .attr("y1", -(5 / 3) * this.connectorRadius)
      .attr("y2", -(5 / 12) * this.connectorRadius)
      .style("pointer-events", "none");
  }

  /**
   * Render all node connectors.
   */
  render(): void {
    this.logger.trace("render");

    const connector: TSelection = select("g#nodes").selectAll("g.node").selectAll("g.connector");

    const workspace = this.networkGraph.workspace;
    const connectionDrag: boolean = workspace.state.dragLine || workspace.state.dragging;

    const duration: number = connectionDrag ? 0 : 250;
    const t: TTransition = transition().duration(duration);

    connector
      .transition(t)
      .delay(this.networkGraph.network?.nodes.state.focusedNode || workspace.state.dragLine ? 0 : 1000)
      .style("opacity", (n: TNode) => (n.view.isFocused && !connectionDrag ? "1" : "0"));

    // Connector animation.
    const connectorEndPos: { x: number; y: number } = {
      x: this.nodeRadius + 8,
      y: this.nodeRadius + 12,
    };

    connector
      .selectAll("path")
      .transition(t)
      .attr("d", (n: TNode) =>
        drawPathMouse({ x: 0, y: 0 }, n.view.isFocused && !connectionDrag ? connectorEndPos : { x: 0, y: 0 }),
      );

    connector
      .select(".end")
      .transition(t)
      .attr("transform", (n: TNode) =>
        n.view.isFocused && !connectionDrag
          ? `translate(${connectorEndPos.x}, ${connectorEndPos.y})`
          : "translate(0,0)",
      );

    connector.selectAll(".color").style("stroke", "currentcolor");
    connector.selectAll("line.bgcolor").attr("stroke", this.bgColor);
    connector.select("circle.color").attr("fill", this.bgColor);
  }
}
