// spikeCountPlotModel.ts

import { TNode, TParameter } from "@/types";

import { deviation, max, mean, min, sum } from "../../../utils/array";
import { SpikeActivity } from "../../activity/spikeActivity";
import { ActivityChartPanel, plotType } from "../activityChartPanel";
import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import { ActivityChartPanelModelParameter } from "../activityChartPanelModelParameter";
import {
  ISpikeTimesPanelModelProps,
  SpikeTimesPanelModel,
} from "./spikeTimesPanelModel";

export class SpikeCountPlotModel extends SpikeTimesPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: ISpikeTimesPanelModelProps = {}
  ) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "spikeCountPlot";
    this.label = "Spike count";
    this.panel.xAxis = 1;

    this.initParams([
      {
        component: "tickSlider",
        id: "binSize",
        label: "bin size",
        ticks: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000],
        unit: "ms",
        value: 50,
      },
      {
        component: "select",
        id: "normalization",
        items: [
          { title: "off" },
          { title: "firing rate [spikes/s]" },
          { title: "min-max scale" },
          { title: "lower-upper averages scale" },
          { title: "standard score" },
        ],
        handleOnUpdate: (param: TParameter) => {
          const p = param as ActivityChartPanelModelParameter;
          const paramValue = p.value as string;
          const isLowerUpper = paramValue.includes("lower-upper");
          const params = p.activityChartPanelModel.params;
          params.lowerUpperBinSize.visible = isLowerUpper;
          params.horizontalLine.visible = isLowerUpper;
        },
        label: "normalization",
        value: "off",
      },
      {
        component: "tickSlider",
        id: "lowerUpperBinSize",
        label: "bin size for lower-upper averages",
        ticks: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000],
        unit: "ms",
        value: 1,
        visible: false,
      },
      {
        component: "checkbox",
        id: "horizontalLine",
        label: "horizontal line for time constant (63%)",
        value: false,
        visible: false,
      },
    ]);

    this.updateParams(modelProps.params);
  }

  /**
   * Calculate simple histogram.
   * @param data
   * @param min
   * @param max
   * @param size
   * @returns histogram
   *
   * See https://stackoverflow.com/questions/36266895/simple-histogram-algorithm-in-javascript
   */
  histogram(
    data: number[],
    min: number = -Infinity,
    max: number = Infinity,
    size: number = 1
  ): number[] {
    for (const item of data) {
      if (item < min) min = item;
      else if (item > max) max = item;
    }

    const bins = Math.ceil((max - min + 1) / size);
    const histogram = new Array(bins).fill(0);
    for (const item of data) {
      histogram[Math.floor((item - min) / size)]++;
    }

    return histogram;
  }

  /**
   * Calculate range
   * @param size number
   * @param startAt number
   * @returns number Array
   */
  range(start: number = 0, stop: number, step: number = 1): number[] {
    return Array(Math.ceil((stop - start) / step))
      .fill(start)
      .map((x, y) => x + y * step);
  }

  /**
   * Add data of spike times for histogram panel.
   * TODO: Improve checks (div-0-error, ...).
   * @param activity spike activity object
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const nodeSizeTotal = sum(
      activity.recorder.nodes.nodeItems.map((node: TNode) => node.size)
    );
    const times: number[] = activity.events.times;
    const start: number = this.state.time.start;
    const end: number = this.state.time.end;
    const binSize: number = this.params.binSize.value as number;

    const x: number[] = this.range(start, end, binSize);
    const h: number[] = this.histogram(times, start, end, binSize);

    const normalization = this.params.normalization.value as string;
    const lowerUpperBinSize = this.params.lowerUpperBinSize.value as number;
    const horizontalLine = this.params.horizontalLine.value as boolean;

    let y: number[];
    if (normalization.includes("min-max")) {
      const minVal = min(h) as number;
      const maxVal = max(h) as number;
      y = h.map((val: number) => (val - minVal) / (maxVal - minVal));
    } else if (normalization.includes("lower-upper")) {
      const hh: number[] = this.histogram(times, start, end, lowerUpperBinSize);
      const ratio = binSize / lowerUpperBinSize;
      const minVal = (min(hh) as number) * ratio;
      const maxVal = (max(hh) as number) * ratio;
      y = h.map((val: number) => (val - minVal) / (maxVal - minVal));
    } else if (normalization.includes("standard")) {
      const m = mean(h) as number;
      const std = deviation(h) as number;
      y = h.map((val: number) => (val - m) / std);
    } else if (normalization.includes("rate")) {
      y = h.map((val: number) => (val / nodeSizeTotal / binSize) * 1000);
    } else {
      y = h;
    }

    this.data.push({
      activityIdx: activity.idx,
      hoverinfo: "x+y",
      legendgroup: "spikes" + activity.idx,
      line: {
        color: activity.recorder.view.color,
        width: 1.5,
      },
      mode: "lines",
      showlegend: false,
      type: plotType,
      visible: this.state.visible,
      x,
      y,
    } as IActivityChartPanelModelData);

    if (horizontalLine) {
      const y = 0.63;
      this.panel.layout.shapes.push({
        line: {
          color: "red",
          dash: "dot",
          width: 1,
        },
        type: "line",
        x0: 0,
        x1: 1,
        xref: "paper",
        y0: y,
        y1: y,
        yref: "y",
      });
    }
  }

  /**
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "Time [ms]";
    const ytitle = this.params.normalization.value as string;
    this.panel.layout.yaxis.title =
      ytitle == "off"
        ? "Spike count"
        : ytitle.slice(0, 1).toUpperCase() + ytitle.slice(1);
  }
}
