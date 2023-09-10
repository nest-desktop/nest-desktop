// interSpikeIntervalHistogramModel.ts

import { currentBackgroundColor } from "@/helpers/common/theme";
import { max } from "@/helpers/common/array";
import { SpikeActivity } from "@/helpers/activity/spikeActivity";

import { ActivityChartPanel } from "../activityChartPanel";
import { SpikeTimesPanelModel } from "./spikeTimesPanelModel";

export class InterSpikeIntervalHistogramModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.icon = "mdi-chart-bar";
    this.id = "interSpikeIntervalHistogram";
    this.label = "inter-spike interval";
    this.panel.xaxis = 2;
    this.params = [
      {
        id: "binSize",
        variant: "tickSlider",
        label: "bin size",
        ticks: [1, 2, 5, 10, 20, 50],
        unit: "ms",
        value: 5,
      },
    ];
    this.state.xaxisType = "linear";

    this.initParams(model.params);
  }

  /**
   * Add data of ISI for histogram panel.
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const isi: number[][] = activity.ISI();
    const x: number[] = isi.flat();
    const start: number = 0;
    const end: number = (max(x) as number) + 1;
    const size: number = this.params[0].value;

    this.data.push({
      activityIdx: activity.idx,
      histfunc: "count",
      hoverinfo: "x-y",
      legendgroup: "spikes" + activity.idx,
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: currentBackgroundColor(),
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      name: "Histogram of ISI in" + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      source: "x",
      type: "histogram",
      visible: this.state.visible,
      x,
      xbins: {
        end,
        size,
        start,
      },
    });
  }

  /**
   * Update layout label for ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.type = this.state.xaxisType;
    this.panel.layout.xaxis.title = "Inter-spike interval [ms]";
    this.panel.layout.yaxis.title = "Count";
  }
}
