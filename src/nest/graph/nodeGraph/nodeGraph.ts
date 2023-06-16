// nodeGraph.ts

import { Selection, Transition, drag, select, transition } from "d3";

import { NetworkGraph } from "../networkGraph/networkGraph";
import { Node } from "@nest/core/node/node";
import { NodeGraphConnector } from "./nodeGraphConnector";
import { NodeGraphShape } from "./nodeGraphShape";

export class NodeGraph {
  private _networkGraph: NetworkGraph;
  private _nodeGraphConnector: NodeGraphConnector;
  private _nodeGraphShape: NodeGraphShape;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
    this._nodeGraphConnector = new NodeGraphConnector(networkGraph);
    this._nodeGraphShape = new NodeGraphShape(networkGraph);
  }

  get network(): any {
    return this._networkGraph.network;
  }

  get state(): any {
    return this._networkGraph.workspace.state;
  }

  /**
   * Initialize node graph.
   */
  init(
    node: Node,
    idx: number,
    elements: SVGGElement[] | ArrayLike<SVGGElement>
  ): void {
    const elem: Selection<any, any, any, any> = select(elements[idx]);
    elem.selectAll("*").remove();

    this._nodeGraphConnector.init(elem);
    this._nodeGraphShape.init(elem, node);

    elem.on("mouseover", (_, n: Node) => {
      node.state.focus();
      // Draw line between selected node and focused node.
      if (node.state.isAnySelected && this.state.enableConnection) {
        this._networkGraph.workspace.dragline.drawPath(
          this.network.state.selectedNode.view.position,
          n.view.position
        );
      }
      this.render();
    });

    elem.on("mouseout", () => {
      this.network.state.resetFocus();
      this.render();
    });
  }

  /**
   * Update nodes in network graph.
   *
   * @remarks
   * This function should be called when nodes is changed.
   */
  update(): void {
    const nodes: Selection<any, any, any, any> = this._networkGraph.selector
      .select("g#nodes")
      .selectAll("g.node")
      .data(this.network.nodes.all, (n: any) => n.state.hash);

    nodes
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("color", (n: Node) => n.view.color)
      .attr("idx", (n: Node) => n.idx)
      .attr("weight", (n: Node) => n.view.weight)
      .attr(
        "transform",
        (n: Node) =>
          `translate(${n.view.position.x},${n.view.position.y}) scale( ${
            n.state.isFocused ? 1.2 : 1
          })`
      )
      .style("opacity", 0)
      // @ts-ignore
      .call(
        drag()
          .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
          // @ts-ignore
          .on("drag", (e: MouseEvent, n: Node) => this.drag(e, n))
          .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e))
      )
      .each((n: Node, i: number, e) => this.init(n, i, e));

    nodes.exit().remove();

    this.render();
  }

  /**
   * Drag node graph.
   */
  drag(event: MouseEvent, node: Node): void {
    if (this.state.enableConnection) {
      return;
    }

    node.view.position.x = event.x;
    node.view.position.y = event.y;
    this._networkGraph.network.nodes.cleanWeightRecorders();
    this._networkGraph.render();
  }

  /**
   * Render node graph.
   */
  render(): void {
    this._nodeGraphShape.render();
    this._nodeGraphConnector.render();

    const duration: number = this.state.dragging ? 0 : 250;
    const t: Transition<any, any, any, any> = transition().duration(duration);

    const nodes = select("g#nodes").selectAll("g.node");
    nodes
      .transition(t)
      .style("opacity", 1)
      .attr("color", (n: any) => n.view.color)
      .attr(
        "transform",
        (n: any) =>
          `translate(${n.view.position.x},${n.view.position.y}) scale( ${
            n.state.isFocused ? 1.2 : 1
          })`
      );
  }
}
