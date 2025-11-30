// activityChartPanel.ts

import { type UnwrapRef, reactive } from "vue";

import { BaseObj } from "@/core";
import { sum } from "@/utils";

import type { ActivityChartGraph } from "./activityChartGraph";
import type { ActivityChartPanelModel, IActivityChartPanelModelState } from "./activityChartPanelModel";
import { SpikeTimesRasterPlotModel } from "./activityChartPanelModels/spikeTimesRasterPlotModel";

export interface IActivityChartPanelState {
  model?: IActivityChartPanelModelState;
}

interface IActivityChartPanelLayoutState {
  shapes: {
    label?: {
      font: { size: number };
      text: string;
      textposition: string;
    };
    line?: {
      color: string;
      dash: string;
      width: number;
    };
    type: string;
    x0: number;
    x1: number;
    xref?: string;
    y0: number;
    y1: number;
    yref?: string;
  }[];
  xaxis: { anchor?: string; showgrid: boolean; title: { text: string }; type?: string };
  yaxis: {
    domain?: number[];
    height: number;
    showgrid: boolean;
    title: { text: string };
  };
}

interface IActivityChartPanelRefState {
  visible: boolean;
}

export class ActivityChartPanel extends BaseObj {
  // private static readonly _name = 'ActivityGraphPanel';
  // private _activities: Activity[] = [];
  private _graph: ActivityChartGraph; // parent
  private _layout: IActivityChartPanelLayoutState = {
    shapes: [],
    xaxis: {
      showgrid: true,
      title: {
        text: "x label",
      },
    },
    yaxis: {
      height: 10,
      showgrid: true,
      title: {
        text: "y label",
      },
    },
  };
  private _model: ActivityChartPanelModel;
  private _state: UnwrapRef<IActivityChartPanelRefState>;
  private _xAxis = 1;

  constructor(graph: ActivityChartGraph, panelState: IActivityChartPanelState = {}) {
    super();

    this._graph = graph;
    this._model = new SpikeTimesRasterPlotModel(this);

    this._state = reactive<IActivityChartPanelRefState>({
      visible: true,
    });

    this.selectModel(panelState.model ? panelState.model.id : "spikeTimesRasterPlot", panelState.model);
  }

  get graph(): ActivityChartGraph {
    return this._graph;
  }

  get height(): number {
    return this._layout.yaxis.height;
  }

  set height(value: number) {
    this._layout.yaxis.height = value;
  }

  get idx(): number {
    return this.graph.panels.indexOf(this);
  }

  get layout(): IActivityChartPanelLayoutState {
    return this._layout;
  }

  get model(): ActivityChartPanelModel {
    return this._model;
  }

  get state(): UnwrapRef<IActivityChartPanelRefState> {
    return this._state;
  }

  get xAxis(): number {
    return this._xAxis;
  }

  set xAxis(value: number) {
    this._xAxis = value;
  }

  get yAxis(): number {
    return this.graph.panelsVisible.indexOf(this) + 1;
  }

  /**
   * Capitalize text.
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Decrease panel height.
   */
  decreaseHeight(): void {
    if (this.height === 1) return;

    this.height -= 1;
    this._graph.update();
  }

  /**
   * Increase panel height.
   */
  increaseHeight(): void {
    this.height += 1;
    this._graph.update();
  }

  /**
   * Remove this panel.
   */
  remove(): void {
    this._graph.removePanel(this);
  }

  /**
   * Save activity chart panel to state.
   * @return activity chart panel state
   */
  override save(): IActivityChartPanelState {
    return { model: this._model.save() };
  }

  /**
   * Select panel model.
   * @param modelId
   * @param modelState
   */
  selectModel(modelId: string = "spikeTimesRasterPlot", modelState: IActivityChartPanelModelState = {}): void {
    if (modelId) {
      const model: IActivityChartPanelModelState | undefined = this._graph.models.find(
        (modelState: IActivityChartPanelModelState) => modelState.id === modelId,
      );
      if (model) {
        // @ts-expect-error Property 'component' does not exist on type 'IActivityChartPanelModelState'.
        this._model = new model.component(this, modelState);
      }
    }
  }

  /**
   * Toggle panel visibility.
   */
  toggleVisible(): void {
    this._state.visible = !this._state.visible;
    this._graph.update();
  }

  /**
   * Update layout of the panel.
   */
  updateLayout(): void {
    const panels: ActivityChartPanel[] = this.graph.panelsVisible;
    const heights: number[] = panels.map((panel: ActivityChartPanel) => panel.layout.yaxis.height);
    const heightTotal: number = sum(heights);
    heights.reverse();
    const heightCumSum: number[] = heights.map(
      (
        (sum: number) => (value: number) =>
          (sum += value)
      )(0),
    );
    const steps = heightCumSum.map((h: number) => h / heightTotal);
    steps.unshift(0);
    steps.reverse();
    const margin: number = this.xAxis === 1 ? 0.02 : 0.07;
    const domain: number[] = [steps[this.yAxis], steps[this.yAxis - 1] - margin];
    this.layout.yaxis.domain = domain;
    this.layout.xaxis.anchor = "y" + this.yAxis;
  }
}
