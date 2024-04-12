// spikeTimesRasterPlotModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { SpikeActivity } from "@/helpers/activity/spikeActivity";
import {
  ISpikeTimesPanelModelProps,
  SpikeTimesPanelModel,
} from "./spikeTimesPanelModel";
import { useAppSessionStore } from "@/stores/appSessionStore";

export class SpikeTimesRasterPlotModel extends SpikeTimesPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: ISpikeTimesPanelModelProps = {}
  ) {
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
    // console.log('marker size')
    if (!this.panel.graph.state.ref) return 100;
    const d = this.panel.graph.plotLayout.yaxis.domain;
    const domain = d[1] - d[0];
    // @ts-ignore
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
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;
    const appSessionStore = useAppSessionStore();

    this.data.push({
      activityIdx: activity.idx,
      hoverinfo: "x",
      legendgroup: "spikes" + activity.idx,
      marker: {
        line: {
          color: activity.recorder.view.color,
          width: 2,
        },
        color: activity.recorder.view.color,
        size: 5,
        symbol: "line-ns",
      },
      // marker: {
      //   color: activity.recorder.view.color,
      //   size: 3,
      // },
      mode: "markers",
      modelId: this.id,
      name: "Spikes of " + activity.recorder.view.label,
      showlegend: true,
      type: appSessionStore.state.webGL ? "scattergl" : "scatter",
      visible: this.state.visible,
      x: activity.events.times,
      y: activity.events.senders,
    });
  }

  /**
   * Update layout label for raster plot.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "Time [ms]";
    this.panel.layout.yaxis.title = "Neuron ID";
  }
}
