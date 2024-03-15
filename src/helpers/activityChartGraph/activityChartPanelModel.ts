// activityChartPanelModel.ts - 20 anys

import { reactive, UnwrapRef } from "vue";
import { Data } from "plotly.js-dist-min";

import { Activity } from "../activity/activity";
import { ActivityChartPanel } from "./activityChartPanel";
import { BaseObj } from "../common/base";
import { NodeRecord } from "../node/nodeRecord";

export interface IActivityChartPanelModelProps {
  id?: string;
  markerSize?: number;
  params?: any;
  records?: any;
}

export abstract class ActivityChartPanelModel extends BaseObj {
  private _activities: Activity[] = [];
  private _activityType: string = "";
  private _data: Data[] = [];
  private _icon: string = "";
  private _id: string = "";
  private _label: string = "";
  private _panel: ActivityChartPanel; // parent
  private _params: { [key: string]: any } = {};
  private _state: UnwrapRef<any>;

  constructor(panel: ActivityChartPanel) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._id = "activityChart";
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
      visible: true,
      visibleThreshold: "legendonly",
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

  /**
   * Check if it has any activities.
   */
  get hasActivities(): boolean {
    return this.activities.length > 0;
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

  get params(): { [key: string]: any } {
    return this._params;
  }

  set params(value: { [key: string]: any }) {
    this._params = value;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  /**
   * Add data of this activity graph panel.
   *
   * @remarks
   * It requires activity data.
   * It is a replacement for abstract component.
   */
  addData(activity: Activity): void {
    activity;
  }

  /**
   * Capitalize axis label.
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Get activity from the project.
   */
  getActivity(idx: number): Activity {
    return this._panel.graph.project.activities.all[idx];
  }

  /**
   * Initialize panel model.
   *
   * @remarks
   * This method will be overwritten in child classes.
   */
  abstract init(): void;

  /**
   * Initialize records from analog activities.
   */
  initAnalogRecords(): void {
    this.logger.trace("init analog records");

    this._state.records = [];

    this.activities
      .filter((activity: Activity) => activity.recorder.model.isAnalogRecorder)
      .forEach((activity: Activity) => {
        if (activity.recorder.records) {
          activity.recorder.records.forEach((record: NodeRecord) => {
            this._state.records.push(record);
          });
        }
      });

    this._state.recordsVisible = [...this.state.records];
  }

  /**
   * Initialize visible records from analog activities.
   */
  initAnalogRecordsVisible(records: any[] = []): void {
    this.logger.trace("init visible analog records:", records);

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
   * Initialize params for controller.
   */
  initParams(params: any = {}): void {
    Object.keys(this._params)
      .filter((paramKey: string) => params[paramKey])
      .forEach((paramKey: string) => {
        this.params[paramKey] = params[paramKey];
      });
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
   * Reset activity panel model.
   */
  reset(): any {
    this.data = [];
  }

  /**
   * Serialize for JSON.
   * @return activity chart panel model props
   */
  toJSON(): IActivityChartPanelModelProps {
    const modelProps: IActivityChartPanelModelProps = {
      id: this._id,
      params: {},
    };

    if (this._params.length > 0) {
      this._params.forEach((param: any) => {
        modelProps.params[param.id] = param.value;
      });
    }

    if (this._state.recordsVisible.length > 0) {
      modelProps.records = this._state.recordsVisible.map(
        (record: NodeRecord) => record.toJSON()
      );
    }
    return modelProps;
  }

  /**
   * Update panel model.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    this.logger.trace("Update");

    // Update time.
    this.updateTime();

    // Update activities.
    this.updateActivities();

    // Update analog records.
    this.updateAnalogRecords();

    // Update data.
    this.updateData();

    // Update label for layout.
    this.updateLayoutLabel();
  }

  /**
   * Update active marker.
   **/
  updateActiveMarker(record?: NodeRecord): void {
    record;
  }

  /**
   * Update activities.
   */
  updateActivities(): void {
    this.activities = this.panel.graph.project.activities.all;
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
      .filter((activity: Activity) => activity.recorder.model.isAnalogRecorder)
      .forEach((activity: Activity) => {
        if (activity.recorder.records != null) {
          activity.recorder.records.forEach((record: NodeRecord) => {
            if (!this._state.records.includes(record)) {
              this._state.records.push(record);
            }
          });
        }
      });

    // Update records.
    this._state.records.forEach((record: NodeRecord) => record.update());
  }

  updateData(): void {
    this.data = [];
    this.activities.forEach((activity: Activity) => {
      this.addData(activity);
    });
  }

  /**
   * Update color for records.
   */
  updateRecordsColor(): void {
    this._data.forEach((data: any) => {
      if (data.class === "background") {
        return;
      }

      const activity = this.getActivity(data.activityIdx);
      const record = this._state.recordsVisible.find(
        (record: NodeRecord) =>
          record.id === data.recordId &&
          record.activity.idx === data.activityIdx
      );

      const color = record
        ? record.color
        : activity.recorder.view.color || "grey";

      if (data.type.includes("scatter")) {
        if (data.mode.includes("markers")) {
          data.marker.line.color = color;
        }
        if (data.mode.includes("lines")) {
          data.line.color = color;
        }
      } else if (data.mode == "bar" || data.type == "histogram") {
        data.marker.color = color;
      }
    });
  }

  /**
   * Update layout label.
   *
   * @remarks
   * It is a replacement for abstract component.
   */
  updateLayoutLabel(records?: any): void {
    records;
  }

  /**
   * Update time of the panel model.
   *
   * @remarks
   * It needs activity data.
   */
  updateTime(): void {
    this._state.time.start = 0;
    this._state.time.end = Math.max(
      this._state.time.end,
      this._panel.graph.currentTime + 1
    );
  }
}
