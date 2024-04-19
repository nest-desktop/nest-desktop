// CVISIHistogramModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import {
  ISpikeTimesPanelModelProps,
  SpikeTimesPanelModel,
} from "./spikeTimesPanelModel";
import { SpikeActivity } from "@/helpers/activity/spikeActivity";
import { currentBackgroundColor } from "@/helpers/common/theme";

export class CVISIHistogramModel extends SpikeTimesPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: ISpikeTimesPanelModelProps = {}
  ) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bar";
    this.id = "CVISIHistogram";
    this.label = "CV of ISI";
    this.panel.xAxis = 3;
    this.params = [
      {
        component: "tickSlider",
        id: "binSize",
        label: "bin size",
        ticks: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5],
        value: 0.05,
      },
    ];

    this.initParams(modelProps.params);
  }

  /**
   * Add data of CV of ISI for histogram panel.
   * @param activity spike activity object
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const start = 0;
    const end = 5;
    const size = this.params[0].value as number;
    const isi: number[][] = activity.ISI();
    const x: number[] = isi.map(
      (i: number[]) => activity.getStandardDeviation(i) / activity.getAverage(i)
    );

    this.data.push({
      activityIdx: activity.idx,
      histfunc: "count",
      hoverinfo: "y",
      legendgroup: "spikes" + activity.idx,
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: currentBackgroundColor(),
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      name: "Histogram of CV(ISI) in" + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      source: "x+y",
      type: "histogram",
      visible: this.state.visible,
      x,
      xbins: {
        end,
        size,
        start,
      },
    } as IActivityChartPanelModelData);
  }

  /**
   * Update layout label for CV_ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "CV of ISI";
    this.panel.layout.yaxis.title = "Count";
  }
}
