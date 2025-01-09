// spikeTimesRasterPlotModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { SpikeActivity } from "../../../activity/spikeActivity";
import { SpikeTimesPanelModel } from "./spikeTimesPanelModel";
import { scatterSpikes } from "../graphObjects/scatter";
import { NodeSpikeActivity } from "@/helpers/nodeActivity/nodeSpikeActivity";

export class SpikeTimesRasterPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, modelProps: IActivityChartPanelModelProps = {}) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-scatter-plot";
    this.id = "spikeTimesRasterPlot";
    this.panel.height = 30;
    this.panel.xAxis = 1;
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
    if (!this.panel.graph.state.ref) return 100;
    const d = this.panel.graph.plotLayout.yaxis.domain;
    const domain = d[1] - d[0];

    const layoutHeight = this.panel.graph.state.ref._fullLayout.height;
    const r = this.panel.graph.plotLayout.yaxis.range;
    const range = r[1] - r[0];
    const height = (layoutHeight * domain) / range / 2;
    return Math.min(Math.max(2, height), 100);
  }

  /**
   * Add data of spike times for raster plot.
   * @param activity spike activity object
   */
  override addData(activity: NodeSpikeActivity | SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    this.data.push(
      scatterSpikes({
        activityIdx: activity.idx,
        color: activity.traceColor,
        legendgroup: "spikes" + activity.idx,
        modelId: this.id,
        name: "Spikes of " + activity.traceLabel,
        visible: this.state.visible,
        x: activity.events.times,
        y: activity.events.senders,
      }),
    );
  }

  /**
   * Update layout label for raster plot.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "Time [ms]";
    this.panel.layout.yaxis.title = "Neuron ID";
  }
}
