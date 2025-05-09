// networkGraphNodeAddPanel.ts

import { arc } from "d3";
import { UnwrapRef, reactive } from "vue";

import { TArc, TModel, TNetwork, TSelection } from "@/types";
import { useAppStore } from "@/stores/appStore";

import { BaseObj } from "../common/base";
import { NetworkGraphWorkspace } from "./networkGraphWorkspace";
import { TElementType } from "../model/model";
import { darkMode } from "../common/theme";

export interface INetworkGraphAddPanelState {
  elementType: TElementType | null;
  menuItems: { onClick: () => void; title: string; value: string }[];
  modelValue: boolean;
  target: [number, number];
}

export class NetworkGraphNodeAddPanel extends BaseObj {
  private _elementTypes: TElementType[] = ["recorder", "neuron", "stimulator"];
  private _selector: TSelection;
  private _state: UnwrapRef<INetworkGraphAddPanelState> = reactive({
    elementType: null,
    menuItems: [],
    modelValue: false,
    target: [0, 0],
  });
  private _workspace: NetworkGraphWorkspace;

  constructor(networkGraphWorkspace: NetworkGraphWorkspace) {
    super();

    this._workspace = networkGraphWorkspace;
    this._selector = this._workspace.selector.select("g#nodeAddPanel");

    this.init();
  }

  get bgColor(): string {
    return darkMode() ? "#121212" : "white";
  }

  get color(): string {
    return this.network ? this.network.getNodeColor(this.network.nodes.all.length) : "#424242";
  }

  get network(): TNetwork | undefined {
    return this._workspace.network;
  }

  get position(): { x: number; y: number } {
    return this._workspace.state.cursorPosition;
  }

  get nodeRadius(): number {
    return this._workspace.networkGraph.config?.localStorage.nodeRadius;
  }

  get state(): UnwrapRef<INetworkGraphAddPanelState> {
    return this._state;
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
    this.closeModelsMenu();
  }

  /**
   * Close models menu.
   */
  closeModelsMenu(): void {
    this._state.modelValue = false;
    this._state.target = [0, 0];
    setTimeout(() => {
      this._state.elementType = null;
      this._state.menuItems = [];
    }, 200);
  }

  /**
   * Draw arc frame.
   * @param classFrame
   * @param idx number
   * @param label string
   * @param radius
   * @param sections number
   * @param selector
   * @param title
   * @returns selection
   */
  drawArcFrame(
    selector: TSelection,
    radius: number,
    idx: number,
    sections: number,
    classFrame: string = "",
    title: string = "",
    label: string = "",
  ) {
    const arcFrame: TArc = arc()
      .innerRadius(radius - this.strokeWidth)
      .outerRadius(radius + 21)
      .cornerRadius(3);

    const panel = selector.append("g").attr("class", classFrame + " " + title);

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
        panel.select(".models").style("display", "block");
      })
      .on("mouseout", () => {
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

  /**
   * Draw model menu item.
   * @param panel
   * @param idx
   * @param elementType
   * @param model
   * @returns selection
   */
  drawModelMenuItem(panel: TSelection, idx: number, elementType: TElementType, model: TModel) {
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
      model.id,
      model.abbreviation,
    );

    modelPanel.select(".menuItem").on("click", () => {
      this.close();
      if (this.network == undefined) return;

      this._workspace.animationOff();

      this.network.createNode(model.id, {
        elementType,
        position: Object.assign({}, this.position),
      });

      this._workspace.networkGraph.update();
      this._workspace.networkGraph.workspace.updateTransform();
    });

    return modelPanel;
  }

  /**
   * Initialize panel to add node.
   */
  init(): void {
    this.logger.trace("init");

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

    this._elementTypes.forEach((elementType: TElementType, idx: number) => {
      this.drawArcFrame(
        this._selector,
        this.nodeRadius,
        idx,
        this._elementTypes.length,
        "elementType",
        elementType,
        "",
      );
      this.updateModelMenu(elementType);
    });

    this.update();
  }

  /**
   * Open panel.
   */
  open(): void {
    this.logger.trace("open");

    this._selector
      .style("display", "block")
      .attr("transform", () => `translate(${this.position.x},${this.position.y})`)
      .style("opacity", "0.8");

    this.updateColor();
  }

  openModelMenu(event: MouseEvent, elementType: TElementType): void {
    if (!this.network) return;

    if (this._state.modelValue) {
      const currentElementType = this._state.elementType;
      this.closeModelsMenu();
      if (currentElementType != elementType) setTimeout(() => this.openModelMenu(event, elementType), 200);
      return;
    }

    this._state.elementType = elementType;

    const models: TModel[] = this.network.project.modelDBStore.getModelsByElementType(elementType);

    const items = models.map((model: TModel) => ({
      title: model.state.label,
      value: model.id,
      onClick: () => this.selectModel(model.id, elementType),
    }));

    this._state.menuItems = items;
    this._state.target = [event.clientX, event.clientY];
    this._state.modelValue = true;
  }

  selectModel(modelId: string, elementType: TElementType): void {
    this.close();

    const appStore = useAppStore();
    const modelStore = appStore.currentWorkspace.stores.modelStore;

    if (!this.network) return;
    modelStore.updateRecentAddedModels(modelId, elementType);

    this._workspace.animationOff();

    this.network.createNode(modelId, {
      elementType,
      position: Object.assign({}, this.position),
    });

    this.updateModelMenu(elementType);
    this._workspace.networkGraph.update();
    this._workspace.networkGraph.workspace.updateTransform();
  }

  /**
   * Update color of node add panel.
   */
  update(): void {
    this.logger.trace("update");
  }

  /**
   * Update color.
   */
  updateColor(): void {
    this.logger.trace("update color");

    this._selector.selectAll(".color").attr("fill", this.network ? this.color : "grey");
    this._selector.selectAll(".bgcolor").attr("fill", this.bgColor);
    this._selector.selectAll(".textcolor").attr("fill", this.textColor);
  }

  /**
   * Update model menu.
   * @param elementType neuron, recorder, stimulator
   */
  updateModelMenu(elementType: TElementType): void {
    this.logger.trace("update model menu");

    const panel = this._selector.select("." + elementType);
    panel.select(".models").remove();

    const modelsPanel = panel.append("g").attr("class", "models").style("display", "none");

    if (this.network) {
      const appStore = useAppStore();
      const modelStore = appStore.currentWorkspace.stores.modelStore;

      modelStore.state.recentAddedModels[elementType].forEach((modelId: string, modelIdx: number) => {
        const model = modelStore.getModel(modelId);
        if (model) this.drawModelMenuItem(modelsPanel, modelIdx, elementType, model);
      });

      // Click on element type.
      panel.select(".menuItem").on("click", (event: MouseEvent) => {
        event.preventDefault();
        this.openModelMenu(event, elementType);
      });
    }
  }
}
