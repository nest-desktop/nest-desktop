import { reactive, UnwrapRef } from '@vue/composition-api';

import { Activity } from '../activity';
import { ActivityChartPanel } from './activityChartPanel';

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

  constructor(panel: ActivityChartPanel, model: any = {}) {
    this._id = 'activityChart';
    this._panel = panel;
    this._state = reactive({
      events: [],
      records: [],
      time: {
        end: 0,
        start: 0,
      },
    });

    if (model.events != null) {
      this._state.events = model.events;
    }
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

  get state(): any {
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
   * Initialize activity panel model.
   *
   * @remarks
   * This method will be overwritten in child classes.
   */
  abstract initActivities(): void;

  /**
   * Reset activity panel model.
   */
  reset(): any {
    this.data = [];
  }

  /**
   * Update data activities.
   *
   * @remarks
   * It requires activity data.
   */
  update(): any {
    this.updateTime();

    this.data = [];
    this.activities.forEach((activity: Activity) => {
      this.updateData(activity);
    });

    this.updateAnalogRecords();
    this.updateLayoutLabel();
  }

  /**
   * Update marker color for activities.
   */
  updateColor(): void {
    this.activities.forEach((activity: Activity) => {
      const data: any = this.data.find(
        (d: any) => d.activityIdx === activity.idx
      );
      if (data != null) {
        data.marker.color = activity.recorder.view.color;
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
   * Init records from analog activities.
   */
  initAnalogRecords(): void {
    this._state.records = [];
    this.activities
      .filter((activity: Activity) => activity.hasAnalogData())
      .forEach((activity: Activity) => {
        const record = {
          activityIdx: activity.idx,
          color: activity.recorder.view.color,
          id: 'V_m',
          label: activity.recorder.view.recordLabel('V_m'),
          nodeSize: 0,
          value: 'V_m' + activity.idx,
        };
        if (activity.recorder.records != undefined) {
          activity.recorder.records.forEach((recordId: string) => {
            const recordCopied = Object.assign({}, record, {
              id: recordId,
              label: activity.recorder.view.recordLabel(recordId),
              value: recordId + activity.idx,
            });
            this._state.records.push(recordCopied);
          });
        } else {
          this._state.records.push(record);
        }
      });

    if (this._state.records.length > 0) {
      this._state.events =
        this._state.events.length === 0
          ? [...this._state.records]
          : this._state.events.map((event: any) => {
              const rec = this._state.records.find(
                (record: any) => record.value === event.value
              );
              rec.color = event.color;
              return rec;
            });
    }
  }

  /**
   * Update records of the panel models from all analog activities.
   */
  updateAnalogRecords(): void {
    this._state.records.forEach((record: any) => {
      const activity = this.activities[record.activityIdx];
      record.nodeSize = activity.nodeIds.length;
    });
  }

  /**
   * Update record from the state.
   */
  removeRecord(record: any): void {
    this._state.events.splice(this._state.events.indexOf(record), 1);
  }

  /**
   * Serialize for JSON.
   * @return activity chart panel model object
   */
  toJSON(): any {
    const model: any = {
      id: this._id,
    };
    if (this._state.events.length > 0) {
      model.events = this._state.events;
    }
    return model;
  }
}
