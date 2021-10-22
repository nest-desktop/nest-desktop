import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPlotModel } from './spikeTimesPlotModel';

export class InterSpikeIntervalHistogramModel extends SpikeTimesPlotModel {
  private _params: any[] = [
    {
      id: 'binSize',
      input: 'tickSlider',
      label: 'bin size',
      ticks: [1, 2, 5, 10, 20, 50],
      unit: 'ms',
      value: 5,
    },
  ];

  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.id = 'InterSpikeIntervalHistogram';
    this.icon = 'mdi-chart-bar';
    this.label = 'inter-spike interval';
    this.panel.layout.barmode = 'overlay';
    this.state.barnorm = '';
    this.state.xaxisType = 'linear';
    this.state.start = 0;
    this.state.end = 1000;
    this.panel.xaxis = 2;
    this.init();
  }

  get params(): any[] {
    return this._params;
  }

  /**
   * Update data for ISI histogram.
   */
  updateData(activity: SpikeActivity): void {
    // console.log('Update data for ISI histogram.').
    const isi: number[][] = activity.ISI();
    const x: number[] = [].concat.apply([], isi);
    const start: number = this.state.start;
    const end: number = this.state.end;
    const size: number = this._params[0].value;

    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of ISI in' + activity.recorder.view.label,
      hoverinfo: 'y',
      showlegend: false,
      opacity: 0.6,
      xbins: {
        start,
        end,
        size,
      },
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: 'white',
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      x,
    });
  }

  /**
   * Update layout label for ISI histogram.
   */
  updateLayoutLabel(): void {
    this.panel.layout.xaxis.type = this.state.xaxisType;
    this.panel.layout.xaxis.title = 'Inter-spike interval [ms]';
  }

  /**
   * Update params for spike time histogram.
   */
  updateParams(activity: SpikeActivity): void {
    this.state.start = 0;
    this.state.end = activity.endtime + 1;
  }
}
