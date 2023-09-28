// networkGraphNodeAddPanel.ts
import { Arc, Selection, arc } from "d3";

import { darkMode } from "@/helpers/common/theme";
import { Network } from "@/types/networkTypes";

import { NetworkGraphWorkspace } from "./networkGraphWorkspace";

export class NetworkGraphNodeAddPanel {
  private _workspace: NetworkGraphWorkspace;
  private _selector: Selection<any, any, any, any>;

  constructor(networkGraphWorkspace: NetworkGraphWorkspace) {
    this._workspace = networkGraphWorkspace;
    this._selector = this._workspace.selector.select("g#nodeAddPanel");
    this.init();
  }

  get bgColor(): string {
    return darkMode() ? "#121212" : "white";
  }

  get color(): string {
    return this.network
      ? this.network.getNodeColor(this.network.nodes.all.length)
      : "#424242";
  }

  get network(): Network | undefined {
    return this._workspace.network;
  }

  get position(): any {
    return this._workspace.state.cursorPosition;
  }

  get nodeRadius(): number {
    return this._workspace.networkGraph.config.nodeRadius;
  }

  get strokeWidth(): number {
    return this._workspace.networkGraph.config.strokeWidth;
  }

  get textColor(): string {
    return darkMode() ? "white" : "#121212";
  }

  /**
   * Initialize panel to add node.
   */
  init(): void {
    this._selector.style("display", "none");
    this._selector
      .append("circle")
      .attr("class", "bgcolor select")
      .attr("fill-opacity", "0.8")
      .attr("r", this.nodeRadius - this.strokeWidth)
      .on("click", () => {
        this.close();
      })
      .on("contextmenu", (e: MouseEvent) => {
        e.preventDefault();
        this._workspace.reset();
      });

    const arcFrame: Arc<any, any> = arc()
      .innerRadius(this.nodeRadius - this.strokeWidth)
      .outerRadius(this.nodeRadius * 2);

    const elementTypes: string[] = ["recorder", "neuron", "stimulator"];
    elementTypes.forEach((elementType: string, idx: number) => {
      const panel: Selection<any, any, any, any> = this._selector
        .append("g")
        .attr("class", "select " + elementType)
        .append("path")
        .attr("class", "bgcolor")
        .datum({
          startAngle: (Math.PI * idx * 2) / 3,
          endAngle: (Math.PI * (idx + 1) * 2) / 3,
        })
        .attr("fill-opacity", "0.8")
        .style("cursor", "pointer")
        .style("stroke", this.network ? this.color : "grey")
        .style("stroke-width", this.strokeWidth)
        .attr("d", arcFrame)
        .on("mouseover", () => {
          this._selector
            .select("g.tooltip")
            .style("visibility", "visible")
            .select("text.label")
            .text(elementType);
          panel.style("fill", this.network ? this.color : "grey");
          this._selector
            .selectAll("." + elementType)
            .style("fill", darkMode() ? "#121212" : "white");
        })
        .on("mouseout", () => {
          this._selector
            .select("g.tooltip")
            .style("visibility", "hidden")
            .select("text.label")
            .text("");
          panel.style("fill", darkMode() ? "#121212" : "white");
          this._selector
            .selectAll(".label")
            .style("fill", darkMode() ? "white" : "#121212");
        })
        .on("mouseup", () => {
          this.close();
          if (this.network == undefined) {
            return;
          }
          this._workspace.animationOff();
          this.network.createNode({
            elementType,
            position: Object.assign({}, this.position),
          });
          this._workspace.networkGraph.update();
          this._workspace.networkGraph.workspace.updateTransform();
        });

      const f: number = (idx * 2) / 3 + 1 / 3;
      this._selector
        .append("text")
        .attr("class", "label select text-button textcolor " + elementType)
        .style("font-size", "0.7em", "important")
        .style("font-weight", "900")
        .style("pointer-events", "none")
        .style("text-anchor", "middle")
        .attr("dx", Math.sin(Math.PI * f) * 32 + 1)
        .attr("dy", -Math.cos(Math.PI * f) * 32 + 5)
        .text(elementType.slice(0, 1));
    });

    this._selector
      .append("g")
      .attr("class", "tooltip")
      .attr("transform", "translate(0, -54)")
      .style("visibility", "hidden");

    this._selector
      .select("g.tooltip")
      .append("rect")
      .attr("class", "bgcolor")
      .attr("height", "16px")
      .attr("transform", "translate(-37, -14)")
      .attr("width", "74px");

    this._selector
      .select("g.tooltip")
      .append("text")
      .attr("class", "label textcolor text-button")
      .style("font-size", "0.7em", "important")
      .style("font-weight", "900")
      .style("pointer-events", "none")
      .style("text-anchor", "middle");
  }

  /**
   * Update color of node add panel.
   */
  update(): void {
    this._selector.selectAll(".bgcolor").attr("fill", this.bgColor);

    this._selector
      .selectAll("path.bgcolor")
      .style("fill", this.bgColor)
      .style("stroke", () => this.color);

    this._selector.selectAll(".textcolor").attr("fill", this.textColor);

    this._selector.selectAll(".label").style("fill", this.textColor);
  }

  /**
   * Open panel.
   */
  open(): void {
    this.update();
    this._selector
      .style("display", "block")
      .attr(
        "transform",
        () => `translate(${this.position.x},${this.position.y})`
      )
      .style("opacity", "0.8");
  }

  /**
   * Close panel.
   */
  close(): void {
    this._selector.style("display", "none").style("opacity", "0");
  }
}
