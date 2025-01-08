// CVISIHistogramModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { SpikeActivity } from "../../activity/spikeActivity";
import { SpikeTimesPanelModel } from "./spikeTimesPanelModel";
import { histogram } from "../graphObjects/histogram";

export class CVISIHistogramModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, modelProps: IActivityChartPanelModelProps = {}) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bar";
    this.id = "CVISIHistogram";
    this.label = "CV of ISI";
    this.panel.xAxis = 3;

    this.initParams([
      {
        component: "tickSlider",
        id: "binSize",
        label: "bin size",
        ticks: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5],
        value: 0.05,
      },
    ]);

    this.updateParams(modelProps.params);
  }

  /**
   * Add data of CV of ISI for histogram panel.
   * @param activity spike activity object
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const start: number = 0;
    const end: number = 5;
    const size = this.params.binSize.value as number;
    const isi: number[][] = activity.ISI();
    const x: number[] = isi.map((i: number[]) => activity.getStandardDeviation(i) / activity.getAverage(i));

    this.data.push(
      histogram({
        activityIdx: activity.idx,
        color: activity.recorder.view.color,
        legendgroup: "spikes" + activity.idx,
        name: "Histogram of CV(ISI) in" + activity.recorder.view.label,
        visible: this.state.visible,
        x,
        xbins: {
          end,
          size,
          start,
        },
      }),
    );
  }

  /**
   * Update layout label for CV_ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "CV of ISI";
    this.panel.layout.yaxis.title = "Count";
  }
}
