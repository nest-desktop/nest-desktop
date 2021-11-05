import { ActivityChartGraph } from '../activityChartGraph';
import { SpikeActivity } from '../spikeActivity';
import { SpikeTimesPanel } from './spikeTimesPanel';

export class SpikeTimesRasterPlotPanel extends SpikeTimesPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.icon = 'mdi-chart-scatter-plot';
    this.name = 'SpikeTimesRasterPlotPanel';
    this.label = 'raster plot of spike times';
    this.layout.yaxis.height = 3;
    this.init();
  }

  /**
   * Update data for raster plot.
   */
  updateData(activity: SpikeActivity): void {
    // console.log('Update data for raster plot.');
    this.data.push({
      activityIdx: activity.idx,
      mode: 'markers',
      type: 'scattergl',
      hoverinfo: 'x',
      legendgroup: 'spikes' + activity.idx,
      name: 'Spikes of ' + activity.recorder.view.label,
      showlegend: true,
      marker: {
        size: 5,
        color: activity.recorder.view.color,
      },
      x: (() => activity.events.times)(),
      y: (() => activity.events.senders)(),
    });
  }

  /**
   * Update layout label for raster plot.
   */
  updateLayoutLabel(): void {
    this.layout.xaxis.title = 'Time [ms]';
    this.layout.yaxis.title = 'Neuron ID';
  }
}
