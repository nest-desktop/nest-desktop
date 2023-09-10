// nodeGraphConnector.ts

import { drag, select, Selection, Transition, transition } from "d3";

import { NetworkGraph } from "@/types/networkGraphTypes";
import { Node } from "@/types/nodeTypes";
import { darkMode } from "@/helpers/common/theme";
import { drawPathMouse } from "@/helpers/connectionGraph/connectionGraphPath";

export class NodeGraphConnector {
  private _connectorRadius: number = 6;
  private _networkGraph: NetworkGraph;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
  }

  get bgcolor(): string {
    if (this._networkGraph.network == undefined) {
      return "white";
    }

    return darkMode() ? "#121212" : "white";
  }

  get nodeRadius(): number {
    return this._networkGraph.config.nodeRadius;
  }

  get strokeWidth(): number {
    return this._networkGraph.config.strokeWidth;
  }

  /**
   * Initialize a node connector.
   */
  init(selector: Selection<any, any, any, any>): void {
    const connector: Selection<any, any, any, any> = selector
      .append("g")
      .attr("class", "connector")
      .style("cursor", "pointer")
      .style("opacity", 0)
      .on("mousedown.drag", null);

    connector
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .style("opacity", 0)
      .attr("stroke-width", 16);

    connector
      .append("path")
      .attr("class", "color")
      .attr("fill", "none")
      .attr("stroke-width", this.strokeWidth);

    const dragging = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      // @ts-ignore
      .on("drag", (e: MouseEvent, n: Node) => this.drag(e, n))
      .on("end", (e: MouseEvent) => this.dragEnd(e));

    const connectorEnd = connector.append("g").attr("class", "end");

    connectorEnd
      .append("circle")
      .attr("class", "color")
      .attr("r", "6px")
      .attr("stroke-width", this.strokeWidth)
      .on("click", (e: MouseEvent, n: Node) => {
        this.drag(e, n);
        this.render();
      })
      // @ts-ignore
      .call(dragging);

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
   * Call on dragging.
   */
  drag(e: MouseEvent, node: Node): void {
    if (!node.state.isSelected) {
      node.state.select();
    }
    this._networkGraph.workspace.reset();
    this._networkGraph.workspace.dragline.init(e);
  }

  /**
   * Call on drag end.
   */
  dragEnd(e: MouseEvent): void {
    // this._networkGraph.workspace.dragline.hide();
    // this._networkGraph.workspace.state.dragLine = false;

    const network = this._networkGraph.network;
    const workspace = this._networkGraph.workspace;

    if (
      network.nodes.state.selectedNode &&
      network.nodes.state.focusedNode &&
      workspace.state.dragLine
    ) {
      this._networkGraph.network.connectNodes(
        // @ts-ignore
        network.nodes.state.selectedNode,
        network.nodes.state.focusedNode
      );
    }

    if (!workspace.altPressed) {
      workspace.reset();
      network.nodes.resetState();
    }

    this._networkGraph.dragEnd(e);
  }

  /**
   * Render all node connectors.
   */
  render(): void {
    const connector: Selection<any, any, any, any> = select("g#nodes")
      .selectAll("g.node")
      .selectAll("g.connector");

    const workspace = this._networkGraph.workspace;
    const connectionDrag: boolean =
      workspace.state.dragLine || workspace.state.dragging;

    const duration: number = connectionDrag ? 0 : 250;
    const t: Transition<any, any, any, any> = transition().duration(duration);

    connector
      .transition(t)
      .delay(
        this._networkGraph.network?.nodes.state.focusedNode ||
          workspace.state.dragLine
          ? 0
          : 1000
      )
      .style("opacity", (n: Node) =>
        n.state.isFocused && !connectionDrag ? "1" : "0"
      );

    // Connector animation.
    const connectorEndPos: any = {
      x: this.nodeRadius + 8,
      y: this.nodeRadius + 12,
    };

    connector
      .selectAll("path")
      .transition(t)
      .attr("d", (n: Node | any) =>
        drawPathMouse(
          { x: 0, y: 0 },
          n.state.isFocused && !connectionDrag
            ? connectorEndPos
            : { x: 0, y: 0 }
        )
      );

    connector
      .select(".end")
      .transition(t)
      .attr("transform", (n: Node) =>
        n.state.isFocused && !connectionDrag
          ? `translate(${connectorEndPos.x}, ${connectorEndPos.y})`
          : "translate(0,0)"
      );

    connector.selectAll(".color").style("stroke", "currentColor");
    connector.selectAll("line.bgcolor").attr("stroke", this.bgcolor);
    connector.select("circle.color").attr("fill", this.bgcolor);
  }
}
