// FICurvePlotModel.ts

import { SpikeActivity } from "../../activity/spikeActivity";
import { ActivityChartPanel, plotType } from "../activityChartPanel";
import { IActivityChartPanelModelData, IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { SpikeTimesPanelModel } from "./spikeTimesPanelModel";

export class SpikeTimesRasterPlotModel extends SpikeTimesPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: IActivityChartPanelModelProps = {}
  ) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "FICurvePlot";
    this.label = "F-I curve";
    this.panel.height = 30;
    this.panel.xAxis = 5;
  }

  /**
   * Add data of FI curve for trace panel.
   * @param activity spike activity object
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
    } as IActivityChartPanelModelData);
  }

  /**
   * Update layout label for FI curve.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "Neuron ID";
    this.panel.layout.yaxis.title = "Spike count";
  }
}
