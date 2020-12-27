import { ConnectionProjections } from './connectionProjections';


export class ProjectionParameter {
  private _factors: string[];                    // not functional yet
  private _id: string;
  private _input: string;
  private _label: string;
  private _level: number;
  private _max: number;
  private _min: number;
  private _projections: ConnectionProjections;    // parent
  private _step: number;
  private _ticks: any[];
  private _unit: string;
  private _value: any;
  private _visible: boolean;
  private _options: any;
  private _parametertype: string;
  private _specs: any;

  constructor(projections: ConnectionProjections, param: any = {}) {
    this._projections = projections;

    this._id = param.id;
    this._value = param.value || 0;

    this._visible = param.visible !== undefined ? param.visible : false;
    this._factors = param.factors || [];

    // For model
    this._input = param.input;
    this._label = param.label || '';
    this._level = param.level;
    this._max = param.max;
    this._min = param.min;
    this._step = param.step;
    this._ticks = param.ticks;
    this._unit = param.unit || '';

    this._options = this._projections.config[this._id];
    this._parametertype = 'constant';
    this._specs = {};
  }

  get id(): string {
    return this._id;
  }

  get input(): string {
    return this._input;
  }

  set input(value: string) {
    this._input = value;
  }

  get factors(): string[] {
    return this._factors;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get level(): number {
    return this._level;
  }

  set level(value: number) {
    this._level = value;
  }

  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }

  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }

  get options(): any {
    return this._options;
  }

  get parametertype(): string {
    return this._parametertype;
  }

  get projections(): ConnectionProjections {
    return this._projections;
  }

  get specs(): any {
    return this._specs;
  }

  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
  }

  get ticks(): number[] {
    return this._ticks;
  }

  set ticks(value: number[]) {
    this._ticks = value;
  }

  get unit(): string {
    return this._unit;
  }

  set unit(value: string) {
    this._unit = value;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    // console.log('Set parameter value');
    this._value = value;
    this._projections.connection.network.networkChanges();
    this._projections.connection.network.project.simulateAfterChange();
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  /**
   * Clones a ProjectionParameter. The created instance is created using the
   * projections and the parameters of the old instance.
   * @returns cloned ProjectionParameter
   */
  copy(): any {
    return new ProjectionParameter(this._projections, this);
  }

  reset(): void {
    this._value = this.options.value;
  }

  toJSON(): any {
    const params: any = {
      id: this._id,
      value: this._value,
      input: this._input,
      label: this._label,
      unit: this._unit,
      visible: this._visible,
    };
    if (this._input === 'valueSlider') {
      params.min = this._min;
      params.max = this._max;
      params.step = this._step;
    } else if (this._input === 'tickSlider') {
      params.ticks = this._ticks;
    }
    if (this._factors.length > 0) {
      params.factors = this._factors;
    }
    return params;
  }

}
