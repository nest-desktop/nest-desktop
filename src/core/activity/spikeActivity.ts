import axios from 'axios';

import { Activity } from './activity';
import { Node } from '../node/node';

export class SpikeActivity extends Activity {
  private _times: any;

  constructor(recorder: Node, activity: any = {}) {
    super(recorder);
    this.init(activity);
  }

  /**
   * Initialize spike activity.
   *
   * Overwrites events.
   */
  override init(activity: any): void {
    // console.log('Init spike activity');
    this.initEvents(activity);
    this.initTimes();
  }

  /**
   * Init times for ISI or CV(ISI).
   */
  initTimes(): void {
    this._times = Object.create(null);
    this.nodeIds.forEach((id: number) => (this._times[id] = []));
    this.updateTimes(this.events);
  }

  /**
   * Update spike activity.
   *
   * Extends events.
   */
  override update(activity: any): void {
    // console.log('Update spike activity');
    if (activity.events == undefined) {
      return;
    }

    this.updateEvents(activity);
    this.updateTimes(activity.events);
  }

  /**
   * Update times for ISI or CV(ISI).
   */
  updateTimes(events: any): void {
    events.senders.forEach((sender: number, idx: number) => {
      this._times[sender].push(this.events.times[idx]);
    });
  }

  /**
   * Get ISI of all nodes.
   */
  ISI(): number[][] {
    return this.nodeIds.map((id: number) => this.getISI(this._times[id]));
  }

  /**
   * Get ISI of a node.
   */
  getISI(times: number[]): number[] {
    if (times.length <= 1) {
      return [0];
    }
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
    return (
      values
        .map((x: number) => Math.pow(x - avg, 2))
        .reduce((a: number, b: number) => a + b) / n
    );
  }

  /**
   * Get standard deviation of values.
   */
  getStandardDeviation(values: number[]): number {
    return Math.sqrt(this.getVariance(values));
  }

  /**
   * Clone spike activity.
   */
  override clone(): SpikeActivity {
    return new SpikeActivity(this.recorder, this.toJSON());
  }

  /**
   * Get activity from Insite.
   */
  override getActivityInsite(): void {
    // console.log('Get spike activity from Insite');

    const url = `http://localhost:8080/nest/spikedetectors/${this.nodeCollectionId}`;
    axios
      .get(url + `/spikes?fromTime=${this.lastTime}`)
      .then((response: any) => {
        this.update({
          events: {
            senders: response.data.nodeIds, // y
            times: response.data.simulationTimes, // x
          },
        });

        this.lastFrame = response.data.lastFrame;

        // Recursive call after 500ms.
        if (!response.data.lastFrame) {
          setTimeout(() => {
            this.getActivityInsite();
          }, 500);
        }
      });
  }
}
