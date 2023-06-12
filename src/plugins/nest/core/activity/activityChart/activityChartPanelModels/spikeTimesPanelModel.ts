// spikeTimePanelModel.ts

import { ActivityChartPanelModel, activityChartPanelModelProps } from "../activityChartPanelModel";
import { ActivityChartPanel } from "../activityChartPanel";

export interface spikeTimesPanelModelProps extends activityChartPanelModelProps {}

export class SpikeTimesPanelModel extends ActivityChartPanelModel {
  constructor(
    panel: ActivityChartPanel,
    model: spikeTimesPanelModelProps = {}
  ) {
    super(panel);
    this.activityType = "spike";
    this.id = "spikeTimesPanelModel";
    this.label = "spike times";

    this.init();
  }

  /**
   * Initialize panel model.
   */
  override init(): void {
    this.initActivities();
  }

  /**
   * Initialize model for spike activities.
   */
  initActivities(): void {
    this.activities = this.panel.graph.project.spikeActivities;
  }
}
