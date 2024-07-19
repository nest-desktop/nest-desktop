//senderMeanISIPlotModel.ts

import { SpikeActivity } from "../../activity/spikeActivity";
import { currentBackgroundColor } from "../../common/theme";
import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import {
  ISpikeTimesPanelModelProps,
  SpikeTimesPanelModel,
} from "./spikeTimesPanelModel";

export class SenderMeanISIPlotModel extends SpikeTimesPanelModel {
  constructor(
    panel: ActivityChartPanel,
    model: ISpikeTimesPanelModelProps = {}
  ) {
    super(panel, model);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "senderMeanISIPlot";
    this.label = "mean ISI in each sender";
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
    ]);

    this.updateParams(model.params);
  }

  /**
   * Add data of mean ISI in each sender for histogram panel.
   * @param activity spike activity object
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const x: number[] = activity.nodeIds;
    const isi: number[][] = activity.ISI();
    const y: number[] = isi.map((ii: number[]) =>
      ii.length > 0 ? activity.getAverage(ii) : 0
    );

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
          width: x.length > 100 ? 0 : 1,
        },
      },
      mode: plotMode,
      name: "Mean ISI in each sender in" + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      type: plotType,
      visible: this.state.visible,
      x,
      y,
    } as IActivityChartPanelModelData);
  }

  /**
   * Update layout label for mean ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.type = this.state.xaxisType;
    this.panel.layout.xaxis.title = "Senders";
    this.panel.layout.yaxis.title = "Mean ISI [ms]";
  }
}
