// activityChartPanel.ts - 7 anys

import * as math from "mathjs";

import {
  ActivityChartPanelModel,
  ActivityChartPanelModelProps,
} from "./activityChartPanelModel";
import { ActivityChartGraph } from "../activityChartGraph";

import { SpikeTimesRasterPlotModel } from "./activityChartPanelModels/spikeTimesRasterPlotModel";

export interface ActivityChartPanelProps {
  model?: ActivityChartPanelModelProps;
}

export class ActivityChartPanel {
  // private static readonly _name = 'ActivityGraphPanel';
  // private _activities: Activity[] = [];
  private _graph: ActivityChartGraph; // parent
  private _layout: any = {
    xaxis: {
      showgrid: true,
      title: "",
    },
    yaxis: {
      height: 10,
      showgrid: true,
      title: "",
    },
  };
  private _model: ActivityChartPanelModel;
  private _state = {
    initialized: false,
    visible: true,
  };
  private _xaxis = 1;

  constructor(graph: ActivityChartGraph, panel: ActivityChartPanelProps = {}) {
    this._graph = graph;
    this._model = new SpikeTimesRasterPlotModel(this);

    this.selectModel(
      panel.model ? panel.model.id : "spikeTimesRasterPlot",
      panel.model
    );
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

  get layout(): any {
    return this._layout;
  }

  get model(): ActivityChartPanelModel {
    return this._model;
  }

  get params(): any[] {
    return [];
  }

  get state(): any {
    return this._state;
  }

  get xaxis(): number {
    return this._xaxis;
  }

  set xaxis(value: number) {
    this._xaxis = value;
  }

  get yaxis(): number {
    return this.graph.panelsVisible.indexOf(this) + 1;
  }

  /**
   * Capitalize axis label.
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  decreaseHeight(): void {
    if (this.height === 1) {
      return;
    }
    this.height -= 1;
    this._graph.update();
  }

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

  selectModel(
    modelId: string = "spikeTimesRasterPlot",
    modelSpec: any = {}
  ): void {
    if (modelId) {
      const model: any = this._graph.models.find(
        (model: any) => model.id === modelId
      );
      if (model) {
        this._model = new model.component(this, modelSpec);
        this._state.initialized = true;
      }
    }

    if (!this._state.initialized) {
      this._model = new SpikeTimesRasterPlotModel(this, modelSpec);
      this._state.initialized = true;
    }
  }

  toggleVisible(): void {
    this._state.visible = !this._state.visible;
    this._graph.update();
  }

  /**
   * Serialize for JSON.
   * @return activity chart panel object
   */
  toJSON(): ActivityChartPanelProps {
    return { model: this._model.toJSON() };
  }

  /**
   * Update layout of the panel.
   */
  updatePanelLayout(): void {
    const panels: ActivityChartPanel[] = this.graph.panelsVisible;
    const heights: number[] = panels.map(
      (panel: ActivityChartPanel) => panel.layout.yaxis.height
    );
    const heightTotal: number = math.sum(heights);
    heights.reverse();
    const heightCumsum: number[] = heights.map(
      (
        (sum: number) => (value: number) =>
          (sum += value)
      )(0)
    );
    const steps = heightCumsum.map((h: number) => h / heightTotal);
    steps.unshift(0);
    steps.reverse();
    const margin: number = this.xaxis === 1 ? 0.02 : 0.07;
    const domain: number[] = [
      steps[this.yaxis],
      steps[this.yaxis - 1] - margin,
    ];
    this.layout.yaxis.domain = domain;
    this.layout.xaxis.anchor = "y" + this.yaxis;
  }
}
