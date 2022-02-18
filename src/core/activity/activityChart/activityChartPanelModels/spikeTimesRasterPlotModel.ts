import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class SpikeTimesRasterPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = 'mdi-chart-scatter-plot';
    this.id = 'spikeTimesRasterPlot';
    this.panel.height = 30;
    this.panel.xaxis = 1;
  }

  /**
   * Update data for raster plot.
   */
  override updateData(activity: SpikeActivity): void {
    // console.log('Update data for raster plot.');
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
  }

  /**
   * Update layout label for raster plot.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Time [ms]';
    this.panel.layout.yaxis.title = 'Neuron ID';
  }
}
