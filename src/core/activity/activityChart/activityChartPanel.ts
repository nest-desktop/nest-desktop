import * as math from 'mathjs';

import { ActivityChartPanelModel } from './activityChartPanelModel';
import { ActivityChartGraph } from './activityChartGraph';

import { AnalogSignalHistogramModel } from './activityChartPanelModels/analogSignalHistogramModel';
import { AnalogSignalPlotModel } from './activityChartPanelModels/analogSignalPlotModel';
import { CVISIHistogramModel } from './activityChartPanelModels/CVISIHistogramModel';
import { InterSpikeIntervalHistogramModel } from './activityChartPanelModels/interSpikeIntervalHistogramModel';
import { SenderCVISIPlotModel } from './activityChartPanelModels/senderCVISIPlotModel';
import { SenderMeanISIPlotModel } from './activityChartPanelModels/senderMeanISIPlotModel';
import { SenderSpikeCountPlotModel } from './activityChartPanelModels/senderSpikeCountPlotModel';
import { SpikeTimesHistogramModel } from './activityChartPanelModels/spikeTimesHistogramModel';
import { SpikeTimesRasterPlotModel } from './activityChartPanelModels/spikeTimesRasterPlotModel';

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
  private _models: any[] = [
    {
      activityType: 'analog',
      component: AnalogSignalPlotModel,
      id: 'analogSignalPlot',
      icon: 'mdi-chart-bell-curve-cumulative',
      label: 'Analog signals',
    },
    {
      activityType: 'analog',
      component: AnalogSignalHistogramModel,
      id: 'analogSignalHistogram',
      icon: 'mdi-chart-bar',
      label: 'analog signals',
    },
    {
      activityType: 'spike',
      component: SpikeTimesRasterPlotModel,
      id: 'spikeTimesRasterPlot',
      icon: 'mdi-chart-scatter-plot',
      label: 'Spike times',
    },
    {
      activityType: 'spike',
      component: SpikeTimesHistogramModel,
      id: 'spikeTimesHistogram',
      icon: 'mdi-chart-bar',
      label: 'Spike times',
    },
    {
      activityType: 'spike',
      component: InterSpikeIntervalHistogramModel,
      id: 'interSpikeIntervalHistogram',
      icon: 'mdi-chart-bar',
      label: 'Inter-spike interval',
    },
    {
      activityType: 'spike',
      component: CVISIHistogramModel,
      id: 'CVISIHistogram',
      icon: 'mdi-chart-bar',
      label: 'CV of ISI',
    },
    {
      activityType: 'spike',
      component: SenderSpikeCountPlotModel,
      id: 'senderSpikeCountPlot',
      icon: 'mdi-chart-bell-curve-cumulative',
      label: 'Spike count in each sender',
    },
    {
      activityType: 'spike',
      component: SenderMeanISIPlotModel,
      id: 'senderMeanISIPlot',
      icon: 'mdi-chart-bell-curve-cumulative',
      label: 'Mean ISI in each sender',
    },
    {
      activityType: 'spike',
      component: SenderCVISIPlotModel,
      id: 'senderCVISIPlot',
      icon: 'mdi-chart-bell-curve-cumulative',
      label: 'CV ISI in each sender',
    },
  ];
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

  get models(): ActivityChartPanelModel[] {
    return this._models;
  }

  get modelsAnalog(): ActivityChartPanelModel[] {
    return this._models.filter(
      (model: ActivityChartPanelModel) => model.activityType === 'analog'
    );
  }

  get modelsSpike(): ActivityChartPanelModel[] {
    return this._models.filter(
      (model: ActivityChartPanelModel) => model.activityType === 'spike'
    );
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
      const model: any = this._models.find(
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
