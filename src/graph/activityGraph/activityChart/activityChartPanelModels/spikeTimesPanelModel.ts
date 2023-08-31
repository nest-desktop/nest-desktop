// spikeTimePanelModel.ts

import { ActivityChartPanelModel, ActivityChartPanelModelProps } from "../activityChartPanelModel";
import { ActivityChartPanel } from "../activityChartPanel";

export interface SpikeTimesPanelModelProps extends ActivityChartPanelModelProps {}

export class SpikeTimesPanelModel extends ActivityChartPanelModel {
  constructor(
    panel: ActivityChartPanel,
    model: SpikeTimesPanelModelProps = {}
  ) {
    super(panel);
    this.activityType = "spike";
    this.id = "spikeTimesPanelModel";
    this.label = "spike times";
    model;

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
    this.activities = this.panel.graph.project.activities.spikes;
  }
}
