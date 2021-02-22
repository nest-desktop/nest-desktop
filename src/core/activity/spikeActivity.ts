// import { Config } from '../config';
import { Activity } from './activity';
import { Node } from '../node/node';

export class SpikeActivity extends Activity {
  private _times: any;

  constructor(recorder: Node, activity: any = {}) {
    super(recorder, activity);
  }

  update(activity: any): void {
    this.events = activity.events || {};
    this.nodeIds = activity.nodeIds || [];
    this.nodePositions = activity.nodePositions || [];
    if (this.events.hasOwnProperty('senders')) {
      this.updateTimes();
    }
  }

  updateTimes(): void {
    this._times = Object.create(null);
    this.nodeIds.forEach((id: number) => (this._times[id] = []));
    this.events.senders.forEach((sender: number, idx: number) => {
      this._times[sender].push(this.events.times[idx]);
    });
  }

  // updateStats(): void {
  //   this._stats = this.nodeIds.map((id: number) => {
  //     const isi: number[] = this.getISI(this._times[id]);
  //     const isiMean: number = isi.length > 1 ? this.getAverage(isi) : 0;
  //     const isiStd: number =
  //       isi.length > 1 ? this.getStandardDeviation(isi) : 0;
  //     return {
  //       id,
  //       count: this._times[id].length,
  //       isi_mean: isiMean,
  //       isi_std: isiStd,
  //       cv_isi: isiMean > 0 ? isiStd / isiMean : 0,
  //     };
  //   });
  // }

  ISI(): number[][] {
    return this.nodeIds.map((id: number) => this.getISI(this._times[id]));
  }

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

  getAverage(values: number[]): number {
    const n: number = values.length;
    const sum: number = values.reduce((a: number, b: number) => a + b, 0);
    return sum / n || 0;
  }

  getVariance(values: number[]): number {
    const n: number = values.length;
    const avg: number = this.getAverage(values);
    return (
      values
        .map((x: number) => Math.pow(x - avg, 2))
        .reduce((a: number, b: number) => a + b) / n
    );
  }

  getStandardDeviation(values: number[]): number {
    return Math.sqrt(this.getVariance(values));
  }

  clone(): SpikeActivity {
    return new SpikeActivity(this.recorder, this.toJSON());
  }
}
