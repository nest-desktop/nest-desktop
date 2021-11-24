import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPlotModel } from './spikeTimesPlotModel';

export class SpikeTimesHistogramModel extends SpikeTimesPlotModel {
  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.id = 'SpikeTimesHistogram';
    this.icon = 'mdi-chart-bar';
    this.label = 'spike times';

    this.panel.layout.barmode = 'overlay';

    this.params = [
      {
        id: 'binSize',
        input: 'tickSlider',
        label: 'bin size',
        ticks: [5, 10, 25, 50, 100, 250, 500, 1000],
        unit: 'ms',
        value: 25,
      },
    ];

    this.init();
  }

  /**
   * Update data for spike time histogram.
   */
  override updateData(activity: SpikeActivity): void {
    // console.log('Update data of spike time histogram.');

    const x: number[] = activity.events.times;
    const start: number = this.state.time.start;
    const end: number = this.state.time.end;
    const size: number = this.params[0].value;

    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of spike times in' + activity.recorder.view.label,
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
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = 'Spike count';
  }
}
