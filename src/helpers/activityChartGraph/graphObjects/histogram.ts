// histogram.ts

import { currentBackgroundColor } from "../../common/theme";
import { IActivityChartPanelModelData } from "../activityChartPanelModel";

export const histogram = (args: IActivityChartPanelModelData) => ({
  histfunc: "count",
  hoverinfo: "y",
  marker: {
    color: args.color,
    line: {
      color: currentBackgroundColor(),
      width: (args.xbins.end - args.xbins.start) / args.xbins.size > 100 ? 0 : 1,
    },
  },
  opacity: 0.6,
  showlegend: false,
  source: "x+y",
  type: "histogram",
  ...args,
});
