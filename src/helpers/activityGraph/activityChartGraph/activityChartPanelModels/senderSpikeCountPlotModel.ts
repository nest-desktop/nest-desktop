// senderSpikeCountPlotModel.ts

import { TParameter } from "@/types";

import { ActivityChartPanel } from "../activityChartPanel";
import { ActivityChartPanelModelParameter } from "../activityChartPanelModelParameter";
import { IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { SpikeActivity } from "../../../activity/spikeActivity";
import { SpikeTimesPanelModel } from "./spikeTimesPanelModel";
import { plot } from "../graphObjects/plot";

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

    const lineShape = this.params.lineShape.value as string;
    const plotMode = this.params.plotMode.value as string;

    this.data.push(
      plot(plotMode, {
        activityIdx: activity.idx,
        color: activity.traceColor,
        legendgroup: "spikes" + activity.idx,
        line: {
          shape: lineShape,
        },
        mode: plotMode,
        name: "Spike count in each sender" + "record" in activity ? " in " + activity.traceLabel : "",
        showlegend: false,
        visible: this.state.visible,
        x,
        y,
      }),
    );
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
