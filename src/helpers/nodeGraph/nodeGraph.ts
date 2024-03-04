// nodeGraph.ts

import { ILogObj, Logger } from "tslog";
import { Selection, Transition, drag, select, transition } from "d3";

import { Network } from "@/types/networkTypes";
import { NetworkGraph } from "@/types/networkGraphTypes";
import { Node } from "@/types/nodeTypes";
import { NodeGraphConnector } from "./nodeGraphConnector";
import { NodeGraphShape } from "./nodeGraphShape";
// import { currentBackgroundColor } from "@/helpers/common/theme";
import { logger as mainLogger } from "@/helpers/common/logger";

export class NodeGraph {
  private _logger: Logger<ILogObj>;
  private _networkGraph: NetworkGraph;
  private _nodeGraphConnector: NodeGraphConnector;
  private _nodeGraphShape: NodeGraphShape;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
    this._nodeGraphConnector = new NodeGraphConnector(networkGraph);
    this._nodeGraphShape = new NodeGraphShape(networkGraph);

    this._logger = mainLogger.getSubLogger({
      name: `[${this._networkGraph.network.project.shortId}] node graph`,
      minLevel: 3,
    });
  }

  get network(): Network {
    return this._networkGraph.network;
  }

  /**
   * Init node element.
   */
  initNode(
    node: Node,
    idx: number,
    elements: SVGGElement[] | ArrayLike<SVGGElement>
  ): void {
    this._logger.trace("init node");
    const elem: Selection<any, any, any, any> = select(elements[idx]);
    elem.selectAll("*").remove();

    this._nodeGraphConnector.init(elem);
    this._nodeGraphShape.init(elem, node);

    elem.on("mouseover", (_, n: Node) => {
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
  drag(event: MouseEvent, node: Node): void {
    this._logger.silly("drag");
    if (this._networkGraph.workspace.state.dragLine) return;

    node.view.state.position.x = event.x;
    node.view.state.position.y = event.y;
    this._networkGraph.render();
  }

  /**
   * Render node graph.
   */
  render(): void {
    this._logger.silly("render");

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
    this._logger.silly("update");
    if (!this._networkGraph.selector) return;

    const nodes: Selection<any, any, any, any> = this._networkGraph.selector
      .select("g#nodes")
      .selectAll("g.node")
      .data(this.network.nodes.all, (n: any) => n.state.hash);

    const dragging = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      // @ts-ignore
      .on("drag", (e: MouseEvent, n: Node) => this.drag(e, n))
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    nodes
      .enter()
      .append("g")
      .attr("class", "node")
      .style("color", (n: any) => "var(--node" + n.idx + "-color)")
      .attr("idx", (n: Node) => n.idx)
      .attr("weight", (n: Node) => n.view.synWeights as string)
      .attr(
        "transform",
        (n: Node) =>
          `translate(${n.view.state.position.x},${
            n.view.state.position.y
          }) scale( ${n.state.isFocused ? 1.2 : 1})`
      )
      .style("opacity", 0)
      // @ts-ignore
      .call(dragging)
      .each((n: Node, i: number, e) => this.initNode(n, i, e));

    nodes.exit().remove();

    this.render();
  }
}
