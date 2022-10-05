import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeActivityPanelModel } from '../spikeActivityPanelModel';

export class FICurvePlot extends SpikeActivityPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.height = 30;
    this.panel.xaxis = 5;
  }

  /**
   * Add data of FI curve for trace panel.
   */
  override async addData(activity: SpikeActivity): Promise<boolean> {
    return new Promise(resolve => {
      this.data.push({
        activityIdx: activity.idx,
        hoverinfo: 'none',
        legendgroup: 'spikes' + activity.idx,
        marker: {
          size: 5,
          color: activity.recorder.view.color,
        },
        mode: 'lines',
        name: 'Spikes of ' + activity.recorder.view.label,
        showlegend: true,
        type: 'scattergl',
        visible: this.state.visible,
        x: activity.events.times,
        y: activity.events.senders,
      });

      resolve(true);
    });
  }

  /**
   * Update layout label for FI curve.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Neuron ID';
    this.panel.layout.yaxis.title = 'Spike count d3';
  }
}
