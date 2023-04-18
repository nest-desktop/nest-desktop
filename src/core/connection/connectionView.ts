import { Connection } from './connection';

export class ConnectionView {
  private _colorExcitation = '#595289'; // '#467ab3';
  private _colorInhibition = '#AF143C'; // '#b34846';
  private _connection: Connection; // parent
  private _visible: boolean = true;

  constructor(connection: Connection) {
    this._connection = connection;
  }

  get position(): any {
    const p0 = this._connection.source.view.position;
    const p1 = this._connection.target.view.position;
    return { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
  }

  get targetPosition(): any {
    const source = this._connection.source.view.position;
    const target = this._connection.target.view.position;

    const r: number = 18;
    const tr: number = r + 12;

    const x1: number = source.x;
    let y1: number = source.y;
    const x2: number = target.x;
    const y2: number = target.y;

    const dx: number = x2 - x1;
    const dy: number = y2 - y1;
    const a: number = Math.atan2(dy, dx);
    const mx2 = dx === 0 && dy === 0 ? x2 + 1 : x2 - Math.cos(a) * tr;
    const my2 = dx === 0 && dy === 0 ? y2 - r - 4 : y2 - Math.sin(a) * tr;
    return { x: mx2, y: my2 };
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  /**
   * Get connection color based on synapse weight.
   */
  get colorWeight(): string {
    const value: number = this._connection.synapse.weight;
    if (value === 0) {
      return 'black';
    }
    return value > 0 ? this._colorExcitation : this._colorInhibition;
  }

  /**
   * Calculate the distance of connected nodes.
   */
  distance(): number {
    if (this._connection.source === this._connection.target) {
      return 0;
    }
    const source: any = this._connection.source.view.position;
    const target: any = this._connection.target.view.position;
    const x1: number = source.x;
    const y1: number = source.y;
    const x2: number = target.x;
    const y2: number = target.y;
    const dx: number = x2 - x1;
    const dy: number = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check if the connection is probabilistic.
   */
  probabilistic(): boolean {
    return !['all_to_all', 'one_to_one'].includes(this._connection.rule.value);
  }

  /**
   * Generates a string describing the end of this connections' marker.
   */
  markerEnd(): string {
    if (this._connection.synapse.weight > 0 && !this.connectRecorder()) {
      return 'url(#exc' + this._connection.idx + ')';
    } else if (this._connection.synapse.weight < 0 && !this.connectRecorder()) {
      return 'url(#inh' + this._connection.idx + ')';
    } else {
      return 'url(#generic' + this._connection.idx + ')';
    }
  }

  /**
   * Check if it is connected to any recorder.
   */
  connectRecorder(): boolean {
    return (
      this._connection.source.model.isRecorder ||
      this._connection.target.model.isRecorder
    );
  }

  /**
   * Check if it is connected by neurons only.
   */
  connectOnlyNeurons(): boolean {
    return (
      this._connection.source.model.isNeuron &&
      this._connection.target.model.isNeuron
    );
  }

  /**
   * Check if it is connected to spike recorder.
   */
  connectSpikeRecorder(): boolean {
    return this._connection.target.model.isSpikeRecorder;
  }
}
