// spikeTimePanelModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import {
  ActivityChartPanelModel,
  IActivityChartPanelModelProps,
} from "../activityChartPanelModel";

export interface ISpikeTimesPanelModelProps
  extends IActivityChartPanelModelProps {}

export class SpikeTimesPanelModel extends ActivityChartPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: ISpikeTimesPanelModelProps = {}
  ) {
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
