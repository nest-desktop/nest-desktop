// connectionGraph.ts

import { drag, select, transition } from "d3";

import { TConnection, TDragBehavior, TNetworkGraph, TNode, TSelection } from "@/types";

import { BaseObj } from "../common/base";
import { BaseNetworkGraph } from "../networkGraph/networkGraph";
import { INetworkGraphWorkspaceState } from "../networkGraph/networkGraphWorkspace";
import { NodeGroup } from "../node/nodeGroup";
import { drawPathNode } from "./connectionGraphPath";

export class ConnectionGraph extends BaseObj {
  private _networkGraph: TNetworkGraph;

  constructor(networkGraph: TNetworkGraph) {
    super({ logger: { settings: { minLevel: 3 } } });
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

    // @ts-expect-error Property 'dx'/'dy' does not exist on type 'MouseEvent'.
    const pos: { x: number; y: number } = { x: event.dx, y: event.dy };

    if (connection.source.isNode) {
      const sourceNodePosition = connection.sourceNode.view.position;
      sourceNodePosition.x += pos.x;
      sourceNodePosition.y += pos.y;
    } else {
      connection.sourceNodeGroup.nodeItemsDeep.forEach((node: TNode) => {
        const nodePosition = node.view.position;
        nodePosition.x += pos.x;
        nodePosition.y += pos.y;
      });
    }

    if (connection.target.isNode) {
      const targetNodePosition = connection.target.view.position;
      targetNodePosition.x += pos.x;
      targetNodePosition.y += pos.y;
    } else {
      connection.targetNodeGroup.nodeItemsDeep.forEach((node: TNode) => {
        const nodePosition = node.view.position;
        nodePosition.x += pos.x;
        nodePosition.y += pos.y;
      });
    }

    connection.nodeGroups.forEach((nodeGroup: NodeGroup) => nodeGroup.view.updateCentroid());

    this._networkGraph.render();
  }

  /**
   * Initialize a connection graph.
   * @param connection connection object
   * @param idx index of the element
   * @param elements SVG elements
   */
  init(connection: TConnection, idx: number, elements: SVGGElement[] | ArrayLike<SVGGElement>): void {
    const elem: TSelection = select(elements[idx]);

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
        if (c.network.connections.state.selectedNode && this.state.dragLine)
          this._networkGraph.workspace.dragline.drawPath(
            c.network.connections.state.selectedNode.view.position,
            c.view.markerEndPosition,
          );

        this._networkGraph.update();
      })
      .on("mouseout", () => {
        this._networkGraph.network.connections.unfocusConnection();
        this._networkGraph.update();
      })
      .on("click", () => {
        const network = this._networkGraph.network;
        const workspace = this._networkGraph.workspace;
        connection.sourceNode.view.focus();

        if (network.connections.state.selectedNode && workspace.state.dragLine) {
          // Set cursor position of the focused connection.
          workspace.updateCursorPosition(connection.view.centerPosition);

          // Disable animation in network workspace.
          workspace.animationOff();

          // Hide all synapse parameters.
          // connection.synapse.hideAllParams();
          // connection.synapse.changes();

          // Update record colors of the weight recorder.
          if (network.connections.state.selectedNode.isNode) {
            const selectedNode = network.connections.state.selectedNode as TNode;
            selectedNode.updateRecordsColor();
          }
        } else {
          connection.state.select();
        }
      })
      .on("contextmenu", (event: MouseEvent, c: TConnection) => {
        event.preventDefault();
        this._networkGraph.workspace.reset();

        this._networkGraph.openContextMenu([event.clientX, event.clientY], {
          connection: c as TConnection,
        });
      });
  }

  /**
   * Render connection graphs.
   */
  render(): void {
    this.logger.trace("render");

    select("g#connections").style("pointer-events", () => (this._networkGraph.workspace.state.dragLine ? "none" : ""));
    const connections = select("g#connections").selectAll("g.connection");

    const duration: number = this._networkGraph.workspace.state.dragging ? 0 : 250;
    const t = transition().duration(duration);

    connections
      .style("color", (c: TConnection | any) => "var(--colorNode" + c.source.idx + ")")
      .transition(t)
      .style("opacity", 1);

    // @ts-expect-error Argument of type '(connection: TConnection, idx: number, elements: any[]) => void' is not
    // assignable to parameter of type 'ValueFn<BaseType, unknown, void>'. Types of parameters 'connection' and
    // 'datum' are incompatible. Type 'unknown' is not assignable to type 'TConnection'.
    connections.each((connection: TConnection, idx: number, elements: any[]) => {
      const elem: TSelection = select(elements[idx]);

      elem
        .selectAll("path")
        .transition(t)
        .attr(
          "d",
          drawPathNode(
            connection.source.view.position,
            connection.target.view.position,
            connection.view.connectionGraphOptions,
          ),
        );

      elem
        .select("path.color")
        .style("stroke", "currentColor")
        .style("stroke-width", this.strokeWidth * (connection.state.isFocused ? 1.2 : 1))
        .style("opacity", connection.view.opacity ? 1 : 0.3)
        .attr("marker-end", `url(#syn-${connection.idx})`)
        .style("stroke-dasharray", connection.view.probabilistic() ? "7.85" : "");

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
   * @remarks This function should be called when connections are changed.
   */
  update(): void {
    if (!this._networkGraph.selector) return;

    const connections = this._networkGraph.selector
      .select("g#connections")
      .selectAll("g.connection")
      .data(this.networkGraph.network.connections.all, (c: TConnection | any) => c.uuid);

    const dragging: TDragBehavior = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      .on("drag", (e: MouseEvent, c: TConnection | unknown) => this.drag(e, c as TConnection))
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    connections
      .enter()
      .append("g")
      .attr("class", "connection")
      .attr("color", (c: TConnection) => c.sourceNode.view.color)
      .attr("idx", (c: TConnection) => c.idx)
      .attr("hash", (c: TConnection) => c.hash)
      .style("opacity", 0)
      .call(dragging, null)
      .each((c: TConnection, i: number, e) => this.init(c, i, e));

    connections.exit().remove();

    this.render();
  }
}
