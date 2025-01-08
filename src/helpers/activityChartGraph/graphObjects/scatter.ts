// scatter.ts

import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import { plotType } from "../activityChartPanel";

export const scatter = (args: IActivityChartPanelModelData) => ({
  hoverinfo: "x",
  legendgroup: "spikes" + args.activityIdx,
  marker: {
    color: args.color,
    size: 5,
  },
  mode: "markers",
  showlegend: true,
  type: plotType,
  ...args,
});

export const scatterSpikes = (args: IActivityChartPanelModelData) => ({
  hoverinfo: "x",
  legendgroup: "spikes" + args.activityIdx,
  marker: {
    line: {
      color: args.color,
      width: 2,
    },
    color: args.color,
    size: 5,
    symbol: "line-ns",
  },
  mode: "markers",
  showlegend: true,
  type: plotType,
  ...args,
});
