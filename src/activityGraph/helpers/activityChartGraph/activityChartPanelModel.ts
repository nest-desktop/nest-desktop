// activityChartPanelModel.ts

import { type UnwrapRef, reactive } from "vue";

import type { IParamState, TParamValue } from "@/helpers/common/parameter";
import type { NodeRecord } from "@/networkGraph/helpers/node/nodeRecord";
import type { TNode } from "@/types";
import { BaseObj, type IBaseState } from "@/helpers/common/base";
import { currentBackgroundColor } from "@/helpers/common/theme";

import type { Activity } from "@/helpers/activity/activity";
import type { NodeActivity } from "@/helpers/nodeActivity/nodeActivity";
import type { NodeAnalogSignalActivity } from "@/helpers/nodeActivity/nodeAnalogSignalActivity";

import type { ActivityChartPanel } from "./activityChartPanel";
import { ActivityChartPanelModelParameter } from "./activityChartPanelModelParameter";

export interface IActivityChartPanelModelData {
  activityIdx?: number;
  class?: string;
  color?: string;
  dataIdx?: number;
  histfunc?: string;
  hoverinfo?: string;
  legendgroup?: string;
  line?: {
    color?: string;
    dash?: string;
    shape?: string;
    width?: number;
  };
  marker?: {
    color: string;
    line?: {
      color?: string;
      width?: number;
    };
    size?: number;
    symbol?: string;
  };
  mode?: string;
  modelId?: string;
  name?: string;
  nodeId?: number;
  opacity?: number;
  panelIdx?: number;
  recordId?: string;
  showlegend?: boolean;
  source?: string;
  type?: string;
  visible?: boolean;
  x?: number[];
  xaxis?: string;
  xbins?: {
    end: number;
    size: number;
    start: number;
  };
  y?: number[];
  yaxis?: string;
}

export interface IActivityChartPanelModelState extends IBaseState {
  id?: string;
  markerSize?: number;
  params?: Record<string, TParamValue>;
  records?: string[];
}

interface IActivityChartPanelModelRefState {
  height: number;
  histogram: {
    end: number;
    start: number;
  };
  paramsVisible: string[];
  records: NodeRecord[];
  recordsVisible: string[];
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
  private _params: Record<string, ActivityChartPanelModelParameter> = {};
  private _state: UnwrapRef<IActivityChartPanelModelRefState>;

  constructor(panel: ActivityChartPanel, modelState: IActivityChartPanelModelState = {}) {
    super();
    this.props.value = modelState;

    this._id = "activityChart";
    this._panel = panel;
    this._state = reactive<IActivityChartPanelModelRefState>({
      height: 1,
      histogram: {
        end: -1e100,
        start: 1e100,
      },
      paramsVisible: [],
      records: [] as NodeRecord[],
      recordsVisible: [],
      time: {
        end: 0,
        start: 0,
      },
      visible: true,
      visibleThreshold: "legendonly",
      xaxisType: "linear",
    });

    if (this._panel.graph.state.initialized) this.init();
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

  get filteredParams(): ActivityChartPanelModelParameter[] {
    return this._state.paramsVisible.map((paramId) => this._params[paramId]);
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

  get params(): Record<string, ActivityChartPanelModelParameter> {
    return this._params;
  }

  get paramsAll(): ActivityChartPanelModelParameter[] {
    return Object.values(this._params);
  }

  get paramsVisible(): string[] {
    return this._state.paramsVisible;
  }

  set paramsVisible(value: string[]) {
    this._state.paramsVisible = value;
    this.changes();
  }

  get records(): NodeRecord[] {
    return this._state.records as NodeRecord[];
  }

  get recordsVisible(): NodeRecord[] {
    return this.records.filter((record: NodeRecord) => this._state.recordsVisible.includes(record.groupId));
  }

  get state(): UnwrapRef<IActivityChartPanelModelRefState> {
    return this._state;
  }

  /**
   * Add data of this activity graph panel.
   * @param _activity activity instance
   *
   * @remarks
   * It requires activity data.
   * It is a replacement for abstract component.
   */
  addData(activity: Activity): void {
    this.logger.trace("Add data:", activity);
  }

  addParameter(paramState: IParamState) {
    this._params[paramState.id] = new ActivityChartPanelModelParameter(this, paramState);
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
   * Observer for activity chart panel model changes.
   * @remarks It emits activity chart graph changes.
   */
  changes(): void {
    this.update();
    this._panel.graph.changes();
  }

  /**
   * Empty activity panel model.
   */
  empty(): void {
    this.data = [];
    this.panel.layout.shapes = [];
  }

  /**
   * Get activity from the project.
   * @param idx index of activity
   * @returns activity instance
   */
  getActivity(idx: number): Activity {
    return this._panel.graph.project.activities.all[idx];
  }

  /**
   * Get node record.
   * @param groupId string
   * @returns node record instance
   */
  getNodeRecord(groupId: string): NodeRecord | undefined {
    return this.records.find((nodeRecord: NodeRecord) => nodeRecord.groupId === groupId);
  }

  /**
   * Initialize panel model.
   *
   * @remarks
   * This method will be overwritten in child classes.
   */
  abstract init(): void;

  /**
   * Initialize params for controller.
   * @param paramStates parameter states
   */
  initParams(paramStates: IParamState[]): void {
    paramStates.forEach((paramState: IParamState) => {
      this.addParameter(paramState);
      if (paramState.visible != false) this.params[paramState.id].visible = true;
    });
  }

  /**
   * Save panel models of activity chart to state.
   * @return activity chart panel model state
   */
  override save(): IActivityChartPanelModelState {
    const modelState: IActivityChartPanelModelState = {
      id: this._id,
    };

    if (this.paramsAll.length > 0) {
      const params: Record<string, TParamValue> = {};
      this.paramsAll.forEach((param: ActivityChartPanelModelParameter) => {
        params[param.id] = param.value;
      });
      modelState.params = params;
    }

    if (0 < this._state.recordsVisible.length && this._state.recordsVisible.length < this.state.records.length)
      modelState.records = this._state.recordsVisible;

    return modelState;
  }

  /**
   * Update panel model.
   * @remarks It requires activity data.
   */
  update(): void {
    this.logger.trace("update");

    this.empty();

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
   * @param _record node record instance
   */
  updateActiveMarker(record?: NodeRecord): void {
    this.logger.trace("update activity marker:", record);
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
    this._state.records = this.records.filter((panelRecord: NodeRecord) =>
      panelRecord.node.records.some((record: NodeRecord) => record.id === panelRecord.id),
    ) as NodeRecord[];

    // Add new records from current recorder.
    this._activities
      .filter((activity: NodeActivity) => "recorder" in activity && activity.recorder.model.isAnalogRecorder)
      .forEach((activity: NodeAnalogSignalActivity) => {
        if (activity.recorder.records != null) {
          activity.recorder.records.forEach((record: NodeRecord) => {
            if (!this.records.includes(record)) this.records.push(record);
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
    this.activities.forEach((activity: Activity) => this.addData(activity));
  }

  /**
   * Update background color.
   */
  updateBackgroundColor(): void {
    this._data.forEach((data: IActivityChartPanelModelData) => {
      if (data.marker && data.marker.line && data.type === "histogram")
        data.marker.line.color = currentBackgroundColor();
    });
  }

  /**
   * Update params for controller.
   * @param paramStates parameter states
   */
  updateParams(paramStates: Record<string, TParamValue> = {}): void {
    this.paramsAll.forEach((param: ActivityChartPanelModelParameter) => {
      if (param.id in paramStates) param.state.value = paramStates[param.id];
    });
  }

  /**
   * Update color of records.
   */
  updateRecordsColor(): void {
    this._data.forEach((data: IActivityChartPanelModelData) => {
      if (data.class === "background") return;
      const activity = this.activities[data.activityIdx];

      let color: string;
      if (activity && "recorder" in activity) {
        const recorder = activity.recorder as TNode;
        if (recorder.model.isSpikeRecorder) color = recorder.view.color;
      } else {
        const record = this.recordsVisible.find(
          (record: NodeRecord) => record.id === data.recordId && record.activity.idx === data.activityIdx,
        );
        if (!record) return;

        if (record.color instanceof Array) {
          const nodeIds = record.activity.nodeIds;
          const idx = nodeIds.indexOf(data.nodeId as number);
          color = record.color[idx];
        } else {
          color = record.color;
        }
      }

      if (data.type.includes("scatter")) {
        if (data.marker && data.marker.line && data.mode.includes("markers")) {
          data.marker.color = color;
          data.marker.line.color = color;
        }
        if (data.line && data.mode.includes("lines")) {
          data.line.color = color;
        }
      } else if (data.marker && (data.mode == "bar" || data.type == "histogram")) {
        data.marker.color = color;
      }
    });
  }

  /**
   * Update layout label.
   * @remarks It is a replacement for abstract component.
   */
  updateLayoutLabel(): void {
    this.logger.trace("Update layout label");
  }

  /**
   * Update time of the panel model.
   * @remarks It needs activity data.
   */
  updateTime(): void {
    this._state.time.start = 0;
    this._state.time.end = Math.max(this._state.time.end, this._panel.graph.currentTime + 1);
  }
}
