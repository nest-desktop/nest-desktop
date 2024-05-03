// spikeCountPlotModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import {
  ISpikeTimesPanelModelProps,
  SpikeTimesPanelModel,
} from "./spikeTimesPanelModel";
import { SpikeActivity } from "@/helpers/activity/spikeActivity";
import { TNode } from "@/types/nodeTypes";
import { sum, deviation, max, mean, min } from "@/helpers/common/array";
import { useAppStore } from "@/stores/appStore";

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
    this.params = [
      {
        id: "binSize",
        component: "tickSlider",
        label: "Bin size",
        ticks: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000],
        unit: "ms",
        value: 1,
      },
      {
        _parent: this,
        _value: "off",
        id: "normalizedValue",
        component: "select",
        items: [
          "off",
          "firing rate [spikes/s]",
          "min-max scale",
          "lower-upper averages scale",
          "standard score",
        ],
        label: "Normalization",
        get value(): string {
          return this._value as string;
        },
        set value(value: string) {
          this._value = value;
          const paramLower = this._parent?.params[2];
          if (paramLower) {
            paramLower.show = value.startsWith("lower-upper");
          }
          const paramUpper = this._parent?.params[3];
          if (paramUpper) {
            paramUpper.show = value.startsWith("lower-upper");
          }
        },
      },
      {
        id: "lowerUpperBinSize",
        component: "tickSlider",
        label: "Bin size for lower-upper averages",
        show: false,
        ticks: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000],
        unit: "ms",
        value: 1,
      },
      {
        id: "horizontalLine",
        component: "checkbox",
        label: "Horizontal line for time constant (63%)",
        show: false,
        value: false,
      },
    ];

    this.initParams(modelProps.params);
  }

  get binSize(): number {
    return this.params[0].value as number;
  }

  get horizontalLine(): string {
    return this.params[3].value as string;
  }

  get lowerUpperBinSize(): number {
    return this.params[2].value as number;
  }

  get normalization(): string {
    return this.params[1].value as string;
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
    const appStore = useAppStore();

    const nodeSizeTotal = sum(
      activity.recorder.nodes.nodes.map((node: TNode) => node.size)
    );
    const times: number[] = activity.events.times;
    const start: number = this.state.time.start;
    const end: number = this.state.time.end;
    const binSize: number = this.binSize;

    const x: number[] = this.range(start, end, binSize);
    const h: number[] = this.histogram(times, start, end, binSize);

    let y: number[];
    if (this.normalization === "min-max scale") {
      const minVal = min(h) as number;
      const maxVal = max(h) as number;
      y = h.map((val: number) => (val - minVal) / (maxVal - minVal));
    } else if (this.normalization.startsWith("lower-upper")) {
      const hh: number[] = this.histogram(
        times,
        start,
        end,
        this.lowerUpperBinSize
      );
      const ratio = binSize / this.lowerUpperBinSize;
      const minVal = (min(hh) as number) * ratio;
      const maxVal = (max(hh) as number) * ratio;
      y = h.map((val: number) => (val - minVal) / (maxVal - minVal));
    } else if (this.normalization === "standard score") {
      const m = mean(h) as number;
      const std = deviation(h) as number;
      y = h.map((val: number) => (val - m) / std);
    } else if (this.normalization.startsWith("firing rate")) {
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
      type: appStore.state.webGL ? "scattergl" : "scatter",
      visible: this.state.visible,
      x,
      y,
    } as IActivityChartPanelModelData);

    if (this.horizontalLine) {
      this.data.push({
        activityIdx: activity.idx,
        hoverinfo: "none",
        legendgroup: "spikes" + activity.idx,
        line: {
          color: "red",
          dash: "dot",
          width: 1,
        },
        mode: "lines",
        showlegend: false,
        type: appStore.state.webGL ? "scattergl" : "scatter",
        visible: this.state.visible,
        x: [start, end],
        y: [0.63, 0.63],
      } as IActivityChartPanelModelData);
    }
  }

  /**
   * Update layout label for spike time histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = "Time [ms]";
    const ytitle = this.params[1].value as string;
    this.panel.layout.yaxis.title =
      ytitle == "off"
        ? "Spike count"
        : ytitle.slice(0, 1).toUpperCase() + ytitle.slice(1);
  }
}
