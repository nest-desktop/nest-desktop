// spikeActivity.ts

import { Activity, type IActivityState, type IEventState } from "./activity";

export class SpikeActivity extends Activity {
  private _times: number[][] = [];

  get times(): number[][] {
    return this._times;
  }

  /**
   * Call after load.
   */
  override afterLoad(): void {
    this._times = Object.create(null);
    if (this.nodeIds.length === 0) return;

    this.nodeIds.forEach((id: number) => (this.times[id] = []));
    this.updateTimes(this.events);
  }

  /**
   * Get ISI of a node.
   */
  getISI(times: number[]): number[] {
    if (times.length <= 1) return [0];

    times.sort((a: number, b: number) => a - b);
    const values: number[] = [];
    for (let ii = 0; ii < times.length - 1; ii++) {
      values.push(times[ii + 1] - times[ii]);
    }

    return values;
  }

  /**
   * Get average of values.
   */
  getAverage(values: number[]): number {
    const n: number = values.length;
    const sum: number = values.reduce((a: number, b: number) => a + b, 0);
    return sum / n || 0;
  }

  /**
   * Get variance of values.
   */
  getVariance(values: number[]): number {
    const n: number = values.length;
    const avg: number = this.getAverage(values);
    return values.map((x: number) => Math.pow(x - avg, 2)).reduce((a: number, b: number) => a + b) / n;
  }

  /**
   * Get standard deviation of values.
   */
  getStandardDeviation(values: number[]): number {
    return Math.sqrt(this.getVariance(values));
  }

  /**
   * Get ISI of all nodes.
   */
  ISI(): number[][] {
    return this.nodeIds.map((id: number) => this.getISI(this.times[id]));
  }

  /**
   * Post-update spike activity.
   */
  override postUpdate(activityState: IActivityState): void {
    if (activityState.events == undefined) return;

    this.updateTimes(activityState.events);
  }

  /**
   * Update times for ISI or CV(ISI).
   */
  updateTimes(eventState: IEventState = {}): void {
    if (
      eventState.senders == undefined ||
      eventState.times == undefined ||
      eventState.senders.length === 0 ||
      eventState.times.length === 0
    )
      return;

    eventState.senders.forEach((sender: number, idx: number) => this.times[sender].push(this.events.times[idx]));
  }
}
