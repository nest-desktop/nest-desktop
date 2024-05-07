// nodeGroupGraph.ts

// https://observablehq.com/d/a8c7c885db875085
// https://stackoverflow.com/questions/30655950/d3-js-convex-hull-with-2-data-points

import { DragBehavior, drag, polygonCentroid, polygonHull } from "d3";

import { NodeGroup } from "../node/nodeGroup";
import { TNode } from "@/types/nodeTypes";
import { TNetworkGraph } from "@/types/networkGraphTypes";
import { TNetwork } from "@/types/networkTypes";
import { nextTick } from "vue";

const polygonGenerator = (nodes: TNode[]): [number, number][] => {
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

    nodeGroup.nodeItemsDeep.forEach((node: TNode) => {
      const nodePosition = node.view.state.position;
      nodePosition.x += pos.x;
      nodePosition.y += pos.y;
    });

    this._networkGraph.render();
  }

  render(): void {
    const nodeGroups = this._networkGraph.selector.selectAll(".nodeGroup");

    nodeGroups.selectAll("path").attr("d", (nodeGroup: NodeGroup | any) => {
      if (nodeGroup.nodeItemsDeep.length < 2) return "";
      const polygon = polygonGenerator(nodeGroup.nodeItemsDeep);
      const centroid = polygonCentroid(polygon);
      nodeGroup.view.state.centroid.x = centroid[0];
      nodeGroup.view.state.centroid.y = centroid[1];
      return (
        "M" +
        polygon
          .map((point) => [point[0] - centroid[0], point[1] - centroid[1]])
          .join("L") +
        "Z"
      );
    });

    nextTick(() =>
      nodeGroups.attr(
        "transform",
        (n: NodeGroup | any) =>
          `translate(${n.view.state.centroid.x},${n.view.state.centroid.y}) scale(${n.view.state.margin})`
      )
    );
  }

  update(): void {
    const nodeGroups = this._networkGraph.selector
      .select("#nodeGroups")
      .selectAll(".nodeGroup")
      .data(
        this.network.nodes.nodeGroups.toReversed(),
        (n: NodeGroup | unknown) => (n instanceof NodeGroup ? n.hash : "")
      );

    const dragging: DragBehavior<any, unknown, unknown> = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      .on("drag", (e: MouseEvent, n: NodeGroup | unknown) =>
        this.drag(e, n as NodeGroup)
      )
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    const g = nodeGroups
      .enter()
      .append("g")
      .style("cursor-events", "none")
      .attr("class", "nodeGroup");

    g.append("text")
      .attr("dy", "0.5em")
      .attr("letter-spacing", 1.5)
      .style("font-family", "Roboto, sans-serif", "important")
      .style("font-size", "0.85rem", "important")
      .style("font-weight", "800")
      .style("pointer-events", "none")
      .style("text-anchor", "middle")
      .style("text-transform", "uppercase", "important")
      .style("fill", (n: NodeGroup) => "var(--node" + n.idx + "-color)")
      .text((n: NodeGroup) => n.view.label);

    g.append("path")
      .style("fill", (n: NodeGroup) => "var(--node" + n.idx + "-color)")
      .style("stroke", (n: NodeGroup) => "var(--node" + n.idx + "-color)")
      .style("stroke-linejoin", "round")
      .attr("stroke-width", 64)
      .style("opacity", 0.12);

    nodeGroups.on("mouseover", (_, n: NodeGroup) => {
      // n.state.focus();
      // Draw line between selected node and focused node.
      if (
        n.parent.network.connections.state.selectedNode &&
        this._networkGraph.workspace.state.dragLine
      ) {
        const selectedNode = n.parent.network.connections.state.selectedNode;
        const sourcePos = selectedNode.view.state.position;
        this._networkGraph.workspace.dragline.drawPath(
          sourcePos,
          n.view.state.centroid
        );
      }
    });

    nodeGroups.on("click", (_, nodeGroup: NodeGroup) => {
      const nodes = this._networkGraph.network.nodes;
      const connections = this._networkGraph.network.connections;

      if (
        connections.state.selectedNode &&
        this._networkGraph.workspace.state.dragLine
      ) {
        // Set cursor position of the focused node.
        this._networkGraph.workspace.updateCursorPosition(
          nodeGroup.view.state.centroid
        );

        this._networkGraph.workspace.animationOff();

        this._networkGraph.network.connectNodes(
          connections.state.selectedNode.idx,
          nodeGroup.idx
        );
        this._networkGraph.update();

        if (!this._networkGraph.workspace.altPressed) {
          connections.state.selectedNode = null;
          this._networkGraph.workspace.reset();
          this._networkGraph.workspace.update();
        }
      } else if (this._networkGraph.workspace.ctrlPressed) {
        nodes.toggleNodeSelection(nodeGroup);
      } else {
        nodes.state.selectedNodes = [nodeGroup];
      }
    });

    // @ts-ignore - Argument of type 'DragBehavior<any, unknown, unknown>' is not assignable to parameter of type
    // '(selection: Selection<BaseType, NodeGroup, BaseType, any>, args_0: null) => void'.
    nodeGroups.call(dragging, null);

    nodeGroups.exit().remove();

    nextTick(() => this.render());
  }
}
