// bar.ts

import { currentBackgroundColor } from "@/theme";

import type { IActivityChartPanelModelData } from "../activityChartPanelModel";

export const bar = (args: IActivityChartPanelModelData) => ({
  hoverinfo: "x+y",
  marker: {
    color: args.color,
    line: {
      color: currentBackgroundColor(),
      width: args.x.length > 100 ? 0 : 1,
    },
  },
  mode: "bar",
  opacity: 0.6,
  showlegend: true,
  type: "bar",
  ...args,
});
