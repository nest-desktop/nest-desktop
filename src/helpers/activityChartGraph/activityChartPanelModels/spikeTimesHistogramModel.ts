// spikeTimesHistogramModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { SpikeActivity } from "../../activity/spikeActivity";
import { SpikeTimesPanelModel } from "./spikeTimesPanelModel";
import { histogram } from "../graphObjects/histogram";

export class SpikeTimesHistogramModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, modelProps: IActivityChartPanelModelProps = {}) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bar";
    this.id = "spikeTimesHistogram";
    this.panel.xAxis = 1;

    this.initParams([
      {
        component: "tickSlider",
        id: "binSize",
        label: "bin size",
        ticks: [5, 10, 20, 50, 100, 200, 500, 1000],
        unit: "ms",
        value: 20,
      },
    ]);

    this.updateParams(modelProps.params);
  }

  /**
   * Add data of spike times for histogram panel.
   * @param activity spike activity object
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const x: number[] = activity.events.times;
    const start: number = this.state.time.start;
    const end: number = this.state.time.end;
    const size: number = this.params.binSize.value as number;

    this.data.push(
      histogram({
        activityIdx: activity.idx,
        color: activity.recorder.view.color,
        legendgroup: "spikes" + activity.idx,
        name: "Histogram of spike times in" + activity.recorder.view.label,
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
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "Time [ms]";
    this.panel.layout.yaxis.title = "Spike count";
  }
}
