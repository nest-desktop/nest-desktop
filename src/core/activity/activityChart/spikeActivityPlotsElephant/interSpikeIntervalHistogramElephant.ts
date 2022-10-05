import * as d3 from 'd3';

import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeActivityPanelModel } from '../spikeActivityPanelModel';

export class InterSpikeIntervalHistogramElephant extends SpikeActivityPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
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
    this.state.xaxisType = 'linear';
  }

  /**
   * Add data for spike time histogram.
   */
  override async addData(activity: SpikeActivity): Promise<boolean> {
    return new Promise(resolve => {
      const xbins: any = {
        start: this.state.time.start,
        size: this.params[0].value,
      };
      const units: any = { time: 'ms' };
      const spiketrains: any[] = activity.times.map((times: number[]) => ({
        times,
        t_stop: this.state.time.end + 1,
        units: 'ms',
      }));
      const data = {
        data: {
          spiketrains,
        },
        units,
      };
      const config = {
        headers: { 'Content-type': 'application/json', Accept: 'text/plain' },
      };

      this.panel.graph.project.app.backends.elephantAnalysis.instance
        .post('api/statistics/isi', data, config)
        .then((response: any) => {
          const data = response.data;
          const x = data.flat();
          xbins.end = d3.max(x) + 1;

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
            name: 'Histogram of ISI in' + activity.recorder.view.label,
            opacity: 0.6,
            showlegend: false,
            source: 'x',
            type: 'histogram',
            visible: this.state.visible,
            x,
            xbins,
          });

          resolve(true);
        });
    });
  }

  /**
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.type = this.state.xaxisType;
    this.panel.layout.xaxis.title = 'Inter-spike interval [ms]';
    this.panel.layout.yaxis.title = 'Count';
  }
}
