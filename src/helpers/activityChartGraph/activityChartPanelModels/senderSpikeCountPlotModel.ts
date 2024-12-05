// senderSpikeCountPlotModel.ts

import { TParameter } from "@/types";

import { SpikeActivity } from "../../activity/spikeActivity";
import { currentBackgroundColor } from "../../common/theme";
import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelData, IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { ActivityChartPanelModelParameter } from "../activityChartPanelModelParameter";
import { SpikeTimesPanelModel } from "./spikeTimesPanelModel";

export class SenderSpikeCountPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, modelProps: IActivityChartPanelModelProps = {}) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "senderSpikeCountPlot";
    this.label = "spike count in each sender";
    this.panel.xAxis = 4;

    this.initParams([
      {
        component: "select",
        id: "plotMode",
        items: ["lines", "lines+markers", "markers", "bar"],
        label: "Plot mode",
        value: "bar",
        handleOnUpdate: (param: TParameter) => {
          const p = param as ActivityChartPanelModelParameter;
          const paramValue = p.value as string;
          p.activityChartPanelModel.params.lineShape.visible = paramValue.includes("lines");
        },
      },
      {
        component: "select",
        id: "lineShape",
        items: [
          { title: "linear", value: "linear" },
          { title: "spline", value: "spline" },
          { title: "vertical-horizontal-vertical steps", value: "vhv" },
          { title: "horizontal-vertical-horizontal steps", value: "hvh" },
          { title: "vertical-horizontal steps", value: "vh" },
          { title: "horizontal-vertical steps", value: "hv" },
        ],
        label: "Line shape",
        value: "linear",
        visible: false,
      },
      {
        component: "checkbox",
        id: "spikeRate",
        label: "Spikes per seconds (spikes/s)",
        value: false,
      },
    ]);

    this.updateParams(modelProps.params);
  }

  /**
   * Add data of spike count in each sender for histogram panel.
   * @param activity spike activity object
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const x: number[] = activity.nodeIds;
    const senders: number[] = activity.events.senders;

    const counts: Record<string, number> = {};
    for (const sender of senders) {
      counts[sender] = counts[sender] ? counts[sender] + 1 : 1;
    }

    const spikeRate = this.params.spikeRate.value as boolean;
    const time = spikeRate ? activity.endTime / 1000 : 1;
    const y: number[] = x.map((nodeId: number) => (counts[nodeId] ? counts[nodeId] / time : 0));
    const size = x.length;

    const lineShape = this.params.lineShape.value as string;
    const plotMode = this.params.plotMode.value as string;
    const plotType = plotMode === "bar" ? plotMode : "scatter";

    this.data.push({
      activityIdx: activity.idx,
      hoverinfo: "x+y",
      legendgroup: "spikes" + activity.idx,
      line: {
        shape: lineShape,
      },
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: currentBackgroundColor(),
          width: size > 100 ? 0 : 1,
        },
      },
      mode: plotMode,
      name: "Spike count in each sender in" + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      type: plotType,
      visible: this.state.visible,
      x,
      y,
    } as IActivityChartPanelModelData);
  }

  /**
   * Update layout label for spike sender histogram.
   */
  override updateLayoutLabel(): void {
    const spikeRate = this.params.spikeRate.value as boolean;

    this.panel.layout.xaxis.title = "Neuron ID";
    this.panel.layout.yaxis.title = spikeRate ? "Spikes/s" : "Spike count";
  }
}
