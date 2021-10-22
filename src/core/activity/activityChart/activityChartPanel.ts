import * as math from 'mathjs';

import { ActivityChartPanelModel } from './activityChartPanelModel';
import { ActivityChartGraph } from './activityChartGraph';
import { Config } from '../../config';

import { AnalogSignalPlotModel } from './activityChartPanelModels/analogSignalPlotModel';
import { AnalogSignalHistogramModel } from './activityChartPanelModels/analogSignalHistogramModel';
import { SpikeTimesRasterPlotModel } from './activityChartPanelModels/spikeTimesRasterPlotModel';
import { SpikeTimesHistogramModel } from './activityChartPanelModels/spikeTimesHistogramModel';
import { SpikeSendersHistogramModel } from './activityChartPanelModels/spikeSendersHistogramModel';
import { InterSpikeIntervalHistogramModel } from './activityChartPanelModels/interSpikeIntervalHistogramModel';
import { CVISIHistogramModel } from './activityChartPanelModels/CVISIHistogramModel';

export class ActivityChartPanel extends Config {
  // private static readonly _name = 'ActivityGraphPanel';
  // private _activities: Activity[] = [];
  private _graph: ActivityChartGraph; // parent
  private _layout: any = {
    xaxis: {
      showgrid: true,
      title: '',
    },
    yaxis: {
      height: 1,
      showgrid: true,
      title: '',
    },
  };
  private _models: any[] = [
    // {
    //   activityType: 'analog',
    //   component: InputAnalogSignalPlotPanel,
    //   id: 'input-analog-signal-plot',
    //   icon: 'mdi-chart-bell-curve-cumulative',
    //   label: 'input analog signals',
    // },
    // {
    //   activityType: 'analog',
    //   component: NeuronAnalogSignalPlotPanel,
    //   id: 'neuron-analog-signal-plot',
    //   icon: 'mdi-chart-bell-curve-cumulative',
    //   label: 'neuron analog signals',
    // },
    {
      activityType: 'analog',
      component: AnalogSignalPlotModel,
      id: 'analogSignalPlot',
      icon: 'mdi-chart-bell-curve-cumulative',
      label: 'analog signals',
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
      label: 'spike times',
    },
    {
      activityType: 'spike',
      component: SpikeTimesHistogramModel,
      id: 'spikeTimesHistogram',
      icon: 'mdi-chart-bar',
      label: 'spike times',
    },
    {
      activityType: 'spike',
      component: SpikeSendersHistogramModel,
      id: 'spikeSendersHistogram',
      icon: 'mdi-chart-bar',
      label: 'spike senders',
    },
    {
      activityType: 'spike',
      component: InterSpikeIntervalHistogramModel,
      id: 'interSpikeIntervalHistogram',
      icon: 'mdi-chart-bar',
      label: 'inter-spike interval',
    },
    {
      activityType: 'spike',
      component: CVISIHistogramModel,
      id: 'CVISIHistogram',
      icon: 'mdi-chart-bar',
      label: 'CV of ISI',
    },
  ];
  private _model: ActivityChartPanelModel;
  private _state = {
    initialized: false,
    visible: true,
  };
  private _xaxis = 1;

  constructor(graph: ActivityChartGraph, model: any = {}) {
    super('ActivityGraphPanel');
    this._graph = graph;
    this.selectModel(model.id);
  }

  // get activities(): Activity[] {
  //   return this._activities;
  // }
  //
  // set activities(value: Activity[]) {
  //   this._activities = value;
  // }

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

  // /**
  //  * Check if it has any activities.
  //  */
  // hasActivities(): boolean {
  //   return this.activities.length > 0;
  // }

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

  selectModel(modelId: string = 'spikeTimesRasterPlot'): void {
    if (modelId) {
      const model: any = this._models.find(
        (model: any) => model.id === modelId
      );
      if (model) {
        this._model = new model.component(this);
        this._state.initialized = true;
      }
    }

    if (!this._state.initialized) {
      this._model = new SpikeTimesRasterPlotModel(this);
      this._state.initialized = true;
    }
  }

  /**
   * Initialize activity graph panel.
   */
  init(): void {
    // console.log('Init model for activities.');
    this._model.init();
  }

  /**
   * Update model for activities.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    // console.log('Update model for activities.');
    this._model.update();
  }

  updateLayout(): void {
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
   * Update model for activities.
   *
   * @remarks
   * It requires activity data.
   */
  updateColor(): void {
    // console.log('Update model for activities.');
    this._model.updateColor();
  }

  /**
   * Update layout label.
   *
   * @remarks
   * It is a replacement for abstract component.
   */
  updateLayoutLabel(data: any = undefined): void {
    data;
  }

  // /**
  //  * Update records in panel state.
  //  *
  //  * @remarks
  //  * It needs activity data.
  //  */
  // updateStateRecords(): void {
  //   if (this.state.records.length === this.model.activities.length) {
  //     return;
  //   }
  //   this.state.records = this.model.activities.map(
  //     (activity: Activity) => activity.records
  //   );
  // }

  /**
   * Remove this panel.
   */
  remove(): void {
    this._graph.removePanel(this);
  }
}
