// analogSignalHistogramModel.ts

import { currentBackgroundColor } from "@/utils/theme";
import { max, min } from "@/utils/array";

import { ActivityChartPanel } from "../activityChartPanel";
import {
  AnalogSignalPanelModel,
  AnalogSignalPanelModelProps,
} from "./analogSignalPanelModel";
import { NodeRecord } from "@/common/node/nodeRecord";

export class AnalogSignalHistogramModel extends AnalogSignalPanelModel {
  constructor(
    panel: ActivityChartPanel,
    model: AnalogSignalPanelModelProps = {}
  ) {
    super(panel, model);
    this.icon = "mdi-chart-bar";
    this.id = "analogSignalHistogram";
    this.panel.xaxis = 2;
    this.params = [
      {
        id: "bins",
        variant: "tickSlider",
        label: "number of bins",
        ticks: [1, 5, 10, 20, 50, 100, 200],
        value: 50,
      },
    ];

    this.initParams(model.params);
  }

  /**
   * Add data of analog signal for histogram panel.
   *
   * @remarks
   * It requires activity data.
   */
  override addData(): void {
    this.data = [];

    if (this.state.recordsVisible.length === 0) {
      return;
    }

    this.state.recordsVisible.forEach((record: NodeRecord) => {
      this.updateHistogramRange(record.values);
    });

    this.state.recordsVisible.forEach((record: NodeRecord) =>
      this.updateEventData(record)
    );
  }

  /**
   * Update range for histogram.
   *
   * @remarks
   * It needs activity data.
   */
  updateHistogramRange(values: number[] = []): void {
    // Update time.
    if (values.length === 0) {
      return;
    }

    this.state.histogram.start = Math.min(
      this.state.histogram.start,
      min(values) as number
    );
    this.state.histogram.end = Math.max(
      this.state.histogram.end,
      max(values) as number
    );
  }

  /**
   * Update data for analog signal histogram.
   */
  updateEventData(record: NodeRecord): void {
    if (record.values == null || record.values.length === 0) {
      return;
    }

    const start: number = this.state.histogram.start;
    const end: number = this.state.histogram.end + 1;
    const size: number = (end - start) / this.params[0].value;

    this.data.push({
      activityIdx: record.activity.idx,
      histfunc: "count",
      hoverinfo: "x+y",
      legendgroup: record.groupId,
      marker: {
        color: record.color,
        line: {
          color: currentBackgroundColor(),
          width: this.params[0].value > 100 ? 0 : 1,
        },
      },
      name: "Histogram of " + record.nodeLabel,
      opacity: 0.6,
      recordId: record.id,
      showlegend: false,
      source: "x",
      type: "histogram",
      visible: this.state.visible,
      x: record.values,
      xaxis: "x" + this.panel.xaxis,
      xbins: {
        end,
        size,
        start,
      },
    });
  }

  /**
   * Update layout label for analog signal histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = this.axisTitle;
    this.panel.layout.yaxis.title = "Count";
  }
}
