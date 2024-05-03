// nodeGroupGraph.ts

// https://observablehq.com/d/a8c7c885db875085
// https://stackoverflow.com/questions/30655950/d3-js-convex-hull-with-2-data-points

import { DragBehavior, drag, polygonHull } from "d3";

import { NodeGroup } from "../node/nodeGroup";
import { TNode } from "@/types/nodeTypes";
import { TNetworkGraph } from "@/types/networkGraphTypes";
import { TNetwork } from "@/types/networkTypes";

export class NodeGroupGraph {
  private _networkGraph: TNetworkGraph;

  constructor(networkGraph: TNetworkGraph) {
    this._networkGraph = networkGraph;
  }

  get network(): TNetwork {
    return this._networkGraph.network;
  }

  /**
   * Drag connection graph by moving its node graphs.
   * @param event mouse event
   * @param connection connection object
   */
  drag(event: MouseEvent, nodeGroup: NodeGroup): void {
    // @ts-ignore - Property 'dx'/'dy' does not exist on type 'MouseEvent'.
    const pos: { x: number; y: number } = { x: event.dx, y: event.dy };

    nodeGroup.nodes.forEach((node: TNode) => {
      const nodePosition = node.view.state.position;
      nodePosition.x += pos.x;
      nodePosition.y += pos.y;
    });

    this._networkGraph.render();
  }

  render(): void {
    this._networkGraph.selector
      .selectAll(".nodeGroup")
      .selectAll("path")
      .attr("d", (nodeGroup: NodeGroup | any) => {
        if (nodeGroup.nodes.length < 2) return "";
        const polygon = polygonGenerator(nodeGroup.nodes);
        return "M" + polygon.join("L") + "Z";
      });
  }

  update(): void {
    const nodeGroups = this._networkGraph.selector
      .select("#nodeGroups")
      .selectAll(".nodeGroup")
      .data(this.network.nodes.nodeGroups);

    // const dragging: DragBehavior<any, unknown, unknown> = drag()
    //   .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
    //   .on("drag", (event: MouseEvent): void => {
    //     // @ts-ignore - Property 'dx'/'dy' does not exist on type 'MouseEvent'.
    //     const pos: { x: number; y: number } = { x: event.dx, y: event.dy };

    //     console.log(pos);

    //     // drawNodeGroups(nodeGroups);
    //   })
    //   .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    const dragging: DragBehavior<any, unknown, unknown> = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      .on("drag", (e: MouseEvent, n: NodeGroup | unknown) =>
        this.drag(e, n as NodeGroup)
      )
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    nodeGroups
      .enter()
      .append("g")
      .style("cursor-events", "none")
      .attr("class", "nodeGroup")
      .append("path")
      .attr("fill", (d) => d.view.color)
      .attr("stroke", (d) => d.view.color)
      .style("stroke-linejoin", "round")
      .attr("stroke-width", 64)
      .style("opacity", 0.12);

    // @ts-ignore - Argument of type 'DragBehavior<any, unknown, unknown>' is not assignable to parameter of type
    // '(selection: Selection<BaseType, NodeGroup, BaseType, any>, args_0: null) => void'.
    nodeGroups.call(dragging, null);

    nodeGroups.exit().remove();

    this.render();
  }
}

var polygonGenerator = (nodes: TNode[]): [number, number][] => {
  let nodeCoords: [number, number][] = nodes.map((node: TNode) => [
    node.view.state.position.x,
    node.view.state.position.y,
  ]);

  // The two additional points will be sufficient for the convex hull algorithm.
  if (nodes.length == 2) {
    const pos1 = nodes[0].view.state.position;
    const pos2 = nodes[1].view.state.position;

    // [dx, dy] is the direction vector of the line.
    var dx = pos2.x - pos1.x;
    var dy = pos2.y - pos1.y;

    // Scale it to something very small.
    dx *= 0.001;
    dy *= 0.001;

    // Orthogonal directions to a 2D vector [dx, dy] are [dy, -dx] and [-dy, dx]
    // take the midpoint [mx, my] of the line and translate it in both directions.
    var mx = (pos1.x + pos2.x) * 0.5;
    var my = (pos1.y + pos2.y) * 0.5;
    nodeCoords = nodeCoords.concat([
      [mx + dy, my - dx],
      [mx - dy, my + dx],
    ]);
  }

  // Get positions of outer points.
  return polygonHull(nodeCoords) as [number, number][];
};
