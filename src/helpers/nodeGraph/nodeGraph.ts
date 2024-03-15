// nodeGraph.ts

import { Selection, Transition, drag, select, transition } from "d3";

import { BaseObj } from "../common/base";
import { NodeGraphConnector } from "./nodeGraphConnector";
import { NodeGraphShape } from "./nodeGraphShape";
import { TNetwork } from "@/types/networkTypes";
import { TNetworkGraph } from "@/types/networkGraphTypes";
import { TNode } from "@/types/nodeTypes";
// import { currentBackgroundColor } from "../common/theme";

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
   * Init node element.
   */
  initNode(
    node: TNode,
    idx: number,
    elements: SVGGElement[] | ArrayLike<SVGGElement>
  ): void {
    this.logger.trace("init node");
    const elem: Selection<any, any, any, any> = select(elements[idx]);
    elem.selectAll("*").remove();

    this._nodeGraphConnector.init(elem);
    this._nodeGraphShape.init(elem, node);

    elem.on("mouseover", (_, n: TNode) => {
      n.state.focus();
      // Draw line between selected node and focused node.
      if (
        n.nodes.state.selectedNode &&
        this._networkGraph.workspace.state.dragLine
      ) {
        const selectedNode = n.nodes.state.selectedNode;
        const sourcePos = selectedNode.view.state.position;
        this._networkGraph.workspace.dragline.drawPath(
          sourcePos,
          n.view.state.position
        );
      }
    });

    elem.on("mouseout", () => {
      this.network.nodes.unfocusNode();
    });
  }

  /**
   * Drag node graph.
   */
  drag(event: MouseEvent, node: TNode): void {
    this.logger.silly("drag");
    if (this._networkGraph.workspace.state.dragLine) return;

    node.view.state.position.x = event.x;
    node.view.state.position.y = event.y;
    this._networkGraph.render();
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
    const t: Transition<any, any, any, any> = transition().duration(duration);

    const nodes = select("g#nodes").selectAll("g.node");

    nodes
      .transition(t)
      .style("opacity", 1)
      .style("color", (n: any) => "var(--node" + n.idx + "-color)")
      .style("background-color", "rgb(var(--v-theme-background))")
      .attr(
        "transform",
        (n: any) =>
          `translate(${n.view.state.position.x},${n.view.state.position.y})`
      );

    nodes
      .selectAll(".core")
      .transition(t)
      .attr("transform", (n: any) => `scale( ${n.state.isFocused ? 1.2 : 1})`);
  }

  /**
   * Update nodes in network graph.
   *
   * @remarks
   * This function should be called when nodes is changed.
   */
  update(): void {
    this.logger.silly("update");
    if (!this._networkGraph.selector) return;

    const nodes: Selection<any, any, any, any> = this._networkGraph.selector
      .select("g#nodes")
      .selectAll("g.node")
      .data(this.network.nodes.all, (n: any) => n.hash);

    const dragging = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      // @ts-ignore
      .on("drag", (e: MouseEvent, n: TNode) => this.drag(e, n))
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    nodes
      .enter()
      .append("g")
      .attr("class", "node")
      .style("color", (n: any) => "var(--node" + n.idx + "-color)")
      .attr("idx", (n: TNode) => n.idx)
      .attr("weight", (n: TNode) => n.view.synWeights as string)
      .attr(
        "transform",
        (n: TNode) =>
          `translate(${n.view.state.position.x},${
            n.view.state.position.y
          }) scale( ${n.state.isFocused ? 1.2 : 1})`
      )
      .style("opacity", 0)
      // @ts-ignore
      .call(dragging)
      .each((n: TNode, i: number, e) => this.initNode(n, i, e));

    nodes.exit().remove();

    this.render();
  }
}
