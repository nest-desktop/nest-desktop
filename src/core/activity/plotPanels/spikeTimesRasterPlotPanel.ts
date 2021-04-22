import { ActivityChartGraph } from '../activityChartGraph';
import { SpikeActivity } from '../spikeActivity';
import { SpikeTimesPanel } from './spikeTimesPanel';

export class SpikeTimesRasterPlotPanel extends SpikeTimesPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.icon = 'mdi-chart-scatter-plot';
    this.name = 'SpikeTimesRasterPlotPanel';
    this.label = 'raster plot of spike times';
    this.layout.yaxis.title = 'Neuron ID';
    this.layout.yaxis.height = 3;
    this.init();
  }

  /**
   * Initialize raster plot panel for spike data.
   */
  init(): void {
    // console.log('Init raster plot panel for spike times');
    this.activities = this.graph.project.spikeActivities;
    this.data = [];
  }

  /**
   * Update raster plot panel for spike data.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    // console.log('Update raster plot panel for spike times');
    this.activities.forEach((activity: SpikeActivity) => {
      this.updateSpikeTimesRasterPlot(activity);
    });
  }

  addSpikeTimesRasterPlot(activity: SpikeActivity): void {
    // console.log('Add data of spike times')
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
        color: 'black',
      },
      x: [],
      y: [],
    });
  }

  updateSpikeTimesRasterPlot(activity: SpikeActivity): void {
    // console.log('Update data of spike times')
    if (!this.data.some((d: any) => d.activityIdx === activity.idx)) {
      this.addSpikeTimesRasterPlot(activity);
    }
    const data: any = this.data.find(
      (d: any) => d.activityIdx === activity.idx
    );
    data.x = activity.events.times;
    data.y = activity.events.senders;
    data.marker.color = activity.recorder.view.color;
  }
}
