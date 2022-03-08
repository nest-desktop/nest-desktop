import { reactive, UnwrapRef } from '@vue/composition-api';

import { Config } from '../common/config';
import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { Node } from '../node/node';
import { NodeSlice } from '../node/nodeSlice';
import { Synapse } from '../synapse/synapse';

export class Parameter extends Config {
  private _factors: string[]; // not functional yet
  private _id: string;
  private _idx: number; // generative
  private _input: string;
  private _label: string;
  private _max: number;
  private _min: number;
  private _parent: Connection | Model | Node | NodeSlice | Synapse; // parent
  private _readonly: boolean;
  private _rules: string[][];
  private _state: UnwrapRef<any>;
  private _step: number;
  private _ticks: any[];
  private _type: any = { id: 'constant' };
  private _unit: string;
  private _value: boolean | number | number[]; // constant value;

  constructor(
    parent: Connection | Model | Node | NodeSlice | Synapse,
    param: any
  ) {
    super('Parameter');
    this._parent = parent;
    this._idx = param.idx || parent.params.length;

    this._id = param.id;
    this._value = param.value || 0;

    this._state = reactive({
      visible: param.visible != undefined ? param.visible : false,
      disabled: param.disabled != undefined ? param.disabled : true,
    });

    // optional param specifications
    this._rules = param.rules || [];
    this._factors = param.factors || [];
    this._type = param.type || { id: 'constant' };

    this._input = param.input;
    this._label = param.label || param.id;
    this._max = param.max;
    this._min = param.min;
    this._readonly = param.readonly || false;
    this._step = param.step;
    this._ticks = param.ticks;
    this._unit = param.unit || '';
  }

  get disabled(): boolean {
    return this._state.disabled;
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

  get parent(): Connection | Model | Node | NodeSlice | Synapse {
    return this._parent;
  }

  get readonly(): boolean {
    return this._readonly;
  }

  get rules(): string[][] {
    return this._rules;
  }

  get specs(): any[] {
    if (this._type.id === 'constant') {
      return [{ label: this.label, value: this._value }];
    } else {
      return this._type.specs || [];
    }
  }

  get state(): UnwrapRef<any> {
    return this._state;
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
    this._type = this.config.types.find((type: any) => type.id === value);
  }

  get types(): any[] {
    const types: any[] = this.config.types;
    return !this.isSpatial
      ? types.filter((type: any) => !type.id.startsWith('spatial'))
      : types;
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

  get valueFixed(): string {
    if (Array.isArray(this._value)) {
      return (
        '[' +
        this._value.map((value: number) => this.toFixed(value)).join(',') +
        ']'
      );
    } else if (typeof this._value === 'number') {
      return this.toFixed(this._value);
    } else {
      return this._value.toString();
    }
  }

  get valueAsString(): string {
    if (Array.isArray(this._value)) {
      return JSON.stringify(this._value.map((value: number) => value));
    } else {
      return JSON.stringify(this._value);
    }
  }

  get visible(): boolean {
    return this._state.visible;
  }

  /**
   * Check if this parameter is constant.
   */
  get isConstant(): boolean {
    return this._type.id === 'constant';
  }

  /**
   * Check if this parameter can be spatial
   * when the connection is spatial.
   */
  get isSpatial(): boolean {
    if (this._parent.name === 'Connection') {
      const connection = this._parent as Connection;
      return connection.isBothSpatial;
    } else if (this._parent.name === 'Synapse') {
      const synapse = this._parent as Synapse;
      return synapse.connection.isBothSpatial;
    } else {
      return false;
    }
  }

  toggleDisabled(): void {
    this._state.disabled = !this._state.disabled;
    this.paramChanges();
  }

  /**
   * Copy paramter component
   */
  override copy(): any {
    return new Parameter(this._parent, this);
  }

  /**
   * Reset value taken from options.
   */
  reset(): void {
    this.type = 'constant';
    // this._value = this.options.value;
  }

  /**
   * Updates when parameter is changed.
   */
  paramChanges(): void {
    let parent: Connection | Model | Node | NodeSlice | Synapse;

    switch (this.parent.name) {
      case 'Connection':
        parent = this.parent as Connection;
        parent.connectionChanges();
        break;
      case 'Model':
        parent = this.parent as Model;
        parent.modelChanges();
        break;
      case 'Node':
        parent = this.parent as Node;
        parent.nodeChanges();
        break;
      case 'NodeSlice':
        parent = this.parent as NodeSlice;
        parent.node.nodeChanges();
        break;
      case 'Synapse':
        parent = this.parent as Synapse;
        parent.synapseChanges();
        break;
    }
  }

  toFixed(value: number): string {
    const valueAsString = value.toString();
    let fractionDigits = 1;
    if (valueAsString.includes('.')) {
      fractionDigits = valueAsString.split('.')[1].length;
    }
    return value.toFixed(fractionDigits);
  }

  /**
   * Write textual code.
   */
  toCode(): string {
    let value: string;
    if (this.isConstant) {
      // Constant value.
      if (typeof this._value === 'boolean') {
        // Boolean value for Python.
        value = this._value ? 'True' : 'False';
      } else {
        value = JSON.stringify(this._value);
      }
    } else if (this._type.id.startsWith('numpy')) {
      const specs: string = this.specs
        .filter((spec: any) => !(spec.optional && spec.value === spec.default))
        .map((spec: any) => spec.value)
        .join(', ');
      value = `list(${this._type.id}(${specs}))`;
    } else if (this._type.id === 'spatial.distance') {
      // Distance-dependent linear function.
      const specs: any[] = this.specs;
      value = '';
      value += specs[0].value !== 1 ? `${specs[0].value} * ` : '';
      value += `nest.${this._type.id}`;
      value += specs[1].value !== 0 ? ` + ${specs[1].value}` : '';
    } else if (this._type.id.startsWith('spatial')) {
      // Spatial distribution.
      const specs: string = this.specs
        .map((spec: any) => spec.value)
        .join(', ');
      value = `nest.${this._type.id}(nest.spatial.distance, ${specs})`;
    } else {
      // Non-spatial distribution.
      const specs: string = this.specs
        .map((spec: any) => spec.value)
        .join(', ');
      value = `nest.${this._type.id}(${specs})`;
    }
    return value;
  }

  /**
   * Serialize for JSON.
   * @return parameter object
   */
  toJSON(): any {
    const param: any = {
      id: this._id,
      value: this._value,
      visible: this._state.visible,
    };

    // Add value factors if existed.
    if (this._factors.length > 0) {
      param.factors = this._factors;
    }

    // Add rules for validation if existed.
    if (this._rules.length > 0) {
      param.rules = this._rules;
    }

    // Add param type if not constant.
    if (!this.isConstant) {
      param.type = this._type;
    }

    return param;
  }
}
