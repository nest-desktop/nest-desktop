import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class ElephantSpikeTimesHistogramModel extends SpikeTimesPanelModel {
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
      {
        id: 'mode',
        input: 'select',
        label: 'Mode',
        items: ['counts', 'mean', 'rate'],
        value: 'counts',
      },
    ];
  }

  /**
   * Update data for spike time histogram.
   */
  override async updateData(activity: SpikeActivity): Promise<any> {
    return new Promise((resolve, reject) => {
      if (activity.nodeIds.length === 0) reject(true);

      const start: number = this.state.time.start;
      const end: number = this.state.time.end;
      const size: number = this.params[0].value;
      const units: any = { time: 's' };
      const output: string = this.params[1].value;
      const spiketrains: any[] = activity.times.map((times: number[]) => ({
        t_stop: end,
        times,
        units: 'ms',
      }));
      const data = {
        data: {
          bin_size: size / 1000,
          output,
          spiketrains,
        },
        units,
      };
      const config = {
        headers: { 'Content-type': 'application/json', Accept: 'text/plain' },
      };

      this.panel.graph.project.app.backends.elephantAnalysis.instance
        .post('api/statistics/time_histogram', data, config)
        .then((response: any) => {
          const signal = response.data.signal;
          this.state.units = signal.units;
          const x = signal.times.map((time: number) => time * 1000 + size / 2);
          const y = signal.values[0];

          this.data.push({
            activityIdx: activity.idx,
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
            type: 'bar',
            visible: this.state.visible,
            width: size,
            x,
            y,
          });

          resolve(true);
        });
    });
  }

  /**
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = `Spike ${this.params[1].value}`;
    if (this.state.units) {
      this.panel.layout.yaxis.title += ` [${this.state.units}]`;
    }
  }
}
