// analogSignalPanelModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { ActivityChartPanelModel, IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { NodeRecord } from "../../../node/nodeRecord";
import { NodeActivity } from "@/helpers/nodeActivity/nodeActivity";
import { NodeAnalogSignalActivity } from "@/helpers/nodeActivity/nodeAnalogSignalActivity";

export class AnalogSignalPanelModel extends ActivityChartPanelModel {
  constructor(panel: ActivityChartPanel, modelProps: IActivityChartPanelModelProps = {}) {
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

  /**
   * Initialize records from analog activities.
   */
  initAnalogRecords(): void {
    this.logger.trace("init analog records");

    this.state.records = [] as NodeRecord[];

    this.activities
      .filter((activity: NodeActivity) => "recorder" in activity && activity.recorder.model.isAnalogRecorder)
      .forEach((activity: NodeAnalogSignalActivity) => {
        if (activity.recorder.records)
          activity.recorder.records.forEach((record: NodeRecord) => this.records.push(record));
      });

    if (this.state.recordsVisible.length === 0) this.selectAllNodeRecords();
  }

  /**
   * Initialize visible records from analog activities.
   */
  initAnalogRecordsVisible(): void {
    const recordsProps: string[] = this.props.records || [];
    this.logger.trace("init visible analog records");

    if (recordsProps && recordsProps.length > 0) this.state.recordsVisible = recordsProps;
    // else {
    //   this.state.recordsVisible = this.state.records.map((record: NodeRecord) => record.groupId);
    // }
  }

  get axisTitle(): string {
    let title = "";
    const records = this.recordsVisible;
    const uniqueRecords = new Set(records.map((record: NodeRecord) => record.id));
    if (uniqueRecords.size === 1) {
      const record = records[0];
      title = record.labelCapitalize;
      if (record.unit) title += ` [${record.unit}]`;
    } else if (records.every((record: NodeRecord) => record.id.includes("ct_"))) {
      title = "Channel activation";
    } else if (records.every((record: NodeRecord) => record.id.includes("g_"))) {
      title = "Conductance [nS]";
    } else if (records.every((record: NodeRecord) => record.id.includes("I_syn_"))) {
      title = "Total synaptic current [pA]";
    } else if (records.every((record: NodeRecord) => record.id.includes("weighted_spikes_"))) {
      title = "Weighted incoming spikes";
    } else {
      title = "Multiple records";
    }
    return title;
  }

  /**
   * Remove record from the state.
   * @param record node record objects
   */
  removeRecord(record: NodeRecord): void {
    this.recordsVisible.splice(this.recordsVisible.indexOf(record), 1);
  }

  /**
   * Select all node records.
   */
  selectAllNodeRecords(): void {
    this.state.recordsVisible = this.records.map((record: NodeRecord) => record.groupId);
  }

  /**
   * Update activities of analog signals.
   */
  override updateActivities(): void {
    this.activities = this.panel.graph.project.activities.analogSignals;
  }
}
