import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class SenderSpikeCountPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.id = 'senderSpikeCountPlot';
    this.label = 'spike count in each sender';
    this.panel.xaxis = 4;
    this.params = [
      {
        id: 'plotMode',
        input: 'select',
        items: ['lines', 'lines+markers', 'markers', 'bar'],
        label: 'Plot mode',
        value: 'lines',
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
      },
      {
        id: 'spikeRate',
        input: 'checkbox',
        label: 'Spikes per seconds (spikes/s)',
        value: false,
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

  get spikeRate(): boolean {
    return this.params[2].value;
  }

  /**
   * Update data for spike sender histogram.
   */
  override updateData(activity: SpikeActivity): void {
    // console.log('Update data of spike time histogram.');
    const x: number[] = activity.nodeIds;
    const senders: number[] = activity.events.senders;

    const counts = {};
    for (const sender of senders) {
      counts[sender] = counts[sender] ? counts[sender] + 1 : 1;
    }

    const time = this.spikeRate ? activity.endtime / 1000 : 1;
    const y: number[] = x.map((nodeId: number) =>
      counts[nodeId] ? counts[nodeId] / time : 0
    );
    const size = x.length;
    const mode = this.params[0].value;

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
          width: size > 100 ? 0 : 1,
        },
      },
      mode: this.plotMode,
      name: 'Spike count in each sender in' + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      type: this.plotType,
      x,
      y,
    });
  }

  /**
   * Update layout label for spike sender histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Neuron ID';
    this.panel.layout.yaxis.title = this.spikeRate ? 'Spikes/s' : 'Spike count';
  }
}
