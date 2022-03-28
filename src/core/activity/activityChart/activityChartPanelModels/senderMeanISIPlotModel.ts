import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class SenderMeanISIPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.xaxis = 4;
    this.params = [
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
          { text: 'vertical-horizontal-vertical steps', value: 'vhv' },
          { text: 'horizontal-vertical-horizontal steps', value: 'hvh' },
          { text: 'vertical-horizontal steps', value: 'vh' },
          { text: 'horizontal-vertical steps', value: 'hv' },
        ],
        label: 'Line shape',
        value: 'linear',
        show: () => this.plotMode.includes('lines'),
      },
    ];
  }

  get lineShape(): string {
    return this.params[1].value;
  }

  get plotMode(): string {
    return this.params[0].value;
  }

  get plotType(): string {
    return this.plotMode === 'bar' ? this.plotMode : 'scatter';
  }

  /**
   * Update data for mean ISI histogram.
   */
  override async updateData(activity: SpikeActivity): Promise<any> {
    return new Promise((resolve, reject) => {
      if (activity.nodeIds.length === 0) reject(true);

      const x: number[] = activity.nodeIds;
      const isi: number[][] = activity.ISI();
      const y: number[] = isi.map((ii: number[]) =>
        ii.length > 0 ? activity.getAverage(ii) : 0
      );

      this.data.push({
        activityIdx: activity.idx,
        hoverinfo: 'x+y',
        legendgroup: 'spikes' + activity.idx,
        line: {
          shape: this.lineShape,
        },
        marker: {
          color: activity.recorder.view.color,
          line: {
            color: activity.project.app.darkMode ? '#121212' : 'white',
            width: x.length > 100 ? 0 : 1,
          },
        },
        mode: this.plotMode,
        name: 'Mean ISI in each sender in' + activity.recorder.view.label,
        opacity: 0.6,
        showlegend: false,
        type: this.plotType,
        visible: this.state.visible,
        x,
        y,
      });

      resolve(true);
    });
  }

  /**
   * Update layout label for mean ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Senders';
    this.panel.layout.yaxis.title = 'Mean ISI [ms]';
  }
}
