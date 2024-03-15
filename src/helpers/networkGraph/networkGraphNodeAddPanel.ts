// networkGraphNodeAddPanel.ts
import { Arc, Selection, arc } from "d3";

import { darkMode } from "../common/theme";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { TNetwork } from "@/types/networkTypes";

import { useModelDBStore } from "@/stores/model/modelDBStore";
const modelDBStore = useModelDBStore();

export class NetworkGraphNodeAddPanel {
  private _workspace: NetworkGraphWorkspace;
  private _selector: Selection<any, any, any, any>;
  private _elementTypes: string[] = ["recorder", "neuron", "stimulator"];

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

  get network(): TNetwork | undefined {
    return this._workspace.network;
  }

  get position(): any {
    return this._workspace.state.cursorPosition;
  }

  get nodeRadius(): number {
    return this._workspace.networkGraph.config?.localStorage.nodeRadius;
  }

  get strokeWidth(): number {
    return this._workspace.networkGraph.config?.localStorage.strokeWidth;
  }

  get textColor(): string {
    return darkMode() ? "white" : "#121212";
  }

  /**
   * Close panel.
   */
  close(): void {
    this._selector.style("display", "none");
    this.init();
  }

  /**
   * Draw arc frame.
   * @param idx number
   * @param sections number
   * @param label string
   * @returns Selection
   */
  drawArcFrame(
    selector: Selection<any, any, any, any>,
    radius: number,
    idx: number,
    sections: number,
    classFrame: string = "",
    title: string = "",
    label: string = ""
  ): Selection<any, any, any, any> {
    const arcFrame: Arc<any, any> = arc()
      .innerRadius(radius - this.strokeWidth)
      .outerRadius(radius + 21)
      .cornerRadius(3);

    const panel: Selection<any, any, any, any> = selector
      .append("g")
      .attr("class", classFrame + " " + title);

    panel
      .append("path")
      .attr("class", "menuItem color")
      .datum({
        startAngle: (Math.PI * idx * 2) / sections,
        endAngle: (Math.PI * (idx + 1) * 2) / sections,
      })
      .attr("fill-opacity", "0.5")
      .style("cursor", "pointer")
      .style("stroke", this.bgColor)
      .style("stroke-width", 2)
      .attr("d", arcFrame);

    panel
      .on("mouseover", () => {
        panel.select(".menuItem").attr("fill-opacity", "0.9");
        panel.select(".label").style("fill", darkMode() ? "#121212" : "white");

        // this.showTooltip(label);
        panel.select(".models").style("display", "block");
      })
      .on("mouseout", () => {
        // this.hideTooltip();

        panel.select(".menuItem").attr("fill-opacity", "0.5");
        panel.select(".label").style("fill", darkMode() ? "white" : "#121212");

        panel.select(".models").style("display", "none");
      });

    const f: number = (idx * 2) / sections + 1 / sections;
    const radiusText: number = (radius * 2 + 18) / 2;
    panel
      .append("text")
      .attr("class", "label text-button textcolor")
      .attr("dominant-baseline", "middle")
      .attr("dx", Math.sin(Math.PI * f) * radiusText)
      .attr("dy", -1 * Math.cos(Math.PI * f) * radiusText)
      .style("font-size", "0.7em", "important")
      .style("font-weight", "900")
      .style("pointer-events", "none")
      .style("text-anchor", "middle")
      .text(label ? label : title.slice(0, 1));

    panel.append("title").text(title);

    return panel;
  }

  drawModelMenuItem(
    panel: Selection<any, any, any, any>,
    idx: number,
    elementType: string,
    model: any
  ): Selection<any, any, any, any> {
    const layer = Math.floor(idx / 3);
    const idxOffset = this._elementTypes.indexOf(elementType) * 3 + layer * 6;

    // const layer = Math.floor(idx / 8);
    // const idxOffset = this._elementTypes.indexOf(elementType) * 3 + layer;

    const modelPanel = this.drawArcFrame(
      panel,
      this.nodeRadius * (2 + 1 * layer),
      idx + idxOffset,
      9,
      "model",
      model.title,
      model.label
    );

    modelPanel.select(".menuItem").on("mouseup", () => {
      this.close();
      if (this.network == undefined) {
        return;
      }
      // this._workspace.state.elementType = elementType;
      // this.update();

      this._workspace.animationOff();

      this.network.createNode(model.title, {
        elementType,
        position: Object.assign({}, this.position),
      });

      this._workspace.networkGraph.update();
      this._workspace.networkGraph.workspace.updateTransform();
    });
    return modelPanel;
  }

  /**
   * Draw tooltip.
   */
  drawTooltip(): void {
    const tooltipHeight = 16;
    const tooltipOffset = 5 + tooltipHeight / 2 + this.nodeRadius * 2;

    const tooltip = this._selector
      .append("g")
      .attr("class", "tooltip")
      .attr("transform", "translate(0, -" + tooltipOffset + ")")
      .style("visibility", "hidden");

    tooltip
      .append("rect")
      .attr("class", "bgcolor")
      .attr("height", tooltipHeight + "px")
      .attr("width", "0")
      .style("stroke", "grey")
      .style("transform", "translate(-50%, -50%)")
      .style("transform-box", "fill-box");

    tooltip
      .append("text")
      .attr("class", "label textcolor text-button")
      .attr("dominant-baseline", "middle")
      .attr("dy", 1)
      .style("font-size", "0.7em", "important")
      .style("font-weight", "900")
      .style("pointer-events", "none")
      .style("text-anchor", "middle");
  }

  /**
   * Hide tooltip.
   */
  hideTooltip(): void {
    this._selector
      .select("g.tooltip")
      .style("visibility", "hidden")
      .select("text.label")
      .text("");
  }

  /**
   * Initialize panel to add node.
   */
  init(): void {
    this._selector.style("display", "none");
    this._selector.selectAll("*").remove();

    this._selector
      .append("circle")
      .attr("class", "bgcolor")
      .attr("fill-opacity", "0.8")
      .attr("r", this.nodeRadius - this.strokeWidth)
      .on("click", () => {
        this._workspace.reset();
      })
      .on("contextmenu", (e: MouseEvent) => {
        e.preventDefault();
        this._workspace.reset();
      });

    this._elementTypes.forEach((elementType: string, idx: number) => {
      this.drawArcFrame(
        this._selector,
        this.nodeRadius,
        idx,
        this._elementTypes.length,
        "elementType",
        elementType,
        ""
      );

      this.updateModelMenu(elementType);
      this.update();
    });

    // this.drawTooltip();
  }

  /**
   * Open panel.
   */
  open(): void {
    this._selector
      .style("display", "block")
      .attr(
        "transform",
        () => `translate(${this.position.x},${this.position.y})`
      )
      .style("opacity", "0.8");
    this.update();
  }

  /**
   * Show tooltip.
   * @param label string
   */
  showTooltip(label: string): void {
    const tooltip = this._selector
      .select("g.tooltip")
      .style("visibility", "visible");
    tooltip.select("rect").attr("width", 8 + label.length * 8 + "px");
    tooltip.select("text.label").text(tooltip.attr("data-label"));
  }

  /**
   * Update color of node add panel.
   */
  update(): void {
    this._selector
      .selectAll(".color")
      .attr("fill", this.network ? this.color : "grey");

    this._selector.selectAll(".bgcolor").attr("fill", this.bgColor);
    this._selector.selectAll(".textcolor").attr("fill", this.textColor);

    // if (this._workspace.state.elementType) {
    //   const tooltipHeight = 16;
    //   const tooltipOffset = 5 + tooltipHeight / 2 + this.nodeRadius * 3;
    //   this._selector
    //     .select(".tooltip")
    //     .attr("transform", "translate(0, -" + tooltipOffset + ")");
    // }
  }

  /**
   * Update model menu.
   */
  updateModelMenu(elementType: string, favoriteOnly: boolean = true): void {
    const panel = this._selector.select("." + elementType);
    panel.select(".models").remove();

    const modelsPanel = panel
      .append("g")
      .attr("class", "models")
      .style("display", "none");

    const models = modelDBStore
      .getModelsByElementType(elementType)
      .map((model) => ({
        favorite: model.favorite,
        title: model.id,
        label: model.abbreviation,
      }));

    models
      .filter((model) => model.favorite || !favoriteOnly)
      .forEach((model, modelIdx) =>
        this.drawModelMenuItem(modelsPanel, modelIdx, elementType, model)
      );

    // Select default model by element type.
    panel.select(".menuItem").on("mouseup", () => {
      // this.close();
      if (this.network == undefined) {
        return;
      }

      this.updateModelMenu(elementType, false);
      this.update();
      panel.select(".models").style("display", "block");

      // this._workspace.animationOff();

      // this.network.createNode(undefined, {
      //   elementType,
      //   position: Object.assign({}, this.position),
      // });

      // this._workspace.networkGraph.update();
      // this._workspace.networkGraph.workspace.updateTransform();
    });
  }
}
