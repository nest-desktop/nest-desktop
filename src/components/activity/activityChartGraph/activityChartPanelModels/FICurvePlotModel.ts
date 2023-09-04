// FICurvePlotModel.ts

import { SpikeActivity } from "../../spikeActivity";
import { ActivityChartPanel, plotType } from "../activityChartPanel";
import { SpikeTimesPanelModel } from "./spikeTimesPanelModel";

export class SpikeTimesRasterPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = "mdi-chart-bell-curve-cumulative";
    this.id = "FICurvePlot";
    this.label = "F-I curve";
    this.panel.height = 30;
    this.panel.xaxis = 5;
  }

  /**
   * Add data of FI curve for trace panel.
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    this.data.push({
      activityIdx: activity.idx,
      hoverinfo: "none",
      legendgroup: "spikes" + activity.idx,
      marker: {
        size: 5,
        color: activity.recorder.view.color,
      },
      mode: "lines",
      name: "Spikes of " + activity.recorder.view.label,
      showlegend: true,
      type: plotType,
      visible: this.state.visible,
      x: activity.events.times,
      y: activity.events.senders,
    });
  }

  /**
   * Update layout label for FI curve.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "Neuron ID";
    this.panel.layout.yaxis.title = "Spike count";
  }
}
