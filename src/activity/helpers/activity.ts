// activity.ts

import { type UnwrapRef, reactive } from "vue";

// TODO: Mo imports from activity graph!
import type { ActivityChartGraph } from "@/activityGraph";
import type { TProject } from "@/types";
import { download } from "@/utils";

import { BaseObj, type IBaseState } from "../../core";

export interface IActivityState extends IBaseState {
  events?: IEventState;
  nodeIds?: number[];
  nodePositions?: number[][];
  recorderUnitId?: number;
}

interface IActivityRefState {
  activeNodeId: number | undefined;
  fromTime: number;
  selected: number[];
}

export interface IEventState {
  [key: string]: number[];
}

export class Activity extends BaseObj<IActivityState> {
  private _events: IEventState = {};
  private _idx: number = 0; // generative
  private _nodeIds: number[] = [];
  private _nodePositions: number[][] = []; // if spatial
  private _project: TProject;
  private _recorderUnitId: number = -1;
  private _state: UnwrapRef<IActivityRefState>;

  constructor(project: TProject, activityState: IActivityState = {}) {
    super({
      config: { name: "Activity" },
    });

    this._project = project;
    this._state = reactive<IActivityRefState>({
      activeNodeId: undefined,
      fromTime: 0,
      // records: [] as NodeRecord[],
      selected: [],
    });

    this.init(activityState);
  }

  get chartGraph(): ActivityChartGraph {
    return this.project.activityGraph.activityChartGraph;
  }

  get colors(): string[] {
    return this.config?.localStorage.color.cycle;
  }

  get events(): IEventState {
    return this._events;
  }

  set events(value: IEventState) {
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

  get state(): UnwrapRef<IActivityRefState> {
    return this._state;
  }

  get traceColor(): string {
    return this.colors[this._idx] ?? "";
  }

  get traceLabel(): string {
    return "tr";
  }

  changes(): void {
    this.logger.trace("changes");

    this.project.changes();
  }

  /**
   * Export activity (node indices, positions and events).
   */
  export(): void {
    this.logger.trace("export activity");

    download(JSON.stringify(this.save()), "activity");
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
    if (this._events.times) {
      csv += this._events.times
        .map((_: number, idx: number) => eventKeys.map((key) => this._events[key][idx]).join(","))
        .join("\n");
    }
    download(csv, "events", "csv");
  }

  /**
   * get activity from Insite.
   */
  // getActivityInsite(): void {}

  /**
   * Initialize activity.
   * @param activityState activity state
   * @remarks Overwrites events.
   */
  init(activityState: IActivityState = {}): void {
    this.logger.trace("init");

    this.reset();
    this.events = activityState.events || { senders: [], times: [] };
    this.nodeIds = activityState.nodeIds || [];
    this._state.selected = this.nodeIds.slice(0, 11);

    this.nodePositions = activityState.nodePositions || [];
    this.recorderUnitId = activityState.recorderUnitId || -1;
    this.updateHash();
    this.postInit();
  }

  /**
   * Call after init call.
   */
  postInit(): void {}

  /**
   * Call after update call.
   * @param activityState activity state
   */
  postUpdate(activityState: IActivityState): void {
    this.logger.trace("Postupdate: ", activityState);
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
   * Save activity to state.
   * @return activity state
   */
  override save(): IActivityState {
    return {
      events: this._events,
      nodeIds: this._nodeIds,
      nodePositions: this._nodePositions,
    };
  }

  /**
   * Update activity.
   * @param activityState activity state
   * @remarks Extends events.
   */
  update(activityState: IActivityState): void {
    this.logger.trace("update");

    if (activityState.events == undefined) return;

    this.updateEvents(activityState.events);
    this.postUpdate(activityState);
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
      const newEvents = events[eventKey] as number[];
      if (newEvents && this._events[eventKey]) {
        this._events[eventKey] = this._events[eventKey].concat(newEvents);
        updated = true;
      }
    });

    if (updated) this.updateHash();
  }
}
