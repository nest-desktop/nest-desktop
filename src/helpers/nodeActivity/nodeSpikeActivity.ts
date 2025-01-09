// recorderSpikeActivity.ts

import { TNode } from "@/types";

import { IActivityProps, IEventProps } from "../activity/activity";
import { NodeActivity } from "./nodeActivity";

export class NodeSpikeActivity extends NodeActivity {
  private _times: number[][] = [];

  constructor(recorder: TNode, activityProps: IActivityProps = {}) {
    super(recorder, activityProps);
  }

  /**
   * Clone spike activity.
   */
  override clone(): NodeSpikeActivity {
    return new NodeSpikeActivity(this.recorder, this.toJSON());
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
    return this.nodeIds.map((id: number) => this.getISI(this._times[id]));
  }

  /**
   * Post-initialize spike activity.
   */
  override postInit(): void {
    this._times = Object.create(null);
    if (this.nodeIds.length === 0) return;

    this.nodeIds.forEach((id: number) => (this._times[id] = []));
    this.updateTimes(this.events);
  }

  /**
   * Post-update spike activity.
   */
  override postUpdate(activityProps: IActivityProps): void {
    if (activityProps.events == undefined) return;

    this.updateTimes(activityProps.events);
  }

  /**
   * Update times for ISI or CV(ISI).
   */
  updateTimes(eventProps: IEventProps = {}): void {
    if (
      eventProps.senders == undefined ||
      eventProps.times == undefined ||
      eventProps.senders.length === 0 ||
      eventProps.times.length === 0
    )
      return;

    eventProps.senders.forEach((sender: number, idx: number) => this._times[sender].push(this.events.times[idx]));
  }
}
