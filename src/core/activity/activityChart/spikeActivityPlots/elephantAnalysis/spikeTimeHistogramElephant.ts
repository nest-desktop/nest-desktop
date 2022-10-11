import { ActivityChartPanel } from '../../activityChartPanel';
import { SpikeActivity } from '../../../spikeActivity';
import { SpikeActivityPanelModel } from '../../spikeActivityPanelModel';

export class SpikeTimeHistogramElephant extends SpikeActivityPanelModel {
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
        id: 'analysisOutput',
        input: 'select',
        items: ['counts', 'mean', 'rate'],
        label: 'Output',
        value: 'counts',
      },
      {
        id: 'plotMode',
        input: 'select',
        items: ['bar', 'lines', 'lines+markers', 'markers'],
        label: 'Plot mode',
        value: 'bar',
      },
      {
        id: 'lineShape',
        input: 'select',
        items: [
          { text: 'linear', value: 'linear' },
          { text: 'spline', value: 'spline' },
          { text: 'steps', value: 'hvh' },
          // { text: 'vertical-horizontal-vertical steps', value: 'vhv' },
          // { text: 'horizontal-vertical-horizontal steps', value: 'hvh' },
          // { text: 'vertical-horizontal steps', value: 'vh' },
          // { text: 'horizontal-vertical steps', value: 'hv' },
        ],
        label: 'Line shape',
        value: 'hvh',
        show: () => this.plotMode.includes('lines'),
      },
      {
        id: 'fillArea',
        input: 'select',
        items: ['none', 'tozeroy', 'tonexty'],
        label: 'Fill area',
        value: 'none',
      },
    ];
  }

  get fillArea(): string {
    return this.params[4].value;
  }

  get plotMode(): string {
    return this.params[2].value;
  }

  get plotType(): string {
    return this.plotMode === 'bar' ? this.plotMode : 'scatter';
  }

  get lineShape(): string {
    return this.params[3].value;
  }

  get xbins(): any {
    return {
      start: this.state.time.start,
      end: this.state.time.end + 1,
      size: this.params[0].value,
    };
  }

  async requestAnalysis(activity: SpikeActivity): Promise<any> {
    const units: any = { time: 's' };
    const output: string = this.params[1].value;
    const spiketrains: any[] = activity.times.map((times: number[]) => ({
      t_stop: this.xbins.end,
      times,
      units: 'ms',
    }));
    const data = {
      data: {
        bin_size: this.xbins.size / 1000,
        output,
        spiketrains,
      },
      units,
    };
    const config = {
      headers: { 'Content-type': 'application/json', Accept: 'text/plain' },
    };
    return this.panel.graph.project.app.backends.elephantAnalysis.instance.post(
      'api/statistics/time_histogram',
      data,
      config
    );
  }

  /**
   * Add data for spike time histogram.
   */
  override async addData(activity: SpikeActivity): Promise<boolean> {
    return new Promise(resolve => {
      this.requestAnalysis(activity)
        .then((response: any) => {
          const signal = response.data.signal;
          this.state.units = signal.units;
          const x = signal.times.map(
            (time: number) => time * 1000 + this.xbins.size / 2
          );
          const y = signal.values[0];

          this.data.push({
            activityIdx: activity.idx,
            hoverinfo: 'y',
            fill: this.fillArea,
            legendgroup: 'spikes' + activity.idx,
            line: {
              shape: this.lineShape,
            },
            marker: {
              color: activity.recorder.view.color,
              line: {
                color: activity.project.app.darkMode ? '#121212' : 'white',
                width:
                  (this.xbins.end - this.xbins.start) / this.xbins.size > 100
                    ? 0
                    : 1,
              },
            },
            mode: this.plotMode,
            name: 'Histogram of spike times in' + activity.recorder.view.label,
            opacity: 0.6,
            showlegend: false,
            text: y.map(String),
            textposition: 'auto',
            type: this.plotType,
            visible: this.state.visible,
            width: this.xbins.size,
            x,
            y,
          });

          resolve(true);
        })
        .catch(() => resolve(false));
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
