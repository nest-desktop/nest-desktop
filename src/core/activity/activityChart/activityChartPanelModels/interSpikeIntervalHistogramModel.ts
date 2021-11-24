import * as d3 from 'd3';

import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPlotModel } from './spikeTimesPlotModel';

export class InterSpikeIntervalHistogramModel extends SpikeTimesPlotModel {
  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.id = 'InterSpikeIntervalHistogram';
    this.icon = 'mdi-chart-bar';
    this.label = 'inter-spike interval';
    this.panel.xaxis = 2;

    this.params = [
      {
        id: 'binSize',
        input: 'tickSlider',
        label: 'bin size',
        ticks: [1, 2, 5, 10, 20, 50],
        unit: 'ms',
        value: 5,
      },
    ];

    this.state.barnorm = '';
    this.state.xaxisType = 'linear';

    this.init();
  }

  /**
   * Update data for ISI histogram.
   */
  override updateData(activity: SpikeActivity): void {
    // console.log('Update data for ISI histogram.').

    const isi: number[][] = activity.ISI();
    const x: number[] = [].concat.apply([], isi);
    const start: number = 0;
    const end: number = d3.max(x) + 1;
    const size: number = this.params[0].value;

    this.data.push({
      activityIdx: activity.idx,
      histfunc: 'count',
      hoverinfo: 'y',
      legendgroup: 'spikes' + activity.idx,
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: 'white',
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      name: 'Histogram of ISI in' + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      source: 'x',
      type: 'histogram',
      x,
      xbins: {
        start,
        end,
        size,
      },
    });
  }

  /**
   * Update layout label for ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.type = this.state.xaxisType;
    this.panel.layout.xaxis.title = 'Inter-spike interval [ms]';
  }
}
