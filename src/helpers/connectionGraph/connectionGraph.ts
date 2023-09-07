// connectionGraph.ts

import { Selection, Transition, drag, select, transition } from "d3";

import { Connection } from "@/types/connectionTypes";
import { NetworkGraph } from "@/types/networkGraphTypes";

import { drawPathNode } from "./connectionGraphPath";
import { BaseNetworkGraph } from "../networkGraph/baseNetworkGraph";

export class ConnectionGraph {
  private _networkGraph: NetworkGraph;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
  }

  get networkGraph(): BaseNetworkGraph {
    return this._networkGraph as BaseNetworkGraph;
  }

  get state(): any {
    return this._networkGraph.workspace.state;
  }

  get strokeWidth(): number {
    return this._networkGraph.config.strokeWidth;
  }

  /**
   * Drag connection graph by moving its node graphs.
   */
  drag(event: MouseEvent, connection: Connection): void {
    if (this.state.dragLine) return;
    const sourceNodePosition = connection.source.view.state.position;
    // @ts-ignore
    sourceNodePosition.x += event.dx;
    // @ts-ignore
    sourceNodePosition.y += event.dy;

    const targetNodePosition = connection.target.view.state.position;
    // @ts-ignore
    targetNodePosition.x += event.dx;
    // @ts-ignore
    targetNodePosition.y += event.dy;

    this._networkGraph.render();
  }

  /**
   * Initialize a connection graph.
   */
  init(
    connection: Connection,
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
      .on("mouseover", (_, c: Connection) => {
        c.state.focus();
        // Draw line between selected node and focused connection.
        if (
          c.network.nodes.state.selectedNode &&
          this.state.dragLine
        ) {
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

        if (
          network.nodes.state.selectedNode &&
          workspace.state.dragLine
        ) {
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

    // @ts-ignore
    selector.each((connection: BaseConnection, idx: number, elements: any[]) => {
      const elem = select(elements[idx]);

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
        .text(connection.synapse ? connection.synapse.weight : '');

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
   * This function should be called when connections in the network are changed.
   */
  update(): void {
    if (!this._networkGraph.selector) return;

    const connections: Selection<any, any, any, any> =
      this._networkGraph.selector
        .select("g#connections")
        .selectAll("g.connection")
        .data(this.networkGraph.network.connections.all);

    const dragging = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      // @ts-ignore
      .on("drag", (e: MouseEvent, c: Connection) => this.drag(e, c))
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    connections
      .enter()
      .append("g")
      .attr("class", "connection")
      .attr("color", (c: Connection) => c.source.view.color)
      .attr("idx", (c: Connection) => c.idx)
      .attr("hash", (c: Connection) => c.state.shortHash)
      .style("opacity", 0)
      // @ts-ignore
      .call(dragging)
      .each((c: Connection, i: number, e) => this.init(c, i, e));

    connections.exit().remove();

    this.render();
  }
}
