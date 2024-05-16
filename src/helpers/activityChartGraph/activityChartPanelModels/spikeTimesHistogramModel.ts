// spikeTimesHistogramModel.ts

import { SpikeActivity } from "../../activity/spikeActivity";
import { currentBackgroundColor } from "../../common/theme";
import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import {
  ISpikeTimesPanelModelProps,
  SpikeTimesPanelModel,
} from "./spikeTimesPanelModel";

export class SpikeTimesHistogramModel extends SpikeTimesPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: ISpikeTimesPanelModelProps = {}
  ) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bar";
    this.id = "spikeTimesHistogram";
    this.panel.xAxis = 1;
    this.params = [
      {
        id: "binSize",
        component: "tickSlider",
        label: "bin size",
        ticks: [5, 10, 20, 50, 100, 200, 500, 1000],
        unit: "ms",
        value: 20,
      },
    ];

    this.initParams(modelProps.params);
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
    const size: number = this.params[0].value as number;

    this.data.push({
      activityIdx: activity.idx,
      histfunc: "count",
      hoverinfo: "x+y",
      legendgroup: "spikes" + activity.idx,
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: currentBackgroundColor(),
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      name: "Histogram of spike times in" + activity.recorder.view.label,
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
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "Time [ms]";
    this.panel.layout.yaxis.title = "Spike count";
  }
}
