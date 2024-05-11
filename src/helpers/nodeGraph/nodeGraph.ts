// nodeGraph.ts

import { nextTick } from "vue";
import {
  DragBehavior,
  Selection,
  Transition,
  drag,
  select,
  transition,
} from "d3";

import { BaseObj } from "../common/base";
import { NodeGraphConnector } from "./nodeGraphConnector";
import { NodeGraphShape } from "./nodeGraphShape";
import { TNetwork } from "@/types/networkTypes";
import { TNetworkGraph } from "@/types/networkGraphTypes";
import { TNode } from "@/types/nodeTypes";
import { BaseNode } from "../node/node";
import { NodeGroup } from "../node/nodeGroup";

export class NodeGraph extends BaseObj {
  private _networkGraph: TNetworkGraph;
  private _nodeGraphConnector: NodeGraphConnector;
  private _nodeGraphShape: NodeGraphShape;

  constructor(networkGraph: TNetworkGraph) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._networkGraph = networkGraph;
    this._nodeGraphConnector = new NodeGraphConnector(networkGraph);
    this._nodeGraphShape = new NodeGraphShape(networkGraph);
  }

  get network(): TNetwork {
    return this._networkGraph.network;
  }

  /**
   * Drag node graph.
   * @param event mouse event
   * @param node node object
   */
  drag(event: MouseEvent, node: NodeGroup | TNode): void {
    this.logger.silly("drag");

    if (this._networkGraph.workspace.state.dragLine) return;

    if (node.isGroup) {
      const nodeGroup = node as NodeGroup;

      // @ts-ignore - Property 'dx'/'dy' does not exist on type 'MouseEvent'.
      const pos: { x: number; y: number } = { x: event.dx, y: event.dy };

      nodeGroup.nodeItemsDeep.forEach((node: TNode) => {
        const nodePosition = node.view.position;
        nodePosition.x += pos.x;
        nodePosition.y += pos.y;
      });
      nodeGroup.view.updateCentroid();
    } else {
      node.view.position.x = event.x;
      node.view.position.y = event.y;

      node.nodeGroups.forEach((nodeGroup: NodeGroup) =>
        nodeGroup.view.updateCentroid()
      );
    }

    this._networkGraph.render();
  }

  /**
   * Init node element.
   * @param node node or node group object
   * @param idx index of the elements
   * @param elements SVG elements
   */
  initNode(
    node: NodeGroup | TNode,
    idx: number,
    elements: SVGGElement[] | ArrayLike<SVGGElement>
  ): void {
    this.logger.trace("init node");

    const elem: Selection<any, any, null, undefined> = select(elements[idx]);
    elem.selectAll("*").remove();

    this._nodeGraphConnector.init(elem);
    this._nodeGraphShape.init(elem, node);

    elem.on("mouseover", (_, n: NodeGroup | TNode) => {
      n.view.focus();

      // Draw line between selected node and focused node.
      if (
        n.network.connections.state.selectedNode &&
        this._networkGraph.workspace.state.dragLine
      ) {
        const selectedNode = n.network.connections.state.selectedNode;
        const sourcePos = selectedNode.view.position;
        this._networkGraph.workspace.dragline.drawPath(
          sourcePos,
          n.view.position
        );
      }
    });

    elem.on("mouseout", () => {
      this.network.nodes.unfocusNode();
    });

    /**
     * Trigger node menu on right mouse click.
     */
    elem.on("contextmenu", (event: MouseEvent, n: NodeGroup | TNode) => {
      event.preventDefault();
      this._networkGraph.workspace.reset();

      this._networkGraph.state.nodeMenu.node = n as TNode;
      this._networkGraph.state.nodeMenu.offset = [event.clientX, event.clientY];
      nextTick(() => (this._networkGraph.state.nodeMenu.open = true));
    });
  }

  /**
   * Render node graph.
   */
  render(): void {
    this.logger.silly("render");

    this._nodeGraphConnector.render();
    this._nodeGraphShape.render();

    const duration: number = this._networkGraph.workspace.state.dragging
      ? 0
      : 250;
    const t: Transition<any, any, null, undefined> =
      transition().duration(duration);

    const nodes = select("g#nodes").selectAll("g.node");

    nodes
      .transition(t)
      .style("opacity", 1)
      .style(
        "color",
        (n: NodeGroup | TNode | any) => "var(--node" + n.idx + "-color)"
      )
      .style("background-color", "rgb(var(--v-theme-background))")
      .attr(
        "transform",
        (n: NodeGroup | TNode | any) =>
          `translate(${n.view.position.x},${n.view.position.y})`
      );

    nodes
      .selectAll(".core")
      .transition(t)
      .attr(
        "transform",
        (n: NodeGroup | TNode | any) => `scale( ${n.view.isFocused ? 1.2 : 1})`
      );
  }

  /**
   * Update nodes in network graph.
   *
   * @remarks
   * This function should be called when nodes are changed.
   */
  update(): void {
    this.logger.silly("update");

    if (!this._networkGraph.selector) return;

    const nodes: Selection<any, any, any, undefined> =
      this._networkGraph.selector
        .select("g#nodes")
        .selectAll("g.node")
        .data(this.network.nodes.nodes, (n: NodeGroup | TNode | unknown) =>
          n instanceof BaseNode ? n.hash : ""
        );

    const dragging: DragBehavior<any, any, any> = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      .on("drag", (e: MouseEvent, n: NodeGroup | TNode | unknown) =>
        this.drag(e, n as TNode)
      )
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    nodes
      .enter()
      .append("g")
      .attr("class", "node")
      .classed("nodeGroup", (n: NodeGroup | TNode) => n.isGroup)
      .style(
        "color",
        (n: NodeGroup | TNode) => "var(--node" + n.idx + "-color)"
      )
      .attr("idx", (n: NodeGroup | TNode) => n.idx)
      .attr("weight", (n: NodeGroup | TNode) => n.view.synWeights as string)
      .attr(
        "transform",
        (n: NodeGroup | TNode) =>
          `translate(${n.view.position.x},${n.view.position.y}) scale( ${
            n.view.isFocused ? 1.2 : 1
          })`
      )
      .style("opacity", 0)
      .call(dragging, null)
      .each((n: NodeGroup | TNode, i: number, e) => this.initNode(n, i, e));

    nodes.exit().remove();

    this.render();
  }
}
