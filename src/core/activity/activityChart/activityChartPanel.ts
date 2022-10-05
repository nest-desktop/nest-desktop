import * as math from 'mathjs';

import { ActivityChartPanelModel } from './activityChartPanelModel';
import { ActivityChartGraph } from './activityChartGraph';

import { AnalogSignalHistogram } from './analogSignalPlots/analogSignalHistogram';
import { AnalogSignalHeatmap } from './analogSignalPlots/analogSignalHeatmap';
import { AnalogSignalHistogram2d } from './analogSignalPlots/analogSignalHistogram2d';
import { AnalogSignalPlot } from './analogSignalPlots/analogSignalPlot';
import { CVISIHistogram } from './spikeActivityPlots/CVISIHistogram';
import { InterSpikeIntervalHistogramElephant } from './spikeActivityPlotsElephant/interSpikeIntervalHistogramElephant';
import { InterSpikeIntervalHistogram } from './spikeActivityPlots/interSpikeIntervalHistogram';
import { SenderCVISIPlot } from './spikeActivityPlots/senderCVISIPlot';
import { SenderMeanISIPlot } from './spikeActivityPlots/senderMeanISIPlot';
import { SenderSpikeCountPlot } from './spikeActivityPlots/senderSpikeCountPlot';
import { SpikeTimesHistogramElephant } from './spikeActivityPlotsElephant/SpikeTimesHistogramElephant';
import { SpikeTimesHistogram } from './spikeActivityPlots/spikeTimesHistogram';
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
  private _models: any[] = [
    {
      activityType: 'analog',
      component: AnalogSignalPlot,
      id: 'analogSignalPlot',
      icon: 'mdi-chart-bell-curve-cumulative',
      label: 'Analog signals',
    },
    {
      activityType: 'analog',
      component: AnalogSignalHistogram,
      id: 'analogSignalHistogram',
      icon: 'mdi-chart-bar',
      label: 'analog signals',
    },
    {
      activityType: 'analog',
      component: AnalogSignalHistogram2d,
      id: 'analogSignalHistogram2d',
      icon: 'mdi-map-outline',
      label: '2d histogram of analog signals',
    },
    {
      activityType: 'analog',
      component: AnalogSignalHeatmap,
      id: 'analogSignalHeatmap',
      icon: 'mdi-map-outline',
      label: 'heatmap of analog signals',
    },
    {
      activityType: 'spike',
      component: SpikeTimesRasterPlot,
      id: 'spikeTimesRasterPlot',
      icon: 'mdi-chart-scatter-plot',
      label: 'Spike times',
    },
    {
      activityType: 'spike',
      component: SpikeTimesHistogram,
      id: 'spikeTimesHistogram',
      icon: 'mdi-chart-bar',
      label: 'Spike times',
    },
    {
      activityType: 'spike',
      component: SpikeTimesHistogramElephant,
      id: 'spikeTimesHistogramElephant',
      icon: 'mdi-chart-bar',
      label: 'Spike times (Elephant)',
    },
    {
      activityType: 'spike',
      component: InterSpikeIntervalHistogram,
      id: 'interSpikeIntervalHistogram',
      icon: 'mdi-chart-bar',
      label: 'Inter-spike interval',
    },
    {
      activityType: 'spike',
      component: InterSpikeIntervalHistogramElephant,
      id: 'interSpikeIntervalHistogramElephant',
      icon: 'mdi-chart-bar',
      label: 'Inter-spike interval (Elephant)',
    },
    {
      activityType: 'spike',
      component: CVISIHistogram,
      id: 'CVISIHistogram',
      icon: 'mdi-chart-bar',
      label: 'CV of ISI',
    },
    {
      activityType: 'spike',
      component: SenderSpikeCountPlot,
      id: 'senderSpikeCountPlot',
      icon: 'mdi-chart-bell-curve-cumulative',
      label: 'Spike count in each sender',
    },
    {
      activityType: 'spike',
      component: SenderMeanISIPlot,
      id: 'senderMeanISIPlot',
      icon: 'mdi-chart-bell-curve-cumulative',
      label: 'Mean ISI in each sender',
    },
    {
      activityType: 'spike',
      component: SenderCVISIPlot,
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

    // Set margin for panels with same xaxis.
    if (panelIdx > 0 && panelIdx < panels.length - 1) {
      const nextPanel = panels[panelIdx + 1];
      if (this.xaxis === nextPanel.xaxis) {
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
