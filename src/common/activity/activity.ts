// activity.ts

import { ILogObj, Logger } from "tslog";
import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { download } from "@/utils/download";
import { logger as mainLogger } from "@/utils/logger";

import { ActivityChartGraph } from "@/graph/activityGraph/activityChartGraph";
import { NodeRecord } from "../node/nodeRecord";

import { Node } from "@/types/nodeTypes";
import { Project } from "@/types/projectTypes";

export interface ActivityProps {
  events?: EventProps;
  nodeIds?: number[];
  nodePositions?: number[][];
  recorderUnitId?: number;
}

interface activityState {
  activeNodeId: number | undefined;
  fromTime: number;
  hash: string;
  records: NodeRecord[];
  selected: number[];
}

export interface EventProps {
  [key: string]: number[];
}

export class Activity {
  private _events: EventProps = {};
  private _idx: number = 0; // generative
  private _logger: Logger<ILogObj>;
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
      hash: "",
      records: [],
      selected: activity.nodeIds?.slice(0, 10) || [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      ],
    });

    this._logger = mainLogger.getSubLogger({
      name: `[${this.recorder.modelId}] activity`,
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

  get events(): EventProps {
    return this._events;
  }

  set events(value: EventProps) {
    this._events = value;
  }

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
    return this._recorder.network.project.simulation.state.timeInfo.value;
  }

  /**
   * Clone activity.
   */
  clone(): Activity {
    return new Activity(this.recorder, this.toJSON());
  }

  /**
   * Check if activity has events.
   */
  get hasEvents(): boolean {
    return this.nEvents > 0;
  }

  /**
   * Export activity (node indices, positions and events).
   */
  export(): void {
    this._logger.trace("export activity");
    download(JSON.stringify(this.toJSON()), "activity");
  }

  /**
   * Export events to file in json format.
   */
  exportEvents(): void {
    this._logger.trace("export events");
    download(JSON.stringify(this._events), "events");
  }

  /**
   * Export events to file in csv format.
   */
  exportEventsCSV(): void {
    this._logger.trace("export events to csv");
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
   * get activity from insite.
   */
  getActivityInsite(): void {}

  /**
   * Initialize activity.
   *
   * Overwrites events.
   */
  init(activity: ActivityProps = {}): void {
    this._logger.trace("init");
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
    this._logger.trace("update");
    if (activity.events == undefined) return;

    this.updateEvents(activity.events);
    this.postUpdate(activity);
  }

  postUpdate(activity: ActivityProps): void {
    activity;
  }

  /**
   * Reset activity.
   */
  reset(): void {
    this._logger.trace("reset");
    this._events = {};
    this._nodeIds = [];
    this._nodePositions = [];
    this._state.records = [];
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

  /**
   * Update events.
   */
  updateEvents(events: { [key: string]: number[] }): void {
    this._logger.trace("update events");
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
    this._state.hash = sha1(this.toJSON()).slice(0, 6);
    this._logger.settings.name = `[${this.recorder.modelId}] activity #${this._state.hash}`;
  }
}
