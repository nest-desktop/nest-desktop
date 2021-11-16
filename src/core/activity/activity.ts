import { sha1 } from 'object-hash';

// import { Config } from '../config';
import { Node } from '../node/node';

export class Activity {
  private _events: any = {};
  private _hash: string;
  private _idx: number; // generative
  private _lastFrame: boolean = false;
  private _nodeCollectionId: number;
  private _nodeIds: number[] = [];
  private _nodePositions: number[][] = []; // if spatial
  private _recorder: Node; // parent
  private _records: String[] = [];

  constructor(recorder: Node, activity: any = {}) {
    this._recorder = recorder;
    this.init(activity);
  }

  get elementTypes(): string[] {
    return this._recorder.nodes.map((node: Node) => node.model.elementType);
  }

  get endtime(): number {
    return this._recorder.network.project.simulation.kernel.biologicalTime;
  }

  get lastTime(): number {
    return this._events.times && this._events.times.length > 0
      ? this.events.times[this.events.times.length - 1]
      : 0;
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

  get lastFrame(): boolean {
    return this._lastFrame;
  }

  set lastFrame(value: boolean) {
    this._lastFrame = value;
  }

  get nEvents(): number {
    return this._events.hasOwnProperty('times') ? this._events.times.length : 0;
  }

  get nodeCollectionId(): number {
    return this._nodeCollectionId;
  }

  set nodeCollectionId(value: number) {
    this._nodeCollectionId = value;
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

  get recorder(): Node {
    return this._recorder;
  }

  get records(): String[] {
    return this._records;
  }

  /**
   * Check if activity has events.
   */
  hasEvents(): boolean {
    return this.nEvents > 0;
  }

  /**
   * Reset activity.
   */
  reset(): void {
    this._events = {};
    this._lastFrame = false;
    this._nodeIds = [];
    this._nodePositions = [];
    this._records = [];
  }

  /**
   * Initialize activity.
   *
   * Overwrites events.
   */
  init(activity: any): void {
    // console.log('Initialize activity');
    this.reset();

    this.events = activity.events || { senders: [], times: [] };
    this.nodeIds = activity.nodeIds || [];
    this.nodePositions = activity.nodePositions || [];
    this.nodeCollectionId = activity.nodeCollectionId;

    this.updateRecords();
    this.updateHash();
  }

  /**
   * Update activity.
   *
   * Extends events.
   */
  update(activity: any): void {
    // console.log('Update activity');
    const events = activity.events;
    if (events === undefined) {
      return;
    }

    const eventKeys: string[] = Object.keys(events);
    eventKeys.forEach((eventKey: string) => {
      const currEvents: number[] = this._events[eventKey];
      const newEvents: number[] = events[eventKey];
      this._events[eventKey] = currEvents.concat(newEvents);
    });

    this.updateRecords();
    this.updateHash();
  }

  /**
   * Update record from event keys.
   */
  updateRecords(): void {
    this._records = Object.keys(this._events).filter(
      (event: string) => !['senders', 'times'].includes(event)
    );
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
   * Check if activity contains analog signal data.
   */
  hasAnalogData(): boolean {
    return ['voltmeter', 'multimeter'].includes(this._recorder.model.existing);
  }

  /**
   * Check if activity contains analog signal data from input devices.
   */
  hasInputAnalogData(): boolean {
    return this.hasAnalogData() && this.elementTypes.includes('stimulator');
  }

  /**
   * Check if activity contains analog signal data from neurons.
   */
  hasNeuronAnalogData(): boolean {
    return this.hasAnalogData() && this.elementTypes.includes('neuron');
  }

  /**
   * Check if activity contains spike data.
   */
  hasSpikeData(): boolean {
    return this._recorder.model.existing === 'spike_recorder';
  }

  /**
   * Export activity (node indices, positions and events).
   */
  export(): void {
    this._recorder.network.project.app.download(this, 'activity');
  }

  /**
   * Export events.
   */
  exportEvents(): void {
    this._recorder.network.project.app.download(this._events, 'events');
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
