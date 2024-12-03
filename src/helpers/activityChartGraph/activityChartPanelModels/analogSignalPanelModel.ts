// analogSignalPanelModel.ts

import { NodeRecord } from "../../node/nodeRecord";
import { ActivityChartPanel } from "../activityChartPanel";
import { ActivityChartPanelModel, IActivityChartPanelModelProps } from "../activityChartPanelModel";

export class AnalogSignalPanelModel extends ActivityChartPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: IActivityChartPanelModelProps = {}
  ) {
    super(panel, modelProps);
    this.activityType = "analog";
    this.id = "analogSignalPanelModel";
    this.label = "analog signals";
  }

  /**
   * Initialize panel model for analog signals.
   *
   * @remarks
   * It sets activities and gets records from recorders.
   */
  override init(): void {
    this.logger.trace("init");

    this.updateActivities();
    this.initAnalogRecords();

    this.initAnalogRecordsVisible();
  }

  get axisTitle(): string {
    let title = "";
    const records = this.recordsVisible;
    const uniqueRecords = new Set(
      records.map((record: NodeRecord) => record.id)
    );
    if (uniqueRecords.size === 1) {
      const record = records[0];
      title = record.labelCapitalize;
      if (record.unit) {
        title += ` [${record.unit}]`;
      }
    } else if (
      records.every((record: NodeRecord) => record.id.includes("ct_"))
    ) {
      title = "Channel activation";
    } else if (
      records.every((record: NodeRecord) => record.id.includes("g_"))
    ) {
      title = "Conductance [nS]";
    } else if (
      records.every((record: NodeRecord) => record.id.includes("I_syn_"))
    ) {
      title = "Total synaptic current [pA]";
    } else if (
      records.every((record: NodeRecord) =>
        record.id.includes("weighted_spikes_")
      )
    ) {
      title = "Weighted incoming spikes";
    } else {
      title = "Multiple records";
    }
    return title;
  }

  /**
   * Update activities of analog signals.
   */
  override updateActivities(): void {
    this.activities = this.panel.graph.project.activities.analogSignals;
  }
}
