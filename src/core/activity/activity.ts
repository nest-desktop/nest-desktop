import { reactive, UnwrapRef } from '@vue/composition-api';
import { sha1 } from 'object-hash';

import { ActivityChartGraph } from '../activity/activityChart/activityChartGraph';
import { Node } from '../node/node';
import { Project } from '../project/project';

export class Activity {
  private _events: any = {};
  private _hash: string;
  private _idx: number; // generative
  private _nodeIds: number[] = [];
  private _nodePositions: number[][] = []; // if spatial
  private _recorder: Node; // parent
  private _recorderUnitId: number;
  private _state: UnwrapRef<any>;

  constructor(recorder: Node, activity: any = {}) {
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
    return this._recorder.nodes.map((node: Node) => node.model.elementType);
  }

  get endtime(): number {
    return this._recorder.network.project.simulation.state.biologicalTime;
  }

  get events(): any {
    return this._events;
  }

  set events(value: any) {
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
    return this._events.hasOwnProperty('times') ? this._events.times.length : 0;
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

  get state(): UnwrapRef<any> {
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
  init(activity: any = {}): void {
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
  update(activity: any): void {
    if (activity.events == undefined) return;

    this.updateEvents(activity.events);
    this.postUpdate(activity);
  }

  postUpdate(activity: any): void {
    activity;
  }

  /**
   * Update events.
   */
  updateEvents(events: any): void {
    if (events == undefined) return;
    let updated = false;

    const eventKeys: string[] = Object.keys(events);
    if (eventKeys == undefined || eventKeys.length === 0) return;

    eventKeys.forEach((eventKey: string) => {
      const newEvents: number[] = events[eventKey];
      if (newEvents !== undefined || newEvents.length > 0) {
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
    this._hash = sha1(JSON.stringify(this._events));
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
      this.elementTypes.includes('stimulator')
    );
  }

  /**
   * Check if activity contains analog signal data from neurons.
   */
  get hasNeuronAnalogData(): boolean {
    return (
      this._recorder.model.isAnalogRecorder &&
      this.elementTypes.includes('neuron')
    );
  }

  /**
   * Export activity (node indices, positions and events).
   */
  export(): void {
    this._recorder.network.project.app.download(
      JSON.stringify(this.toJSON()),
      'activity'
    );
  }

  /**
   * Export events to file in json format.
   */
  exportEvents(): void {
    this._recorder.network.project.app.download(
      JSON.stringify(this._events),
      'events'
    );
  }

  /**
   * Export events to file in csv format.
   */
  exportEventsCSV(): void {
    const eventKeys = ['senders', 'times'];
    Object.keys(this._events).forEach((eventKey: string) => {
      if (!eventKeys.includes(eventKey)) eventKeys.push(eventKey);
    });
    let csv = eventKeys.join(',') + '\n';
    csv += this._events.times
      .map((_: any, idx: number) =>
        eventKeys.map(key => this._events[key][idx]).join(',')
      )
      .join('\n');
    this._recorder.network.project.app.download(csv, 'events', 'csv');
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
  toJSON(): any {
    return {
      events: this._events,
      nodeIds: this._nodeIds,
      nodePositions: this._nodePositions,
    };
  }
}
