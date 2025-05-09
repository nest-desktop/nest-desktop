// analogSignalHistogramModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { AnalogSignalPanelModel } from "./analogSignalPanelModel";
import { IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { NodeRecord } from "../../../node/nodeRecord";
import { histogram } from "../graphObjects/histogram";
import { max, min } from "../../../../utils/array";

export class AnalogSignalHistogramModel extends AnalogSignalPanelModel {
  constructor(panel: ActivityChartPanel, modelProps: IActivityChartPanelModelProps = {}) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bar";
    this.id = "analogSignalHistogram";
    this.panel.xAxis = 2;

    this.initParams([
      {
        component: "tickSlider",
        id: "bins",
        label: "number of bins",
        ticks: [1, 5, 10, 20, 50, 100, 200],
        value: 50,
      },
    ]);

    this.updateParams(modelProps.params);
  }

  /**
   * Add data of analog signal for histogram panel.
   *
   * @remarks
   * It requires activity data.
   */
  override addData(): void {
    this.empty();

    if (this.recordsVisible.length === 0) return;

    this.recordsVisible.forEach((record: NodeRecord) => this.updateHistogramRange(record.values));
    this.recordsVisible.forEach((record: NodeRecord) => this.updateEventData(record));
  }

  /**
   * Update range for histogram.
   *
   * @remarks
   * It needs activity data.
   */
  updateHistogramRange(values: number[] = []): void {
    // Update time.
    if (values.length === 0) return;

    this.state.histogram.start = Math.min(this.state.histogram.start, min(values) as number);
    this.state.histogram.end = Math.max(this.state.histogram.end, max(values) as number);
  }

  /**
   * Update data for analog signal histogram.
   */
  updateEventData(record: NodeRecord): void {
    if (record.values == null || record.values.length === 0) return;

    const bins = this.params.bins.value as number;

    const start: number = this.state.histogram.start;
    const end: number = this.state.histogram.end + 1;
    const size: number = (end - start) / bins;

    this.data.push(
      histogram({
        activityIdx: record.activity.idx,
        color: record.state.color,
        legendgroup: record.groupId,
        name: "Histogram of " + record.nodeLabel,
        recordId: record.id,
        source: "x",
        visible: this.state.visible,
        x: record.values,
        xaxis: "x" + this.panel.xAxis,
        xbins: {
          end,
          size,
          start,
        },
      }),
    );
  }

  /**
   * Update layout label for analog signal histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title.text = this.axisTitle;
    this.panel.layout.yaxis.title.text = "Count";
  }
}
