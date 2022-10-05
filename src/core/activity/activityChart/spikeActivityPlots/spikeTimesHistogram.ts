import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeActivityPanelModel } from '../spikeActivityPanelModel';

export class SpikeTimesHistogram extends SpikeActivityPanelModel {
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
   * Add data of spike times for histogram panel.
   */
  override async addData(activity: SpikeActivity): Promise<boolean> {
    return new Promise(resolve => {
      const x: number[] = activity.events.times;
      const xbins: any = {
        start: this.state.time.start,
        end: this.state.time.end + 1,
        size: this.params[0].value,
      };

      this.data.push({
        activityIdx: activity.idx,
        histfunc: 'count',
        hoverinfo: 'y',
        legendgroup: 'spikes' + activity.idx,
        marker: {
          color: activity.recorder.view.color,
          line: {
            color: activity.project.app.darkMode ? '#121212' : 'white',
            width: (xbins.end - xbins.start) / xbins.size > 100 ? 0 : 1,
          },
        },
        name: 'Histogram of spike times in' + activity.recorder.view.label,
        opacity: 0.6,
        showlegend: false,
        source: 'x+y',
        type: 'histogram',
        visible: this.state.visible,
        x,
        xbins,
      });

      resolve(true);
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
