// activity.ts

import { UnwrapRef, reactive } from "vue";

import { TProject } from "@/types";

import { ActivityChartGraph } from "../activityGraph/activityChartGraph/activityChartGraph";
import { BaseObj } from "../common/base";
import { download } from "../../utils/download";

export interface IActivityProps {
  events?: IEventProps;
  nodeIds?: number[];
  nodePositions?: number[][];
  recorderUnitId?: number;
}

interface IActivityState {
  activeNodeId: number | undefined;
  fromTime: number;
  selected: number[];
}

export interface IEventProps {
  [key: string]: number[];
}

export class Activity extends BaseObj {
  private _events: IEventProps = {};
  private _idx: number = 0; // generative
  private _nodeIds: number[] = [];
  private _nodePositions: number[][] = []; // if spatial
  private _project: TProject;
  private _recorderUnitId: number = -1;
  private _state: UnwrapRef<IActivityState>;

  constructor(project: TProject, activityProps: IActivityProps = {}) {
    super({
      config: { name: "Activity" },
      logger: { settings: { minLevel: 3 } },
    });

    this._project = project;
    this._state = reactive<IActivityState>({
      activeNodeId: undefined,
      fromTime: 0,
      // records: [] as NodeRecord[],
      selected: [],
    });

    this.init(activityProps);
  }

  get chartGraph(): ActivityChartGraph {
    return this.project.activityGraph.activityChartGraph;
  }

  get colors(): string[] {
    return this.config?.localStorage.color.cycle;
  }

  get events(): IEventProps {
    return this._events;
  }

  set events(value: IEventProps) {
    this._events = value;
  }

  /**
   * Check if activity has events.
   */
  get hasEvents(): boolean {
    return this.nEvents > 0;
  }

  get idx(): number {
    return this._idx;
  }

  set idx(value: number) {
    this._idx = value;
  }

  get isAnalogSignalActivity(): boolean {
    return this.constructor.name.includes("AnalogSignalActivity");
  }

  get isSpikeActivity(): boolean {
    return this.constructor.name.includes("SpikeActivity");
  }

  get lastTime(): number {
    return this._events.times && this._events.times.length > 0 ? this.events.times[this.events.times.length - 1] : 0;
  }

  get nEvents(): number {
    return "times" in this._events ? this._events.times.length : 0;
  }

  get nodeIds(): number[] {
    return this._nodeIds;
  }

  set nodeIds(value: number[]) {
    this._nodeIds = value;
  }

  get nodePositions(): number[][] {
    return this._nodePositions;
  }

  set nodePositions(value: number[][]) {
    this._nodePositions = value;
  }

  get nodeSize(): number {
    return this.nodeIds.length;
  }

  get project(): TProject {
    return this._project;
  }

  get recorderUnitId(): number {
    return this._recorderUnitId;
  }

  set recorderUnitId(value: number) {
    this._recorderUnitId = value;
  }

  get state(): UnwrapRef<IActivityState> {
    return this._state;
  }

  get traceColor(): string {
    return this.colors[this._idx];
  }

  get traceLabel(): string {
    return "tr";
  }

  changes(): void {
    this.logger.trace("changes");

    this.project.changes();
  }

  /**
   * Clone activity.
   */
  clone(): Activity {
    return new Activity(this._project, this.toJSON());
  }

  /**
   * Export activity (node indices, positions and events).
   */
  export(): void {
    this.logger.trace("export activity");

    download(JSON.stringify(this.toJSON()), "activity");
  }

  /**
   * Export events to file in json format.
   */
  exportEvents(): void {
    this.logger.trace("export events");

    download(JSON.stringify(this._events), "events");
  }

  /**
   * Export events to file in csv format.
   */
  exportEventsCSV(): void {
    this.logger.trace("export events to csv");

    const eventKeys = ["senders", "times"];
    Object.keys(this._events).forEach((eventKey: string) => {
      if (!eventKeys.includes(eventKey)) eventKeys.push(eventKey);
    });
    let csv = eventKeys.join(",") + "\n";
    csv += this._events.times
      .map((_: number, idx: number) => eventKeys.map((key) => this._events[key][idx]).join(","))
      .join("\n");
    download(csv, "events", "csv");
  }

  /**
   * get activity from Insite.
   */
  // getActivityInsite(): void {}

  /**
   * Initialize activity.
   * @param activityProps activity props
   * @remarks Overwrites events.
   */
  init(activityProps: IActivityProps = {}): void {
    this.logger.trace("init");

    this.reset();
    this.events = activityProps.events || { senders: [], times: [] };
    this.nodeIds = activityProps.nodeIds || [];
    this._state.selected = this.nodeIds.slice(0, 11);

    this.nodePositions = activityProps.nodePositions || [];
    this.recorderUnitId = activityProps.recorderUnitId || -1;
    this.updateHash();
    this.postInit();
  }

  /**
   * Call after init call.
   */
  postInit(): void {}

  /**
   * Call after update call.
   * @param _activityProps activity props
   */
  postUpdate(activityProps: IActivityProps): void {
    this.logger.trace("Postupdate: ", activityProps);
  }

  /**
   * Reset activity.
   */
  reset(): void {
    this.logger.trace("reset");

    this._events = {};
    this._nodeIds = [];
    this._nodePositions = [];
    // this._state.records = [];
  }

  /**
   * Serialize for JSON.
   * @return activity object
   */
  toJSON(): IActivityProps {
    return {
      events: this._events,
      nodeIds: this._nodeIds,
      nodePositions: this._nodePositions,
    };
  }

  /**
   * Update activity.
   * @param activityProps activity props
   * @remarks Extends events.
   */
  update(activityProps: IActivityProps): void {
    this.logger.trace("update");

    if (activityProps.events == undefined) return;

    this.updateEvents(activityProps.events);
    this.postUpdate(activityProps);
  }

  /**
   * Update events.
   */
  updateEvents(events: Record<string, number[]>): void {
    this.logger.trace("update events");

    if (events == undefined) return;
    let updated = false;

    const eventKeys: string[] = Object.keys(events);
    if (eventKeys == undefined || eventKeys.length === 0) return;

    eventKeys.forEach((eventKey: string) => {
      const newEvents: number[] = events[eventKey];
      if (newEvents) {
        this._events[eventKey] = this._events[eventKey].concat(newEvents);
        updated = true;
      }
    });

    if (updated) this.updateHash();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash(this.toJSON());
  }
}
