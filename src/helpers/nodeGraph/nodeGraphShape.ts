// nodeGraphShape.ts

import { Selection, select } from "d3";

import { TNetworkGraph, TNode } from "@/types";

import { BaseObj } from "../common/base";
import { NodeGroup } from "../node/nodeGroup";

function anglePoint(deg: number, radius: number, y0: number = 0): number[] {
  const radian: number = (deg / 180) * Math.PI;
  return [Math.cos(radian) * radius, y0 - Math.sin(radian) * radius];
}

function getHexagonPoints(radius: number): string {
  const a: number = radius * 0.9;
  const p0: number[] = anglePoint(30, a, 4);
  const p1: number[] = anglePoint(90, a, 4);
  const p2: number[] = anglePoint(150, a, 4);
  const p3: number[] = anglePoint(210, a, 4);
  const p4: number[] = anglePoint(270, a, 4);
  const p5: number[] = anglePoint(330, a, 4);
  const points: string = [p0.join(","), p1.join(","), p2.join(","), p3.join(","), p4.join(","), p5.join(",")].join(",");
  return points;
}

function getRectanglePoints(radius: number): string {
  const r: number = radius;
  const deg = 2;
  const b = 8;
  const y0 = Math.PI;
  const p0: number[] = anglePoint(45 - deg, r, y0);
  const p1: number[] = anglePoint(135 + deg, r, y0);
  const p2: number[] = anglePoint(225 - deg, r, y0);
  const p3: number[] = anglePoint(315 + deg, r, y0);
  const points: string = [
    [p0[0] + b, p0[1]].join(","),
    [p1[0] + b, p1[1]].join(","),
    [p2[0] - b, p2[1]].join(","),
    [p3[0] - b, p3[1]].join(","),
  ].join(",");
  return points;
}

function getSquarePoints(radius: number): string {
  const a: number = radius;
  const p0: number[] = anglePoint(45, a, 4);
  const p1: number[] = anglePoint(135, a, 4);
  const p2: number[] = anglePoint(225, a, 4);
  const p3: number[] = anglePoint(315, a, 4);
  const points: string = [p0.join(","), p1.join(","), p2.join(","), p3.join(",")].join(",");
  return points;
}

function getTrianglePoints(radius: number): string {
  const a: number = radius;
  const p0: number[] = anglePoint(90, a, 4);
  const p1: number[] = anglePoint(210, a, 4);
  const p2: number[] = anglePoint(330, a, 4);
  const points: string = [p0.join(","), p1.join(","), p2.join(",")].join(",");
  return points;
}

function nodePoints(node: TNode, radius: number): string {
  if (node.model?.isStimulator) {
    return getHexagonPoints(radius);
  } else if (node.model?.isRecorder) {
    return getRectanglePoints(radius);
  } else if (node.isExcitatoryNeuron) {
    return getTrianglePoints(radius);
  } else {
    return getSquarePoints(radius);
  }
}

export class NodeGraphShape extends BaseObj {
  private _networkGraph: TNetworkGraph;

  constructor(networkGraph: TNetworkGraph) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._networkGraph = networkGraph;
  }

  get nodeRadius(): number {
    return this._networkGraph.config?.localStorage.nodeRadius;
  }

  get strokeWidth(): number {
    return this._networkGraph.config?.localStorage.strokeWidth;
  }

  /**
   * Draw node shape.
   * @param selector
   * @param node node object
   */
  drawShape(selector: Selection<any, any, any, any>, node: NodeGroup | TNode): void {
    this.logger.trace("draw shape");

    selector.attr("elementType", node.elementType);
    selector.attr("weight", node.view.synWeights);

    const elem = selector.select(".core");
    elem.selectAll("*").remove();

    if (node.isGroup || node.isInhibitoryNeuron) {
      elem
        .append("circle")
        .attr("class", "shape")
        .attr("stroke", "currentcolor")
        .attr("fill", node.isGroup ? "currentcolor" : "")
        .attr("r", this.nodeRadius * 0.78);
    } else {
      elem
        .append("polygon")
        .attr("class", "shape")
        .attr("style", "stroke-linejoin: round")
        .attr("stroke", "currentcolor")
        .attr("fill", "white")
        .attr("points", (n: TNode) => nodePoints(n, this.nodeRadius));
    }

    elem
      .append("text")
      .attr("class", "text-button")
      .style("font-family", "Roboto, sans-serif", "important")
      .style("font-size", "0.7rem", "important")
      .style("font-weight", "900")
      .style("pointer-events", "none")
      .style("text-anchor", "middle")
      .style("text-transform", "uppercase", "important")
      .attr("fill", node.isGroup ? "currentcolor" : "rgb(var(--v-border-color))");
  }

  /**
   * Initialize a node shape.
   * @param selector
   * @param node node object
   */
  init(selector: Selection<any, any, any, any>, node: NodeGroup | TNode): void {
    this.logger.silly("init");

    const elem: Selection<any, any, any, any> = selector.append("g").attr("class", "core");

    this.drawShape(selector, node);

    elem.on("click", (e: MouseEvent) => {
      const nodes = this._networkGraph.network.nodes;
      const connections = this._networkGraph.network.connections;

      if (connections.state.selectedNode && this._networkGraph.workspace.state.dragLine) {
        // Set cursor position of the focused node.
        this._networkGraph.workspace.updateCursorPosition(node.view.position);

        this._networkGraph.workspace.animationOff();

        this._networkGraph.network.connectNodes(connections.state.selectedNode.idx, node.idx);
        this._networkGraph.update();

        if (!this._networkGraph.workspace.altPressed) {
          connections.state.selectedNode = null;
          this._networkGraph.workspace.reset();
          this._networkGraph.workspace.update();
        }
      } else if (this._networkGraph.workspace.altPressed) {
        node.selectForConnection();
        this._networkGraph.workspace.reset();
        this._networkGraph.workspace.dragline.init(e);
      } else if (this._networkGraph.workspace.ctrlPressed) {
        node.toggleSelection();
      } else {
        nodes.unselectNodes();
        node.select();
      }
    });

    elem.transition().style("opacity", 1);
  }

  /**
   * Render all node shapes.
   */
  render(): void {
    this.logger.silly("render");
    const nodes: Selection<any, any, any, any> = select("g#nodes").selectAll("g.node");

    // Check if neuron has to change its shape.
    nodes.each((node: TNode, idx: number, elements: any) => {
      const elem = select(elements[idx]);

      if (elem.attr("elementType") !== node.elementType || elem.attr("weight") !== node.view.synWeights) {
        this.drawShape(elem, node);
      }

      elem
        .select(".shape")
        .style("stroke-width", (node.size > 1 ? 1.5 : 1) * this._networkGraph.config?.localStorage.strokeWidth)
        .style("opacity", node.isGroup ? 0.12 : node.view.opacity ? 1 : 0.6);

      elem
        .select("text")
        .attr("dy", node.isGroup || node.isInhibitoryNeuron ? "0.4em" : "0.8em")
        .text(node.view.label);
    });
  }
}
