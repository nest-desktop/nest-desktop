import { Node } from './node/node';
import { Model } from './model/model';
import { Connection } from './connection/connection';


export class Parameter {
  private _factors: string[];                    // not functional yet
  private _id: string;
  private _idx: number;                          // generative
  private _input: string;
  private _label: string;
  private _level: number;
  private _max: number;
  private _min: number;
  private _parent: Model | Node | Connection;    // parent
  private _step: number;
  private _ticks: any[];
  private _unit: string;
  private _value: any;
  private _visible: boolean;

  constructor(parent: Model | Node | Connection, param: any) {
    this._parent = parent;
    this._idx = param.idx || parent.params.length;

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
    const model: Model = this._parent.model;
    const param: Parameter = model
      ? model.params.find((p: Parameter) => p.id === this._id)
      : null;
    return param;
  }

  get parent(): Model | Node | Connection {
    return this._parent;
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
    if (['Node', 'Connection'].includes(this._parent.name)) {
      this._parent.network.networkChanges();
    }
    this._parent.network.project.simulateAfterChange();
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  copy(): any {
    return new Parameter(this._parent, this);
  }

  reset(): void {
    this._value = this.options.value;
  }

  toJSON(): any {
    const params: any = {
      id: this._id,
      value: this._value,
    };
    if (this._parent.name === 'Model') {
      params.input = this._input;
      params.label = this._label;
      params.unit = this._unit;
      if (this._input === 'valueSlider') {
        params.min = this._min;
        params.max = this._max;
        params.step = this._step;
      } else if (this._input === 'tickSlider') {
        params.ticks = this._ticks;
      }
    } else {
      params.visible = this._visible;
      params.factors = this._factors;
    }
    return params;
  }

}
