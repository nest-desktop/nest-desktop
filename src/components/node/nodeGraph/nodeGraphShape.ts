// nodeGraphShape.ts

import { ILogObj, Logger } from "tslog";
import { Selection, select } from "d3";

import { NetworkGraph } from "@/types/networkGraphTypes";
import { Node } from "@/types/nodeTypes";
import { logger as mainLogger } from "@/helpers/logger";

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
  private _logger: Logger<ILogObj>;

  constructor(networkGraph: NetworkGraph) {
    this._networkGraph = networkGraph;
    this._logger = mainLogger.getSubLogger({
      name: `[${this._networkGraph.network.project.shortId}] node graph shape`,
    });
  }

  get nodeRadius(): number {
    return this._networkGraph.config.nodeRadius;
  }

  get strokeWidth(): number {
    return this._networkGraph.config.strokeWidth;
  }

  drawShape(selector: Selection<any, any, any, any>, node: Node): void {
    this._logger.trace("draw shape");
    selector.attr("elementType", node.model.elementType);
    selector.attr("weight", node.view.synWeights);

    const elem = selector.select(".core");
    elem.selectAll("*").remove();

    if (node.isInhibitoryNeuron) {
      elem
        .append("circle")
        .attr("class", "shape")
        .attr("stroke", "currentcolor")
        .attr("r", this.nodeRadius * 0.78);
    } else {
      elem
        .append("polygon")
        .attr("class", "shape")
        .attr("style", "stroke-linejoin: round")
        .attr("stroke", "currentcolor")
        .attr("fill", "white")
        .attr("points", (n: Node) => nodePoints(n, this.nodeRadius));
    }

    elem
      .append("text")
      .attr("class", "text-button")
      .style("font-family", "Roboto, sans-serif", "important")
      .style("font-size", "0.7rem", "important")
      .style("font-weight", "900")
      .style("pointer-events", "none")
      .style("text-anchor", "middle")
      .style("text-transform", "uppercase", "important");
  }

  /**
   * Initialize a node shape.
   */
  init(selector: Selection<any, any, any, any>, node: Node): void {
    this._logger.silly("init");
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
        this._networkGraph.workspace.updateCursorPosition(
          node.view.state.position
        );

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
    this._logger.silly("render");
    const nodes = select("g#nodes").selectAll("g.node");
    nodes.style("pointer-events", () =>
      this._networkGraph.workspace.state.dragLine ? "none" : ""
    );

    // Check if neuron has to change its shape.
    //@ts-ignore
    nodes.each((node: Node, idx: number, elements: any[]) => {
      const elem = select(elements[idx]);

      if (
        elem.attr("elementType") !== node.model.elementType ||
        elem.attr("weight") !== node.view.synWeights
      ) {
        this.drawShape(elem, node);
      }

      elem
        .select(".shape")
        .style(
          "stroke-width",
          (node.size > 1 ? 1.5 : 1) * this._networkGraph.config.strokeWidth
        )
        .style("opacity", node.view.opacity ? 1 : 0.6);

      elem
        .select("text")
        .attr("dy", node.isInhibitoryNeuron ? "0.4em" : "0.8em")
        .text(node.view.label);
    });
  }
}
