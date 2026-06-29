// parameter.ts

import { type UnwrapRef, reactive } from "vue";

import { truncate } from "@/utils";
import { BaseObj, type IBaseState } from "@/core";

import type { BaseParameters } from "./parameters";

export interface IParamOptions {
  component?: TParamComponent;
  defaultValue: TParamValue;
  id: string;
  label: string;
  max?: number;
  min?: number;
  step?: number;
  tickLabels?: (number | string)[];
  unit: string;
}

export interface IParamState extends IBaseState {
  component?: TParamComponent;
  disabled?: boolean;
  factors?: string[];
  format?: string;
  handleOnUpdate?: (param: BaseParameter) => void;
  hidden?: boolean;
  id: string;
  input?: TParamComponent; // backward compatible, now component
  inputLabel?: string;
  items?: string[] | Record<string, string>[];
  label?: string;
  max?: number;
  min?: number;
  readonly?: boolean;
  rules?: string[][];
  step?: number;
  ticks?: (number | string)[];
  type?: IParamType;
  unit?: string;
  value?: TParamValue;
}

interface IParamRefState {
  disabled: boolean;
  hidden: boolean;
  random: boolean;
  value: TParamValue;
}

export interface IParamType {
  icon?: string;
  id: string;
  label?: string;
  specs?: IParamTypeSpec[];
}

export interface IParamTypeSpec {
  default?: number;
  id?: string;
  optional?: boolean;
  label?: string;
  value: TParamValue;
}

export type TParamComponent = "arrayInput" | "checkbox" | "rangeSlider" | "select" | "tickSlider" | "valueSlider" | "";

export type TParamValue = boolean | number | string | (number | string)[];

export class BaseParameter<
  TParent extends BaseParameters = BaseParameters,
  TState extends IParamState = IParamState,
> extends BaseObj<TState> {
  private _component: TParamComponent = "";
  private _factors: string[] = []; // not functional yet
  private _format: string = "";
  private _id: string = "";
  private _items: string[] | Record<string, string>[] = [];
  private _label: string = "";
  private _max: number = 1;
  private _min: number = 0;
  private _parent: TParent;
  private _readonly: boolean = false;
  private _rules: string[][] = [];
  private _state: UnwrapRef<IParamRefState>;
  private _step: number = 1;
  private _ticks: (number | string)[] = [];
  private _type: IParamType = { id: "constant" };
  private _unit: string = "";

  constructor(parent: TParent) {
    super({ config: { name: "Parameter" } });

    this._parent = parent;
    this._state = reactive<IParamRefState>({
      random: false,
      hidden: true,
      disabled: true,
      value: 0,
    });
  }

  get component(): TParamComponent {
    return this._component;
  }

  set component(value: TParamComponent) {
    this._component = value;
  }

  get disabled(): boolean {
    return this.state.disabled;
  }

  get format(): string {
    return this._format;
  }

  get id(): string {
    return this._id;
  }

  get isConstant(): boolean {
    return this.type.id === "constant";
  }

  get items(): string[] | Record<string, string>[] {
    return this._items;
  }

  set items(values: string[]) {
    this._items = values;
  }

  get factors(): string[] {
    return this._factors;
  }

  get hidden(): boolean {
    return this.state.hidden;
  }

  set hidden(value: boolean) {
    this.state.hidden = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get labelInput(): string {
    let label: string = "";
    label += this.options.label || this.options.id;

    if (this.options.unit) label += ` (${this.options.unit})`;

    return label;
  }

  get labelRow(): string {
    let label: string = "";
    label += `<span>${this.options.label || this.options.id}</span>`;

    if (this.options.unit) label += `<span>${this.value} ${this.options.unit}</span>`;

    return label;
  }

  get labelShort(): string {
    return truncate(this.label, 30);
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

  get modelParam(): BaseParameter | undefined {
    return this.parent?.modelParams?.get(this.id);
  }

  get options(): IParamOptions {
    const param = this.modelParam;

    if (!param) return { id: this.id, label: this.label, defaultValue: this.value, unit: this.unit };

    const options: IParamOptions = {
      component: param.component || "",
      defaultValue: param.value,
      id: param.id,
      label: param.label,
      unit: param.unit,
    };

    if (["rangeSlider", "valueSlider"].includes(param.component)) {
      options.max = param.max;
      options.min = param.min;
      options.step = param.step;
    }

    if (param.component === "tickSlider") {
      options.tickLabels = param.ticks;
    }

    return options;
  }

  get parent(): TParent {
    return this._parent;
  }

  get readonly(): boolean {
    return this._readonly;
  }

  get rules(): string[][] {
    return this._rules;
  }

  get specs(): IParamTypeSpec[] {
    if (this.type.id === "constant") {
      return [{ label: this.label, value: this.value }];
    } else {
      return this.type.specs || [];
    }
  }

  get state(): UnwrapRef<IParamRefState> {
    return this._state;
  }

  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
  }

  get ticks(): (number | string)[] {
    return this._ticks;
  }

  set ticks(value: (number | string)[]) {
    this._ticks = value;
  }

  get type(): IParamType {
    return this._type;
  }

  get typeId(): string {
    return this.type.id;
  }

  set typeId(value: string) {
    this._type = this.config?.localStorage.types.find((type: IParamType) => type.id === value);

    if (!this.isConstant) {
      this.specs.forEach((p: IParamTypeSpec) => (p.value = parseFloat(p.value as string)));
    }
  }

  get types(): IParamType[] {
    return this.config?.localStorage.types || [];
  }

  get unit(): string {
    return this._unit;
  }

  set unit(value: string) {
    this._unit = value;
  }

  get value(): TParamValue {
    return this.state.value;
  }

  set value(value: TParamValue) {
    this.state.value = value;
    if (this.props?.value?.handleOnUpdate) this.props.value.handleOnUpdate(this);
  }

  /**
   * Copy parameter instance.
   */
  copy(): BaseParameter<TParent> {
    const param = new BaseParameter<TParent>(this.parent);
    param.load(this.save());
    return param;
  }

  /**
   * Hide this parameter.
   */
  hide(): void {
    this.hidden = true;
  }

  /**
   * Load parameter from state.
   * @param paramState parameter state
   */
  load(paramState: TState): void {
    this.logger.trace("load:", paramState.id);

    this.props.value = paramState;
    this._id = paramState.id;

    // optional param specifications
    this._rules = paramState.rules || [];
    this._factors = paramState.factors || [];
    this._state.value = paramState.value ?? 0;

    if (paramState.type) {
      const type = this.config?.localStorage.types.find((t: IParamType) => t.id === paramState.type?.id);
      if (type != null) this._type = { ...type, ...paramState.type };
    }

    this._component = paramState.component || paramState.input || "";
    this._format = paramState.format || "";
    this._items = paramState.items || [];
    this._label = paramState.label || "";
    this._readonly = paramState.readonly || false;

    this._max = paramState.max || 1;
    this._min = paramState.min || 0;
    const value = Math.abs(paramState.value as number);
    const step = value > 1 ? 0.1 : Math.ceil(value * 500) / 10000;
    this._step = paramState.step || step || 1;
    this._ticks = paramState.ticks || [];
    this._unit = paramState.unit || "";
  }

  /**
   * Reset value taken from options.
   */
  reset(): void {
    this.typeId = "constant";
    if (this.options) this.state.value = this.options.defaultValue;
  }

  /**
   * Save parameter to state.
   * @return parameter state
   */
  override save(): TState {
    const paramState: TState = {
      id: this.id,
      value: this.value,
      hidden: this.hidden,
    };

    // Add value factors if existed.
    if (this.factors.length > 0) paramState.factors = this.factors;

    // Add rules for validation if existed.
    if (this.rules.length > 0) paramState.rules = this.rules;

    // Add param type if not constant.
    if (!this.isConstant) paramState.type = this.saveType();

    return paramState;
  }

  /**
   * Save parameter type for state.
   * @return parameter type state
   */
  saveType(): IParamType {
    const paramType: IParamType = {
      id: this.type.id,
    };

    if (this.type.specs)
      paramType.specs = this.type.specs.map((spec: IParamTypeSpec) => ({
        id: spec.id,
        value: Number(spec.value),
      }));

    return paramType;
  }

  /**
   * Show this parameter.
   */
  show(): void {
    this.hidden = false;
  }

  /**
   * Toggle disabled state.
   */
  toggleDisabled(): void {
    this.state.disabled = !this.state.disabled;
  }
}
