// activity.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { download } from "@/helpers/download";

import { ActivityChartGraph } from "../activity/activityChart/activityChartGraph";
import { Node } from "../node/node";
import { Project } from "../project/project";

export interface EventProps {
  [key: string]: number[]
}

export interface ActivityProps {
  events?: eventProps;
  nodeIds?: number[];
  nodePositions?: number[][];
  recorderUnitId?: number;
}

interface activityState {
  activeNodeId: number | undefined;
  fromTime: number;
  records: number[];
}

export class Activity {
  private _events: eventProps = {};
  private _hash: string = "";
  private _idx: number = 0; // generative
  private _nodeIds: number[] = [];
  private _nodePositions: number[][] = []; // if spatial
  private _recorder: Node; // parent
  private _recorderUnitId: number = -1;
  private _state: UnwrapRef<activityState>;

  constructor(recorder: Node, activity: ActivityProps = {}) {
    this._recorder = recorder;
    this._state = reactive({
      activeNodeId: undefined,
      fromTime: 0,
      records: [],
    });
    this.init(activity);
  }

  get chartGraph(): ActivityChartGraph {
    return this.project.activityGraph.activityChartGraph;
  }

  get currenttime(): number {
    const simulationState = this._recorder.network.project.simulation.state;
    return simulationState.timeInfo.current > 0
      ? simulationState.timeInfo.current
      : simulationState.biologicalTime;
  }

  get elementTypes(): string[] {
    return this._recorder.nodes.all.map((node: Node) => node.model.elementType);
  }

  get endtime(): number {
    return this._recorder.network.project.simulation.state.biologicalTime;
  }

  get events(): eventProps {
    return this._events;
  }

  set events(value: eventProps) {
    this._events = value;
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

  get lastTime(): number {
    return this._events.times && this._events.times.length > 0
      ? this.events.times[this.events.times.length - 1]
      : 0;
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

  get project(): Project {
    return this.recorder.network.project;
  }

  get recorder(): Node {
    return this._recorder;
  }

  get recorderUnitId(): number {
    return this._recorderUnitId;
  }

  set recorderUnitId(value: number) {
    this._recorderUnitId = value;
  }

  get state(): UnwrapRef<activityState> {
    return this._state;
  }

  get simulationTimeInfo(): number {
    return this._recorder.network.project.simulation.state.timeInfo;
  }

  /**
   * Check if activity has events.
   */
  get hasEvents(): boolean {
    return this.nEvents > 0;
  }

  /**
   * Reset activity.
   */
  reset(): void {
    this._events = {};
    this._nodeIds = [];
    this._nodePositions = [];
    this._state.records = [];
  }

  /**
   * Initialize activity.
   *
   * Overwrites events.
   */
  init(activity: activityProps = {}): void {
    this.reset();
    this.events = activity.events || { senders: [], times: [] };
    this.nodeIds = activity.nodeIds || [];
    this.nodePositions = activity.nodePositions || [];
    this.recorderUnitId = activity.recorderUnitId || -1;
    this.updateHash();
    this.postInit();
  }

  postInit(): void {}

  /**
   * Update activity.
   *
   * Extends events.
   */
  update(activity: ActivityProps): void {
    if (activity.events == undefined) return;

    this.updateEvents(activity.events);
    this.postUpdate(activity);
  }

  postUpdate(activity: ActivityProps): void {
    activity;
  }

  /**
   * Update events.
   */
  updateEvents(events: { [key: string]: number[] }): void {
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

    if (updated) {
      this.updateHash();
    }
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    // this._hash = sha1(JSON.stringify(this._events));
    this._hash = sha1({ sendersLength: this._events.senders.length });
  }

  /**
   * get activity from insite.
   */
  getActivityInsite(): void {}

  /**
   * Check if activity contains analog signal data from input devices.
   */
  get hasInputAnalogData(): boolean {
    return (
      this._recorder.model.isAnalogRecorder &&
      this.elementTypes.includes("stimulator")
    );
  }

  /**
   * Check if activity contains analog signal data from neurons.
   */
  get hasNeuronAnalogData(): boolean {
    return (
      this._recorder.model.isAnalogRecorder &&
      this.elementTypes.includes("neuron")
    );
  }

  /**
   * Export activity (node indices, positions and events).
   */
  export(): void {
    download(JSON.stringify(this.toJSON()), "activity");
  }

  /**
   * Export events to file in json format.
   */
  exportEvents(): void {
    download(JSON.stringify(this._events), "events");
  }

  /**
   * Export events to file in csv format.
   */
  exportEventsCSV(): void {
    const eventKeys = ["senders", "times"];
    Object.keys(this._events).forEach((eventKey: string) => {
      if (!eventKeys.includes(eventKey)) eventKeys.push(eventKey);
    });
    let csv = eventKeys.join(",") + "\n";
    csv += this._events.times
      .map((_: number, idx: number) =>
        eventKeys.map((key) => this._events[key][idx]).join(",")
      )
      .join("\n");
    download(csv, "events", "csv");
  }

  /**
   * Clone activity.
   */
  clone(): Activity {
    return new Activity(this.recorder, this.toJSON());
  }

  /**
   * Serialize for JSON.
   * @return activity object
   */
  toJSON(): ActivityProps {
    return {
      events: this._events,
      nodeIds: this._nodeIds,
      nodePositions: this._nodePositions,
    };
  }
}
