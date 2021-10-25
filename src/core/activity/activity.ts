import { sha1 } from 'object-hash';

// import { Config } from '../config';
import { Node } from '../node/node';

export class Activity {
  private _events: any = {};
  private _idx: number; // generative
  private _nodeIds: number[] = [];
  private _nodePositions: number[][] = []; // if spatial
  private _recorder: Node; // parent
  private _records: String[] = [];
  private _hash: string;

  constructor(recorder: Node, activity: any = {}) {
    this._recorder = recorder;
    this.update(activity);
  }

  get elementTypes(): string[] {
    return this._recorder.nodes.map((node: Node) => node.model.elementType);
  }

  get endtime(): number {
    return this._recorder.network.project.simulation.kernel.biologicalTime;
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

  get recorder(): Node {
    return this._recorder;
  }

  get records(): String[] {
    return this._records;
  }

  get senders(): number[] {
    const senders: any[] = [...new Set(this._events.senders)];
    if (senders.length > 0) {
      senders.sort((a: number, b: number) => a - b);
    }
    return senders;
  }

  /**
   * Check if activity has events.
   */
  hasEvents(): boolean {
    return this.nEvents > 0;
  }

  /**
   * Initialize activity.
   */
  init(activity: any): void {
    this._events = activity.events || {};
    this._records = Object.keys(this._events).filter(
      (event: string) => !['senders', 'times'].includes(event)
    );
    this._nodeIds = activity.nodeIds || [];
    this._nodePositions = activity.nodePositions || [];
    this._hash = sha1(JSON.stringify(this._events));
  }

  /**
   * Update activity.
   */
  update(activity: any): void {
    const events = activity.events;
    if (events === undefined) {
      return;
    }
    Object.keys(events).forEach((eventKey: string) => {
      const event: number[] = this._events[eventKey];
      this._events[eventKey] = event.concat(events[eventKey]);
    });
    this._hash = sha1(JSON.stringify(this._events));
  }

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
