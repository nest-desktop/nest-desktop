// line.ts

import { IActivityChartPanelModelData } from "../activityChartPanelModel";

export const line = (args: IActivityChartPanelModelData) => ({
  hoverinfo: "x+y",
  line: {
    color: args.color,
    width: 1.5,
  },
  mode: "lines",
  showlegend: true,
  type: "scattergl",
  ...args,
});
