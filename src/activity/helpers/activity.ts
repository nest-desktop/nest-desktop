// activity.ts

import { type UnwrapRef, reactive } from "vue";
import objectHash from "object-hash";

// TODO: No imports from activity graph!
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
  private _hash: string = "";
  private _idx: number = 0; // generative
  private _nodeIds: number[] = [];
  private _nodePositions: number[][] = []; // if spatial
  private _project: TProject;
  private _recorderUnitId: number = -1;
  private _state: UnwrapRef<IActivityRefState>;

  constructor(project: TProject) {
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

  get hash(): string {
    return this._hash;
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
    return this.events.times && this.events.times.length > 0 ? this.events.times[this.events.times.length - 1] : 0;
  }

  get nEvents(): number {
    return "times" in this.events ? this.events.times.length : 0;
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
    return this.colors[this.idx] ?? "";
  }

  get traceLabel(): string {
    return "tr";
  }

  /**
   * Call after load.
   */
  afterLoad(): void {}

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

    download(JSON.stringify(this.events), "events");
  }

  /**
   * Export events to file in csv format.
   */
  exportEventsCSV(): void {
    this.logger.trace("export events to csv");

    const eventKeys = ["senders", "times"];
    Object.keys(this.events).forEach((eventKey: string) => {
      if (!eventKeys.includes(eventKey)) eventKeys.push(eventKey);
    });
    let csv = eventKeys.join(",") + "\n";
    if (this.events.times) {
      csv += this.events.times
        .map((_: number, idx: number) => eventKeys.map((key) => this.events[key][idx]).join(","))
        .join("\n");
    }
    download(csv, "events", "csv");
  }

  /**
   * get activity from Insite.
   */
  // getActivityInsite(): void {}

  /**
   * Load activity.
   * @param activityState activity state
   * @remarks Overwrites events.
   */
  load(activityState: IActivityState = {}): void {
    this.logger.trace("load");

    this.reset();
    this.events = activityState.events || { senders: [], times: [] };
    this.nodeIds = activityState.nodeIds || [];
    this.state.selected = this.nodeIds.slice(0, 11);

    this.nodePositions = activityState.nodePositions || [];
    this.recorderUnitId = activityState.recorderUnitId || -1;
    this.updateHash();
    this.afterLoad();
  }

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
    this.updateHash();
  }

  /**
   * Save activity to state.
   * @return activity state
   */
  override save(): IActivityState {
    return {
      events: this.events,
      nodeIds: this.nodeIds,
      nodePositions: this.nodePositions,
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
      if (newEvents && this.events[eventKey]) {
        this.events[eventKey] = this.events[eventKey].concat(newEvents);
        updated = true;
      }
    });

    if (updated) this.updateHash();
  }

  updateHash(): void {
    this.logger.trace("update hash");
    this._hash = objectHash(this.save());
  }
}
