import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class SenderCVISIPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.id = 'senderCVISIPlot';
    this.label = 'CV of ISI in each sender';
    this.panel.xaxis = 4;
    this.params = [
      {
        id: 'plotMode',
        input: 'select',
        items: ['lines', 'lines+markers', 'markers', 'bar'],
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
        show: () => this.plotMode.includes('lines'),
        value: 'linear',
      },
    ];
  }

  get plotMode(): string {
    return this.params[0].value;
  }

  get plotType(): string {
    return this.plotMode === 'bar' ? this.plotMode : 'scatter';
  }

  get lineShape(): string {
    return this.params[1].value;
  }

  /**
   * Add data of CV of ISI in each sender for histogram panel.
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const x: number[] = activity.nodeIds;
    const isi: number[][] = activity.ISI();
    const y: number[] = isi.map((ii: number[]) =>
      ii.length > 1
        ? activity.getStandardDeviation(ii) / activity.getAverage(ii)
        : 0
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
      name: 'CV of ISI in each sender in' + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      type: this.plotType,
      visible: this.state.visible,
      x,
      y,
    });
  }

  /**
   * Update layout label for mean ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.type = this.state.xaxisType;
    this.panel.layout.xaxis.title = 'Senders';
    this.panel.layout.yaxis.title = 'CV of ISI';
  }
}
