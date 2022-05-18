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
    this.state.height = 5;
  }

  /**
   * Get responsive height for marker in raster plot.
   *
   * @return height
   */
  get markerSize(): number {
    const ref = this.panel.graph.state.ref;
    const d = ref.layout.yaxis.domain;
    const domain = d[1] - d[0];
    const layoutHeight = ref._fullLayout.height;
    const r = ref.layout.yaxis.range;
    const range = r[1] - r[0];
    const height = (layoutHeight * domain) / range / 2;
    return Math.min(Math.max(2, height), 100);
  }

  /**
   * Update data for raster plot.
   */
  override updateData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    this.data.push({
      activityIdx: activity.idx,
      hoverinfo: 'x',
      legendgroup: 'spikes' + activity.idx,
      marker: {
        line: {
          color: activity.recorder.view.color,
          width: 2,
        },
        size: 5,
        symbol: 'line-ns',
      },
      mode: 'markers',
      modelId: this.id,
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
