// spikeTimePanelModel.ts

import {
  ActivityChartPanelModel,
  IActivityChartPanelModelProps,
} from "../activityChartPanelModel";
import { ActivityChartPanel } from "../activityChartPanel";

export interface ISpikeTimesPanelModelProps
  extends IActivityChartPanelModelProps {}

export class SpikeTimesPanelModel extends ActivityChartPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: ISpikeTimesPanelModelProps = {}
  ) {
    super(panel);
    this.activityType = "spike";
    this.id = "spikeTimesPanelModel";
    this.label = "spike times";
    modelProps; // TODO: check if it is required.

    this.init();
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
