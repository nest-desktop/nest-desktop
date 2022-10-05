import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeActivityPanelModel } from '../spikeActivityPanelModel';

export class SpikeTimesRasterPlot extends SpikeActivityPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.height = 30;
    this.panel.xaxis = 1;
    this.state.height = 5;
  }

  /**
   * Get responsive height for marker in raster plot.
   *
   * @remarks It is formulated by:
   *    - the height of the panel in pixels
   *    - the domain as the ratio of the panel to the whole chart
   *    - the range of the viewed y-values
   *
   * @return height (fixed value between 2 and 100)
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
   * Add data of spike times for raster plot.
   */
  override async addData(activity: SpikeActivity): Promise<boolean> {
    return new Promise(resolve => {
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
        mode: 'line+markers',
        modelId: this.id,
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
