import { reactive, UnwrapRef } from '@vue/composition-api';

import { Activity } from '../activity';
import { ActivityChartPanel } from './activityChartPanel';
import { NodeRecord } from '../../node/nodeRecord';

export abstract class ActivityChartPanelModel {
  // private static readonly _name = 'ActivityGraphPanel';
  private _activities: Activity[] = [];
  private _activityType: string = '';
  private _data: any[] = [];
  private _icon: string = '';
  private _id: string = '';
  private _label: string = '';
  private _panel: ActivityChartPanel; // parent
  private _params: any[] = [];
  private _state: UnwrapRef<any>;

  constructor(panel: ActivityChartPanel) {
    this._id = 'activityChart';
    this._panel = panel;
    this._state = reactive({
      histogram: {
        end: -1e100,
        start: 1e100,
      },
      records: [],
      recordsVisible: [],
      time: {
        end: 0,
        start: 0,
      },
    });
  }

  get activities(): Activity[] {
    return this._activities;
  }

  set activities(value: Activity[]) {
    this._activities = value;
  }

  get activityType(): string {
    return this._activityType;
  }

  set activityType(value: string) {
    this._activityType = value;
  }

  get data(): any[] {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get panel(): ActivityChartPanel {
    return this._panel;
  }

  get params(): any[] {
    return this._params;
  }

  set params(value: any[]) {
    this._params = value;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  /**
   * Capitalize axis label.
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Check if it has any activities.
   */
  hasActivities(): boolean {
    return this.activities.length > 0;
  }

  /**
   * Check if record is selected.
   */
  isRecordSelected(record: NodeRecord): boolean {
    return this._state.recordsVisible.some((rec: NodeRecord) => rec === record);
  }

  /**
   * Reset activity panel model.
   */
  reset(): any {
    this.data = [];
  }

  /**
   * Initialize panel model.
   *
   * @remarks
   * This method will be overwritten in child classes.
   */
  abstract init(): void;

  /**
   * Initialize activities of panel model.
   *
   * @remarks
   * This method will be overwritten in child classes.
   */
  abstract initActivities(): void;

  /**
   * Initialize records from analog activities.
   */
  initAnalogRecords(): void {
    // console.log('Initialize records for analog signals.');
    this._state.records = [];
    this.activities
      .filter((activity: Activity) =>
        activity.recorder.model.isAnalogRecorder()
      )
      .forEach((activity: Activity) => {
        // activity.recorder.initRecords();
        if (activity.recorder.records != null) {
          activity.recorder.records.forEach((record: NodeRecord) => {
            record.activity = activity;
            this._state.records.push(record);
          });
        }
      });
    if (this._state.recordsVisible.length === 0) {
      this._state.recordsVisible = [...this.state.records];
    }
  }

  /**
   * Initialize visible records from analog activities.
   */
  initAnalogRecordsVisible(records: any[] = []): void {
    // console.log('Initialize visible records for analog signals.');
    if (this._state.records.length === 0) {
      this._state.recordsVisible = [];
      return;
    }

    if (records.length > 0) {
      this._state.recordsVisible = records
        .filter((record: any) =>
          this._state.records.some(
            (rec: NodeRecord) => rec.groupId === record.groupId
          )
        )
        .map((record: any) => {
          const recordVisible = this._state.records.find(
            (rec: NodeRecord) => rec.groupId === record.groupId
          );
          if (recordVisible != null) recordVisible.color = record.color;
          return recordVisible;
        });
    }
  }

  /**
   * Update panel model.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    // console.log('Update activity chart panel model.');
    this.updateTime();
    this.updateAnalogRecords();

    this.data = [];
    this.activities.forEach((activity: Activity) => {
      this.updateData(activity);
    });

    this.updateLayoutLabel();
  }

  /**
   * Update records of the panel models from all analog activities.
   */
  updateAnalogRecords(): void {
    // Remove old records from other recorder.
    this._state.records = this._state.records.filter(
      (panelRecord: NodeRecord) => {
        return panelRecord.node.records.some(
          (record: NodeRecord) => record.groupId === panelRecord.groupId
        );
      }
    );

    // Add new records from current recorder.
    this._activities
      .filter((activity: Activity) =>
        activity.recorder.model.isAnalogRecorder()
      )
      .forEach((activity: Activity) => {
        if (activity.recorder.records != null) {
          activity.recorder.records.forEach((record: NodeRecord) => {
            if (!this._state.records.includes(record)) {
              record.activity = activity;
              this._state.records.push(record);
            }
          });
        }
      });

    // Update node size.
    this._state.records.forEach((record: NodeRecord) => {
      record.nodeSize = record.activity.nodeIds.length;
    });
  }

  /**
   * Update color for records.
   */
  updateRecordsColor(): void {
    this._data.forEach((data: any) => {
      if (data.class === 'background') {
        return;
      }

      const record = this._state.recordsVisible.find(
        (record: NodeRecord) =>
          record.id === data.recordId &&
          record.activity.idx === data.activityIdx
      );

      const activity = this._activities[data.activityIdx];
      const color = record
        ? record.color
        : activity.recorder.view.color || 'black';

      if (data.marker) {
        data.marker.color = color;
      } else if (data.line) {
        data.line.color = color;
      }
    });
  }

  /**
   * Update activity graph panel.
   *
   * @remarks
   * It requires activity data.
   * It is a replacement for abstract component.
   */
  updateData(activity: Activity): void {
    activity;
  }

  /**
   * Update layout label.
   *
   * @remarks
   * It is a replacement for abstract component.
   */
  updateLayoutLabel(records: any = undefined): void {
    records;
  }

  /**
   * Update time of the panel model.
   *
   * @remarks
   * It needs activity data.
   */
  updateTime(): void {
    // Update time
    this._state.time.start = 0;
    this._state.time.end = Math.max(
      this._state.time.end,
      this._panel.graph.currenttime + 1
    );
  }

  /**
   * Remove record from the state.
   */
  removeRecord(record: NodeRecord): void {
    this._state.recordsVisible.splice(
      this._state.recordsVisible.indexOf(record),
      1
    );
  }

  /**
   * Serialize for JSON.
   * @return activity chart panel model object
   */
  toJSON(): any {
    const model: any = {
      id: this._id,
    };
    if (this._state.recordsVisible.length > 0) {
      model.records = this._state.recordsVisible.map((record: NodeRecord) =>
        record.toJSON()
      );
    }
    return model;
  }
}
