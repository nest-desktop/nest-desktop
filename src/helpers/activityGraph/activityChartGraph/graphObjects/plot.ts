// plot.ts

import { IActivityChartPanelModelData } from "../activityChartPanelModel";
import { bar } from "./bar";
import { currentBackgroundColor } from "@/helpers/common/theme";
import { histogram } from "./histogram";
import { line } from "./line";
import { scatter } from "./scatter";

export const plot = (mode: string, args: IActivityChartPanelModelData) => {
  switch (mode) {
    case "bar":
      return bar(args);
    case "histogram":
      return histogram(args);
    case "lines":
      return line(args);
    case "lines+markers":
      return line({
        marker: {
          color: args.color,
          line: {
            color: currentBackgroundColor(),
            width: 1,
          },
        },
        ...args,
      });
    case "markers":
      return scatter(args);
    case "scatter":
      return scatter(args);
  }
};
