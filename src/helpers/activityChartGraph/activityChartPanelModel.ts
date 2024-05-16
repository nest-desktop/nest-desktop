// activityChartPanelModel.ts

import { UnwrapRef, reactive } from "vue";

import { Activity } from "../activity/activity";
import { BaseObj } from "../common/base";
import { TParamValue } from "../common/parameter";
import { currentBackgroundColor } from "../common/theme";
import { INodeRecordProps, NodeRecord } from "../node/nodeRecord";
import { ActivityChartPanel } from "./activityChartPanel";

export interface IActivityChartPanelModelData {
  activityIdx: number;
  class?: string;
  dataIdx?: number;
  histfunc?: string;
  hoverinfo: string;
  legendgroup: string;
  line: {
    color?: string;
    dash?: string;
    shape?: string;
    width?: number;
  };
  marker?: {
    color: string;
    line?: {
      color: string;
      width: number;
    };
    size?: number;
    symbol?: string;
  };
  mode: string;
  modelId?: string;
  name?: string;
  nodeId?: number;
  opacity?: number;
  panelIdx?: number;
  recordId: string;
  showlegend: boolean;
  source?: string;
  type: string;
  visible: boolean;
  x: number[];
  xaxis?: string;
  xbins?: {
    end: number;
    size: number;
    start: number;
  };
  y: number[];
  yaxis?: string;
}

interface IActivityChartPanelModelParamProps {
  _parent?: ActivityChartPanelModel;
  _value?: string;
  component: string;
  id: string;
  items?: string[] | { [key: string]: string }[];
  label: string;
  selected?: number[];
  show?: boolean;
  ticks?: number[];
  unit?: string;
  value: TParamValue;
}

export interface IActivityChartPanelModelProps {
  id?: string;
  markerSize?: number;
  params?: { [key: string]: TParamValue };
  records?: INodeRecordProps[];
}

interface IActivityChartPanelModelState {
  height: number;
  histogram: {
    end: number;
    start: number;
  };
  records: NodeRecord[];
  recordsVisible: NodeRecord[];
  time: {
    end: number;
    start: number;
  };
  visible: boolean;
  visibleThreshold: string;
  xaxisType: "linear" | "log";
}

export abstract class ActivityChartPanelModel extends BaseObj {
  private _activities: Activity[] = [];
  private _activityType: string = "";
  private _data: IActivityChartPanelModelData[] = [];
  private _icon: string = "";
  private _id: string = "";
  private _label: string = "";
  private _panel: ActivityChartPanel; // parent
  private _params: IActivityChartPanelModelParamProps[] = [];
  private _state: UnwrapRef<IActivityChartPanelModelState>;

  constructor(panel: ActivityChartPanel) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._id = "activityChart";
    this._panel = panel;
    this._state = reactive({
      height: 1,
      histogram: {
        end: -1e100,
        start: 1e100,
      },
      records: [] as NodeRecord[],
      recordsVisible: [] as NodeRecord[],
      time: {
        end: 0,
        start: 0,
      },
      visible: true,
      visibleThreshold: "legendonly",
      xaxisType: "linear",
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

  get data(): IActivityChartPanelModelData[] {
    return this._data;
  }

  set data(value: IActivityChartPanelModelData[]) {
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

  get params(): IActivityChartPanelModelParamProps[] {
    return this._params;
  }

  set params(value: IActivityChartPanelModelParamProps[]) {
    this._params = value;
  }

  get records(): NodeRecord[] {
    return this._state.records as NodeRecord[];
  }

  get recordsVisible(): NodeRecord[] {
    return this._state.recordsVisible as NodeRecord[];
  }

  get state(): UnwrapRef<IActivityChartPanelModelState> {
    return this._state;
  }

  /**
   * Add data of this activity graph panel.
   * @param activity
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
   * @param text
   * @returns string
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Get activity from the project.
   * @param idx
   * @returns activity object
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

    this._state.records = [] as NodeRecord[];

    this.activities
      .filter((activity: Activity) => activity.recorder.model.isAnalogRecorder)
      .forEach((activity: Activity) => {
        if (activity.recorder.records) {
          activity.recorder.records.forEach((record: NodeRecord) => {
            this.records.push(record);
          });
        }
      });

    this._state.recordsVisible = [...this.records] as NodeRecord[];
  }

  /**
   * Initialize visible records from analog activities.
   * @param recordsProps node records props
   */
  initAnalogRecordsVisible(recordsProps: INodeRecordProps[] = []): void {
    this.logger.trace("init visible analog records:", recordsProps);

    if (this.records.length === 0) {
      this._state.recordsVisible = [] as NodeRecord[];
      return;
    }

    if (recordsProps.length > 0) {
      this._state.recordsVisible = recordsProps
        .filter((recordProps: INodeRecordProps) =>
          this.records.some(
            (rec: NodeRecord) => rec.groupId === recordProps.groupId
          )
        )
        .map((recordProps: INodeRecordProps) => {
          const recordVisible = this.records.find(
            (rec: NodeRecord) => rec.groupId === recordProps.groupId
          );
          if (recordVisible != null) recordVisible.color = recordProps.color;
          return recordVisible as NodeRecord;
        }) as NodeRecord[];
    }
  }

  /**
   * Initialize params for controller.
   * @param paramsProps parameter props
   */
  initParams(paramsProps: { [key: string]: TParamValue } = {}): void {
    this._params.forEach((param: IActivityChartPanelModelParamProps) => {
      if (paramsProps.hasOwnProperty(param.id)) {
        param.value = paramsProps[param.id];
      }
    });
  }

  /**
   * Remove record from the state.
   * @param record node record objects
   */
  removeRecord(record: NodeRecord): void {
    this.recordsVisible.splice(this.recordsVisible.indexOf(record), 1);
  }

  /**
   * Reset activity panel model.
   */
  reset(): void {
    this.data = [];
  }

  /**
   * Serialize for JSON.
   * @return activity chart panel model props
   */
  toJSON(): IActivityChartPanelModelProps {
    const modelProps: IActivityChartPanelModelProps = {
      id: this._id,
      params: {} as { [key: string]: TParamValue },
    };

    if (modelProps.params && this._params.length > 0) {
      this._params.forEach((param: IActivityChartPanelModelParamProps) => {
        const params = modelProps.params;
        if (params) {
          params[param.id] = param.value;
        }
      });
    }

    if (this._state.recordsVisible.length > 0) {
      modelProps.records = this.recordsVisible.map((record: NodeRecord) =>
        record.toJSON()
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
    this.logger.trace("update");

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
   * @param record
   */
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
    this._state.records = this.records.filter((panelRecord: NodeRecord) => {
      return panelRecord.node.records.some(
        (record: NodeRecord) => record.groupId === panelRecord.groupId
      );
    }) as NodeRecord[];

    // Add new records from current recorder.
    this._activities
      .filter((activity: Activity) => activity.recorder.model.isAnalogRecorder)
      .forEach((activity: Activity) => {
        if (activity.recorder.records != null) {
          activity.recorder.records.forEach((record: NodeRecord) => {
            if (!this.records.includes(record)) {
              this.records.push(record);
            }
          });
        }
      });

    // Update records.
    this.records.forEach((record: NodeRecord) => record.update());
  }

  /**
   * Update data.
   */
  updateData(): void {
    this.data = [];
    this.activities.forEach((activity: Activity) => {
      this.addData(activity);
    });
  }

  /**
   * Update background color.
   */
  updateBackgroundColor(): void {
    this._data.forEach((data: IActivityChartPanelModelData) => {
      if (data.marker && data.marker.line && data.type === "histogram") {
        data.marker.line.color = currentBackgroundColor();
      }
    });
  }

  /**
   * Update color of records.
   */
  updateRecordsColor(): void {
    this._data.forEach((data: IActivityChartPanelModelData) => {
      if (data.class === "background") {
        return;
      }

      const activity = this.getActivity(data.activityIdx);
      const record = this.recordsVisible.find(
        (record: NodeRecord) =>
          record.id === data.recordId &&
          record.activity.idx === data.activityIdx
      );

      const color = record
        ? record.color
        : activity.recorder.view.color || "grey";

      if (data.type.includes("scatter")) {
        if (data.marker && data.marker.line && data.mode.includes("markers")) {
          data.marker.color = color;
          data.marker.line.color = color;
        }
        if (data.line && data.mode.includes("lines")) {
          data.line.color = color;
        }
      } else if (
        data.marker &&
        (data.mode == "bar" || data.type == "histogram")
      ) {
        data.marker.color = color;
      }
    });
  }

  /**
   * Update layout label.
   * @param records
   *
   * @remarks
   * It is a replacement for abstract component.
   */
  updateLayoutLabel(records?: NodeRecord[]): void {
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
