import { Activity } from './activity';
import { Node } from '../node/node';

export class SpikeActivity extends Activity {
  private _times: any;

  constructor(recorder: Node, activity: any = {}) {
    super(recorder);
    this.init(activity);
  }

  /**
   * Post-initialize spike activity.
   */
  override postInit(): void {
    this._times = Object.create(null);
    this.nodeIds.forEach((id: number) => (this._times[id] = []));
    this.updateTimes(this.events);
  }

  /**
   * Post-update spike activity.
   */
  override postUpdate(activity: any): void {
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
    if (!this.project.insite.state.on) {
      return;
    }

    const path = `nest/spikerecorders/${
      this.nodeCollectionId
    }/spikes/?fromTime=${this.lastTime + 0.1}`;
    this.project.app.backends.insiteAccess.instance
      .get(path)
      .then((response: any) => {
        this.update({
          events: {
            senders: response.data.nodeIds, // y
            times: response.data.simulationTimes, // x
          },
        });

        // Recursive call after 500ms.
        setTimeout(() => {
          this.getActivityInsite();
        }, 500);
      });
  }
}
