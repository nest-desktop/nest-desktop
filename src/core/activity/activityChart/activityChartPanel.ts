import * as math from 'mathjs';

import { ActivityChartPanelModel } from './activityChartPanelModel';
import { ActivityChartGraph } from './activityChartGraph';
import { SpikeTimesRasterPlot } from './spikeActivityPlots/spikeTimesRasterPlot';

export class ActivityChartPanel {
  // private static readonly _name = 'ActivityGraphPanel';
  // private _activities: Activity[] = [];
  private _graph: ActivityChartGraph; // parent
  private _layout: any = {
    xaxis: {
      showgrid: true,
      title: '',
    },
    yaxis: {
      height: 10,
      showgrid: true,
      title: '',
    },
  };
  private _model: ActivityChartPanelModel;
  private _state = {
    initialized: false,
    visible: true,
  };
  private _xaxis = 1;

  constructor(graph: ActivityChartGraph, panel: any = {}) {
    this._graph = graph;

    this.selectModel(
      panel.model ? panel.model.id : 'spikeTimesRasterPlot',
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

  toggleVisible(): void {
    this._state.visible = !this._state.visible;
    this._graph.update();
  }

  increaseHeight(): void {
    this.height += 1;
    this._graph.update();
  }

  decreaseHeight(): void {
    if (this.height === 1) {
      return;
    }
    this.height -= 1;
    this._graph.update();
  }

  selectModel(
    modelId: string = 'spikeTimesRasterPlot',
    modelSpec: any = {}
  ): void {
    if (modelId) {
      const model: any = this._graph.models.find(
        (model: any) => model.id === modelId
      );
      if (model) {
        modelSpec.icon = model.icon;
        modelSpec.label = model.label;
        this._model = new model.component(this, modelSpec ? modelSpec : model);
        this._state.initialized = true;
      }
    }

    if (!this._state.initialized) {
      this._model = new SpikeTimesRasterPlot(this, modelSpec);
      this._state.initialized = true;
    }
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

    const panelIdx = panels.indexOf(this);
    let margin = 0.005;

    // Set larger margin for panels with different xaxis to previous one.
    if (panelIdx > 0) {
      const prevPanel = panels[panelIdx - 1];
      if (this.xaxis != prevPanel.xaxis) {
        margin = 0.1;
      }
    }

    // Domain for panel height.
    const domain: number[] = [
      steps[this.yaxis],
      steps[this.yaxis - 1] - margin,
    ];
    this.layout.yaxis.domain = domain;
    this.layout.xaxis.anchor = 'y' + this.yaxis;
  }

  /**
   * Remove this panel.
   */
  remove(): void {
    this._graph.removePanel(this);
  }

  /**
   * Serialize for JSON.
   * @return activity chart panel object
   */
  toJSON(): any {
    return { model: this._model.toJSON() };
  }
}
