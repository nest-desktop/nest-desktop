import { Config } from '../config';
import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { Node } from '../node/node';
import { Synapse } from '../connection/synapse';

export class Parameter extends Config {
  private _factors: string[]; // not functional yet
  private _id: string;
  private _idx: number; // generative
  private _input: string;
  private _label: string;
  private _max: number;
  private _min: number;
  private _parent: Connection | Model | Node | Synapse; // parent
  private _specs: any[] = [];
  private _step: number;
  private _ticks: any[];
  private _type: string = 'constant';
  private _unit: string;
  private _value: number | number[]; // constant value;
  private _visible: boolean;

  constructor(parent: Connection | Model | Node | Synapse, param: any) {
    super('Parameter');
    this._parent = parent;
    this._idx = param.idx || parent.params.length;

    this._id = param.id;
    this._value = param.value || 0;
    this._type = param.type || 'constant';
    this._specs = param.specs || [{ id: 'value', value: this._value }];

    this._visible = param.visible !== undefined ? param.visible : false;
    this._factors = param.factors || [];

    this._input = param.input;
    this._label = param.label;
    this._max = param.max;
    this._min = param.min;
    this._step = param.step;
    this._ticks = param.ticks;
    this._unit = param.unit || '';
  }

  get id(): string {
    return this._id;
  }

  get idx(): number {
    return this._idx;
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
    return this;
  }

  get parent(): Connection | Model | Node | Synapse {
    return this._parent;
  }

  get specs(): any[] {
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

  get title(): string {
    let label: string = `${this.options['label']}` || this.options.id;
    if (this.options.unit) {
      label += ` (${this.options['unit']})`;
    }
    return label;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
    this._specs = this.config.types.find(
      (type: any) => type.value === this._type
    ).specs;
    if (!this.isRandom()) {
      this._specs[0].value = this._value;
    }
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
    this._value = value;
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  /**
   * Check if this parameter is random.
   */
  isRandom(): boolean {
    return this._type !== 'constant';
  }

  /**
   * Check if this parameter can be spatial
   * when the connection is spatial.
   */
  isSpatial(): boolean {
    if (this._parent.name === 'Connection') {
      const connection = this._parent as Connection;
      return connection.isBothSpatial();
    } else {
      return false;
    }
  }

  /**
   * List parameter types for random or spatial distribution.
   */
  getTypes(): string[] {
    const types: any[] = this.config.types;
    return !this.isSpatial() && true // it doesnt work with spatial distributions.
      ? types.filter((type: any) => !type.value.startsWith('spatial'))
      : types;
  }

  /**
   * Copy paramter component
   */
  copy(): any {
    return new Parameter(this._parent, this);
  }

  /**
   * Reset value taken from options.
   */
  reset(): void {
    this._type = 'constant';
    // this._value = this.options.value;
  }

  /**
   * Updates when parameter is changed.
   */
  paramChanges(): void {
    let node: Node;
    let connection: Connection;
    let synapse: Synapse;
    let model: Model;

    switch (this.parent.name) {
      case 'Node':
        node = this.parent as Node;
        node.nodeChanges();
        break;
      case 'Connection':
        connection = this.parent as Connection;
        connection.connectionChanges();
        break;
      case 'Synapse':
        synapse = this.parent as Synapse;
        synapse.synapseChanges();
        break;
      case 'Model':
        model = this.parent as Model;
        model.modelChanges();
        break;
    }
  }

  /**
   * Serialize for JSON.
   */
  toJSON(): any {
    const params: any = {
      factors: this._factors,
      id: this._id,
      type: this._type,
      value: this._value,
      visible: this._visible,
    };
    if (this.isRandom()) {
      params.specs = this._specs;
    }
    return params;
  }
}
