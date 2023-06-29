// nodeGraphShape.ts

import { Selection, select } from "d3";
import { darkMode } from "@/utils/theme";
import { logger as mainLogger } from "@/utils/logger";

import { NetworkGraph } from "../networkGraph/networkGraph";
import { Node } from "@nest/core/node/node";

function anglePoint(deg: number, radius: number, y0: number = 0): number[] {
  const radian: number = (deg / 180) * Math.PI;
  return [Math.cos(radian) * radius, y0 - Math.sin(radian) * radius];
}

const logger = mainLogger.getSubLogger({ name: "node graph shape" });

function getHexagonPoints(radius: number): string {
  const a: number = radius * 0.9;
  const p0: number[] = anglePoint(30, a, 4);
  const p1: number[] = anglePoint(90, a, 4);
  const p2: number[] = anglePoint(150, a, 4);
  const p3: number[] = anglePoint(210, a, 4);
  const p4: number[] = anglePoint(270, a, 4);
  const p5: number[] = anglePoint(330, a, 4);
  const points: string = [
    p0.join(","),
    p1.join(","),
    p2.join(","),
    p3.join(","),
    p4.join(","),
    p5.join(","),
  ].join(",");
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
  const points: string = [
    p0.join(","),
    p1.join(","),
    p2.join(","),
    p3.join(","),
  ].join(",");
  return points;
}

function getTrianglePoints(radius: number): string {
  const a: number = radius;
  const p0: number[] = anglePoint(90, a, 4);
  const p1: number[] = anglePoint(210, a, 4);
  const p2: number[] = anglePoint(330, a, 4);
  // const points: string = [[-x,y].join(','),[2*x,0].join(','),[-x,-y].join(',')].join(',');
  const points: string = [p0.join(","), p1.join(","), p2.join(",")].join(",");
  return points;
}

function nodePoints(node: Node, radius: number): string {
  if (node.model.isStimulator) {
    return getHexagonPoints(radius);
  } else if (node.model.isRecorder) {
    return getRectanglePoints(radius);
  } else if (node.isExcitatoryNeuron) {
    return getTrianglePoints(radius);
  } else {
    return getSquarePoints(radius);
  }
}

export class NodeGraphShape {
  private _networkGraph: NetworkGraph;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
  }

  get bgcolor(): string {
    if (this._networkGraph.network == undefined) {
      return "white";
    }

    return darkMode() ? "#121212" : "white";
  }

  get nodeRadius(): number {
    return this._networkGraph.config.nodeRadius;
  }

  get strokeWidth(): number {
    return this._networkGraph.config.strokeWidth;
  }

  drawShape(selector: Selection<any, any, any, any>, node: Node): void {
    logger.trace("draw shape");
    selector.attr("elementType", node.model.elementType);
    selector.attr("weight", node.view.weight);

    const elem = selector.select(".core");
    elem.selectAll("*").remove();

    if (node.isInhibitoryNeuron) {
      elem.append("circle").attr("class", "shape").attr("r", this.nodeRadius);
    } else {
      elem
        .append("polygon")
        .attr("class", "shape")
        .attr("points", (n: Node) => nodePoints(n, this.nodeRadius));
    }

    elem
      .append("text")
      .attr("class", "text-button")
      .style("font-family", "Roboto")
      .style("font-size", "0.7em", "important")
      .style("font-weight", "900")
      .style("pointer-events", "none")
      .style("text-anchor", "middle");
  }

  /**
   * Initialize a node shape.
   */
  init(selector: Selection<any, any, any, any>, node: Node): void {
    const elem: Selection<any, any, any, any> = selector
      .append("g")
      .attr("class", "core");

    this.drawShape(selector, node);

    elem.on("click", (e: MouseEvent) => {
      const nodes = this._networkGraph.network.nodes;

      if (
        nodes.state.selectedNode &&
        this._networkGraph.workspace.state.dragLine
      ) {
        // Set cursor position of the focused node.
        this._networkGraph.workspace.updateCursorPosition(node.view.position);

        this._networkGraph.workspace.animationOff();
        this._networkGraph.network.connectNodes(
          nodes.state.selectedNode as Node,
          node
        );
        this._networkGraph.update();

        if (!this._networkGraph.workspace.altPressed) {
          nodes.unselectNode();
          this._networkGraph.workspace.reset();
          this._networkGraph.workspace.update();
        }
      } else if (this._networkGraph.workspace.altPressed) {
        node.state.select();
        this._networkGraph.workspace.reset();
        this._networkGraph.workspace.dragline.init(e);
      } else {
        node.state.select();
      }
    });

    elem.transition().style("opacity", 1);
  }

  /**
   * Render all node shapes.
   */
  render(): void {
    logger.trace("render");
    const nodes = select("g#nodes").selectAll("g.node");
    nodes.style("pointer-events", () =>
      this._networkGraph.network.nodes.isWeightRecorderSelected &&
      this._networkGraph.workspace.state.dragLine
        ? "none"
        : ""
    );

    // Check if neuron has to change its shape.
    //@ts-ignore
    nodes.each((node: Node, idx: number, elements: any[]) => {
      const elem = select(elements[idx]);

      if (
        elem.attr("elementType") !== node.model.elementType ||
        elem.attr("weight") !== node.view.weight
      ) {
        this.drawShape(elem, node);
      }

      elem
        .select(".shape")
        .style("stroke", "currentcolor")
        .attr("stroke-linecap", "round")
        .style("fill", this.bgcolor)
        .style(
          "stroke-width",
          (node.size > 1 ? 1.3 : 1) * this._networkGraph.config.strokeWidth
        )
        .style("stroke-dasharray", node.state.isSelected ? "7.85" : "");

      elem
        .select("text")
        .attr("dy", node.isInhibitoryNeuron ? "0.4em" : "0.8em")
        .style(
          "fill",
          darkMode() ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)"
        )
        .text(node.view.label);
    });
  }
}
