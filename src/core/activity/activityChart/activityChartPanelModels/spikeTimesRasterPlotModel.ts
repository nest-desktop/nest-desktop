import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class SpikeTimesRasterPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.height = 30;
    this.panel.xaxis = 1;
  }

  /**
   * Update data for raster plot.
   */
  override async updateData(activity: SpikeActivity): Promise<any> {
    return new Promise((resolve, reject) => {
      if (activity.nodeIds.length === 0) reject(true);

      this.data.push({
        activityIdx: activity.idx,
        hoverinfo: 'x',
        legendgroup: 'spikes' + activity.idx,
        marker: {
          color: activity.recorder.view.color,
          size: 5,
        },
        mode: 'markers',
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
   * Update layout label for raster plot.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = 'Neuron ID';
  }
}
