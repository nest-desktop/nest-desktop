import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class SpikeTimesHistogramModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
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
  }

  /**
   * Update data for spike time histogram.
   */
  override async updateData(activity: SpikeActivity): Promise<any> {
    return new Promise((resolve, reject) => {
      if (activity.nodeIds.length === 0) reject(true);

      const x: number[] = activity.events.times;
      const start: number = this.state.time.start;
      const end: number = this.state.time.end;
      const size: number = this.params[0].value;

      this.data.push({
        activityIdx: activity.idx,
        histfunc: 'count',
        hoverinfo: 'y',
        legendgroup: 'spikes' + activity.idx,
        marker: {
          color: activity.recorder.view.color,
          line: {
            color: activity.project.app.darkMode ? '#121212' : 'white',
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
          end: end,
          size,
          start,
        },
      });

      resolve(true);
    });
  }

  /**
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = 'Spike counts';
  }
}
