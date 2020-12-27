import { Connection } from './connection';
import { drawPath } from './connectionGraph';


export class ConnectionView {
  private _colorExcitation = '#595289'; // '#467ab3';
  private _colorInhibition = '#AF143C'; // '#b34846';
  private _connection: Connection;                         // parent

  constructor(connection: Connection) {
    this._connection = connection;
  }

  get backgroundImage(): string {
    const bg = 'white'; // '#fafafa';
    const srcColor: string = this._connection.source.view.color;
    const tgtColor: string = this._connection.target.view.color;
    const gradient: string = ['120deg', srcColor, srcColor, bg, bg, tgtColor, tgtColor].join(', ');
    return 'linear-gradient(' + gradient + ')';
  }

  colorWeight(): string {
    const value: number = this._connection.synapse.weight;
    if (value === 0) { return 'black'; }
    return (value > 0) ? this._colorExcitation : this._colorInhibition;
  }

  isSelected(): boolean {
    return this._connection.network.view.isConnectionSelected(this._connection);
  }

  isFocused(): boolean {
    return this._connection.network.view.isConnectionFocused(this._connection);
  }

  distance(): number {
    if (this._connection.source === this._connection.target) { return 0; }
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

  probabilistic(): boolean {
    return !['all_to_all', 'one_to_one'].includes(this._connection.rule);
  }

  // getBackgroundImage(): string {
  //   const bg: string = '#fafafa';
  //   const srcColor: string = this._connection.source.view.color;
  //   const tgtColor: string = this._connection.target.view.color;
  //   const gradient: string = ['150deg', srcColor, srcColor, bg, bg, tgtColor, tgtColor].join(', ');
  //   return 'linear-gradient(' + gradient + ')';
  // }

  select(): void {
    this._connection.network.view.selectedConnection = this._connection;
  }

  focus(): void {
    this._connection.network.view.focusedConnection = this._connection;
  }

  connectRecorder(): boolean {
    return this._connection.source.model.elementType === 'recorder' || this._connection.target.model.elementType === 'recorder';
  }

  connectSpikeDetector(): boolean {
    return this._connection.target.model.existing === 'spike_detector';
  }

  drawPath(): string {
    const source: any = this._connection.source.view.position;
    const target: any = this._connection.target.view.position;
    const config: any = {
        radius: this._connection.source.config.graph.radius.value,
        ellipticalArc: this._connection.config.graph.ellipticalArc.value,
        xAxisRotation: this._connection.config.graph.xAxisRotation.value,
      };
    return drawPath(source, target, config);
  }

  getRuleParams(): any[] {
    const rule: any = this._connection.config.rules.find((r: any) => r.value === this._connection.rule);
    return this.copy(rule.params) || [];
  }

  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  getRuleParamConfig(id: string): any {
    const params: any[] = this.getRuleParams();
    return params.find((param: any) => param.id === id) || {};
  }

}
