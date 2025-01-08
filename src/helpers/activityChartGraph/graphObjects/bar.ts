// bar.ts

import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import { currentBackgroundColor } from "@/helpers/common/theme";

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
