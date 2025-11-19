// spikeTimePanelModel.ts

import type { ActivityChartPanel } from "../activityChartPanel";
import { ActivityChartPanelModel, type IActivityChartPanelModelProps } from "../activityChartPanelModel";

export class SpikeTimesPanelModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel, modelProps: IActivityChartPanelModelProps = {}) {
    super(panel, modelProps);
    this.activityType = "spike";
    this.id = "spikeTimesPanelModel";
    this.label = "spike times";
  }

  /**
   * Initialize panel model.
   */
  override init(): void {
    this.updateActivities();
  }

  /**
   * Update spike activities.
   */
  override updateActivities(): void {
    this.activities = this.panel.graph.project.activities.spikes;
  }
}
