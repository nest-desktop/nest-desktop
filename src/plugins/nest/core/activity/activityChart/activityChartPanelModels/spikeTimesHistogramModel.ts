// spikeTimesHistogramModel.ts

import { darkMode } from '@/helpers/theme';

import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class SpikeTimesHistogramModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = 'mdi-chart-bar';
    this.id = 'spikeTimesHistogram';
    this.panel.xaxis = 1;
    this.params = [
      {
        id: 'binSize',
        input: 'tickSlider',
        label: 'bin size',
        ticks: [5, 10, 20, 50, 100, 200, 500, 1000],
        unit: 'ms',
        value: 20,
      },
    ];

    this.initParams(model.params);
  }

  /**
   * Add data of spike times for histogram panel.
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const x: number[] = activity.events.times;
    const start: number = this.state.time.start;
    const end: number = this.state.time.end;
    const size: number = this.params[0].value;

    this.data.push({
      activityIdx: activity.idx,
      histfunc: 'count',
      hoverinfo: 'x+y',
      legendgroup: 'spikes' + activity.idx,
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: darkMode() ? '#121212' : 'white',
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      name: 'Histogram of spike times in' + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      source: 'x+y',
      type: 'histogram',
      visible: this.state.visible,
      x,
      xbins: {
        end,
        size,
        start,
      },
    });
  }

  /**
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = 'Spike count';
  }
}
