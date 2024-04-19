// connectionGraph.ts

import {
  DragBehavior,
  Selection,
  Transition,
  drag,
  select,
  transition,
} from "d3";

import { BaseNetworkGraph } from "../networkGraph/networkGraph";
import { INetworkGraphWorkspaceState } from "../networkGraph/networkGraphWorkspace";
import { TConnection } from "@/types/connectionTypes";
import { TNetworkGraph } from "@/types/networkGraphTypes";
import { drawPathNode } from "./connectionGraphPath";

export class ConnectionGraph {
  private _networkGraph: TNetworkGraph;

  constructor(networkGraph: TNetworkGraph) {
    this._networkGraph = networkGraph;
  }

  get networkGraph(): BaseNetworkGraph {
    return this._networkGraph as BaseNetworkGraph;
  }

  get state(): INetworkGraphWorkspaceState {
    return this._networkGraph.workspace.state;
  }

  get strokeWidth(): number {
    return this._networkGraph.config?.localStorage.strokeWidth;
  }

  /**
   * Drag connection graph by moving its node graphs.
   * @param event mouse event
   * @param connection connection object
   */
  drag(event: MouseEvent, connection: TConnection): void {
    if (this.state.dragLine || !connection) return;

    // @ts-ignore - Property 'dx'/'dy' does not exist on type 'MouseEvent'.
    const pos: { x: number; y: number } = { x: event.dx, y: event.dy };

    if (connection.hasOwnProperty("source")) {
      const sourceNodePosition = connection.source.view.state.position;
      sourceNodePosition.x += pos.x;
      sourceNodePosition.y += pos.y;
    }

    const targetNodePosition = connection.target.view.state.position;
    targetNodePosition.x += pos.x;
    targetNodePosition.y += pos.y;

    this._networkGraph.render();
  }

  /**
   * Initialize a connection graph.
   * @param connection connection object
   * @param idx index of the element
   * @param elements SVG elements
   */
  init(
    connection: TConnection,
    idx: number,
    elements: SVGGElement[] | ArrayLike<SVGGElement>
  ): void {
    const elem: Selection<any, any, any, any> = select(elements[idx]);

    elem.selectAll("*").remove();

    elem
      .append("path")
      .style("fill", "none")
      .style("stroke", "black")
      .style("opacity", 0)
      .attr("stroke-linecap", "round")
      .style("stroke-width", 30);

    elem
      .append("path")
      .attr("class", "color")
      .style("fill", "none")
      .style("opacity", 1)
      .attr("stroke-linecap", "round")
      .style("stroke-width", this.strokeWidth)
      .style("pointer-events", "none");

    // elem
    //   .append("text");

    elem
      .on("mouseover", (_, c: TConnection) => {
        c.state.focus();
        // Draw line between selected node and focused connection.
        if (c.network.nodes.state.selectedNode && this.state.dragLine) {
          this._networkGraph.workspace.dragline.drawPath(
            c.network.nodes.state.selectedNode.view.state.position,
            c.view.markerEndPosition
          );
        }
        this._networkGraph.update();
      })
      .on("mouseout", () => {
        this._networkGraph.network.connections.unfocusConnection();
        this._networkGraph.update();
      })
      .on("click", () => {
        const network = this._networkGraph.network;
        const workspace = this._networkGraph.workspace;
        connection.source.state.focus();

        if (network.nodes.state.selectedNode && workspace.state.dragLine) {
          // Set cursor position of the focused connection.
          workspace.updateCursorPosition(connection.view.centerPosition);

          // Disable animation in network workspace.
          workspace.animationOff();

          // Hide all synapse parameters.
          // connection.synapse.hideAllParams();
          // connection.synapse.changes();

          // Update record colors of the weight recorder.
          network.nodes.state.selectedNode.updateRecordsColor();
        } else {
          connection.state.select();
        }
      });
  }

  /**
   * Render connection graphs.
   */
  render(): void {
    select("g#connections").style("pointer-events", () =>
      this._networkGraph.workspace.state.dragLine ? "none" : ""
    );
    const selector = select("g#connections").selectAll("g.connection");

    const duration: number = this._networkGraph.workspace.state.dragging
      ? 0
      : 250;
    const t: Transition<any, any, any, any> = transition().duration(duration);

    const connections = select("g#connections").selectAll("g.connection");
    connections
      .style("color", (c: any) => "var(--node" + c.source.idx + "-color)")
      .transition(t)
      .style("opacity", 1);

    // @ts-ignore - Argument of type '(connection: TConnection, idx: number, elements: any[]) => void' is not
    // assignable to parameter of type 'ValueFn<BaseType, unknown, void>'. Types of parameters 'connection' and
    // 'datum' are incompatible. Type 'unknown' is not assignable to type 'TConnection'.
    selector.each((connection: TConnection, idx: number, elements: any[]) => {
      const elem: Selection<any, any, any, any> = select(elements[idx]);

      elem
        .selectAll("path")
        .transition(t)
        .attr(
          "d",
          drawPathNode(
            connection.source.view.state.position,
            connection.target.view.state.position,
            connection.view.connectionGraphOptions
          )
        );

      elem
        .select("path.color")
        .style("stroke", "currentColor")
        .style(
          "stroke-width",
          this.strokeWidth * (connection.state.isFocused ? 1.2 : 1)
        )
        .style("opacity", connection.view.opacity ? 1 : 0.3)
        .attr("marker-end", `url(#syn-${connection.idx})`)
        .style(
          "stroke-dasharray",
          connection.view.probabilistic() ? "7.85" : ""
        );

      elem.transition(t).delay(duration).style("opacity", 1);

      // const pos = connection.view.markerEndPosition;

      this._networkGraph.selector
        ?.selectAll(`#syn-${connection.idx}`)
        .select("text")
        .attr("dx", connection.view.toRight ? 8 : -8)
        .attr("dy", connection.view.toRight ? 3.5 : -4.5)
        .classed("toLeft", !connection.view.toRight)
        .text(connection.synapse ? connection.synapse.weight : "");

      // .style("font-family", "Roboto")
      // .style("font-size", "0.7em", "important")
      // .style("font-weight", "900")
      // .style("pointer-events", "none")
      // .style("text-anchor", "middle")
      // .attr("transform", `translate(${pos.x},${pos.y})`);
    });
  }

  /**
   * Update connections in network graph.
   *
   * @remarks
   * This function should be called when connections are changed.
   */
  update(): void {
    if (!this._networkGraph.selector) return;

    const connections: Selection<any, any, any, any> =
      this._networkGraph.selector
        .select("g#connections")
        .selectAll("g.connection")
        .data(this.networkGraph.network.connections.all);

    const dragging: DragBehavior<any, unknown, unknown> = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      .on("drag", (e: MouseEvent, c: TConnection | unknown) =>
        this.drag(e, c as TConnection)
      )
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    connections
      .enter()
      .append("g")
      .attr("class", "connection")
      .attr("color", (c: TConnection) => c.source.view.color)
      .attr("idx", (c: TConnection) => c.idx)
      .attr("hash", (c: TConnection) => c.hash)
      .style("opacity", 0)
      .call(dragging, null)
      .each((c: TConnection, i: number, e) => this.init(c, i, e));

    connections.exit().remove();

    this.render();
  }
}
