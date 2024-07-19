// senderSpikeCountPlotModel.ts

import { SpikeActivity } from "../../activity/spikeActivity";
import { currentBackgroundColor } from "../../common/theme";
import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import {
  ISpikeTimesPanelModelProps,
  SpikeTimesPanelModel,
} from "./spikeTimesPanelModel";

export class SenderSpikeCountPlotModel extends SpikeTimesPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: ISpikeTimesPanelModelProps = {}
  ) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "senderSpikeCountPlot";
    this.label = "spike count in each sender";
    this.panel.xAxis = 4;

    this.initParams([
      {
        _parent: this,
        _value: "bar",
        id: "plotMode",
        component: "select",
        items: ["lines", "lines+markers", "markers", "bar"],
        label: "Plot mode",
        get value(): string {
          return this._value as string;
        },
        set value(value: string) {
          this._value = value;
          const lineShape = this._parent?.params.lineShape;
          if (lineShape) {
            lineShape.visible = value.includes("lines");
          }
        },
      },
      {
        id: "lineShape",
        component: "select",
        items: [
          { text: "linear", value: "linear" },
          { text: "spline", value: "spline" },
          { text: "vertical-horizontal-vertical steps", value: "vhv" },
          { text: "horizontal-vertical-horizontal steps", value: "hvh" },
          { text: "vertical-horizontal steps", value: "vh" },
          { text: "horizontal-vertical steps", value: "hv" },
        ],
        label: "Line shape",
        show: false,
        value: "linear",
      },
      {
        id: "spikeRate",
        component: "checkbox",
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
    const y: number[] = x.map((nodeId: number) =>
      counts[nodeId] ? counts[nodeId] / time : 0
    );
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
