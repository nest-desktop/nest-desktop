import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPlotModel } from './spikeTimesPlotModel';

export class SpikeTimesRasterPlotModel extends SpikeTimesPlotModel {
  constructor(panel: ActivityChartPanel) {
    super(panel);
    this.icon = 'mdi-chart-bell-curve-cumulative';
    this.id = 'FICurvePlot';
    this.label = 'F-I curve';
    this.panel.layout.yaxis.height = 3;
    this.init();
  }

  /**
   * Update data for FI curve.
   */
  override updateData(activity: SpikeActivity): void {
    // console.log('Update data for FI curve.');
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
      x: activity.events.times,
      y: activity.events.senders,
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
