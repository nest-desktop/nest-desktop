// parameter.ts

import { reactive, UnwrapRef } from "vue";

import { Config } from "../config";

type ParamValueTypes = boolean | number | string | (number | string)[];

export interface ParameterProps {
  disabled?: boolean;
  factors?: any[];
  format?: string;
  id: string;
  input?: string; // backward compatible
  inputLabel?: string;
  items?: any[];
  label?: string;
  max?: number;
  min?: number;
  readonly?: boolean;
  rules?: string[][];
  step?: number;
  ticks?: (number | string)[];
  type?: any;
  unit?: string;
  value?: ParamValueTypes;
  variant?: string;
  visible?: boolean;
}

export class Parameter extends Config {
  private _factors: string[] = []; // not functional yet
  private _format: string = "";
  private _id: string = "";
  private _items: string[] = [];
  private _label: string = "";
  private _max: number = 1;
  private _min: number = 0;
  private _readonly: boolean = false;
  private _rules: string[][] = [];
  private _state: UnwrapRef<any>;
  private _step: number = 1;
  private _ticks: (number | string)[] = [];
  private _type: { [key: string]: any } = { id: "constant" };
  private _unit: string = "";
  private _value: ParamValueTypes = 0; // constant value;
  private _variant: string = "valueInput";

  constructor(param: ParameterProps) {
    super("Parameter");
    this.update(param);
  }

  get code(): string {
    return this.toPythonCode();
  }

  get disabled(): boolean {
    return this._state.disabled;
  }

  get format(): string {
    return this._format;
  }

  get id(): string {
    return this._id;
  }

  /**
   * Check if this parameter is constant.
   */
  get isConstant(): boolean {
    return this._type.id === "constant";
  }

  get items(): string[] {
    return this._items;
  }

  set items(values: string[]) {
    this._items = values;
  }

  get factors(): string[] {
    return this._factors;
  }

  get label(): string {
    return this._label;
  }

  get labelInput(): string {
    let label: string = "";
    label += this.config.rawLabel
      ? this.id
      : this.options["label"] || this.options.id;

    if (this.options.unit) {
      label += ` (${this.options["unit"]})`;
    }
    return label;
  }

  get labelRow(): string {
    let label: string = "";
    label += `<span>${
      this.config.rawLabel ? this.id : this.options["label"] || this.options.id
    }</span>`;

    if (this.options.unit) {
      label += `<span>${this.value} ${this.options["unit"]}</span>`;
    }
    return label;
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

  get modelParam(): Parameter {
    return this;
  }

  get options(): {
    [key: string]: boolean | number | string | (number | string)[];
  } {
    const param = this.modelParam;
    return {
      id: param.id,
      label: param.label,
      max: param.max,
      min: param.min,
      step: param.step,
      ticks: param.ticks,
      unit: param.unit,
      defaultValue: param.value,
      variant: param.variant,
    };
  }

  get readonly(): boolean {
    return this._readonly;
  }

  get rules(): string[][] {
    return this._rules;
  }

  get specs(): any[] {
    if (this._type.id === "constant") {
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

  get ticks(): (number | string)[] {
    return this._ticks;
  }

  set ticks(value: (number | string)[]) {
    this._ticks = value;
  }

  get type(): any {
    return this._type;
  }

  get typeId(): string {
    return this._type.id;
  }

  set typeId(value: string) {
    this._type = this.config.types.find((type: any) => type.id === value);
  }

  get unit(): string {
    return this._unit;
  }

  set unit(value: string) {
    this._unit = value;
  }

  get value(): ParamValueTypes {
    return this._value;
  }

  set value(value: ParamValueTypes) {
    this._value = value;
  }

  get valueFixed(): string {
    if (Array.isArray(this._value)) {
      return (
        "[" + this._value.map((value) => this.toFixed(value)).join(",") + "]"
      );
    } else if (typeof this._value === "number") {
      return this.toFixed(this._value);
    } else {
      return this._value.toString();
    }
  }

  get valueAsString(): string {
    if (Array.isArray(this._value)) {
      return JSON.stringify(this._value.map((value) => value));
    } else {
      return JSON.stringify(this._value);
    }
  }

  get variant(): string {
    return this._variant;
  }

  set variant(value: string) {
    this._variant = value;
  }

  /**
   * Copy paramter component
   */
  override copy(): any {
    return new Parameter(this.toJSON());
  }

  /**
   * Updates when parameter is changed.
   */
  changes(): void {}

  /**
   * Reset value taken from options.
   */
  reset(): void {
    this.typeId = "constant";
    if (this.options) {
      this._value = this.options.defaultValue;
    }
  }

  /**
   * Converts a number into a string, but keeps up to `fractionDigits` many
   * fraction digits of that number , i.e.  1 => '1.0', 1.23456 => '1.23456'.
   * @param value number to be converted
   * @param fractionDigits required fraction digits for the output string
   * @returns converted number
   */
  toFixed(value: number | string, fractionDigits: number = 1): string {
    const valueAsString = value.toString();
    if (valueAsString.includes(".") && fractionDigits > 0) {
      fractionDigits = valueAsString.split(".")[1].length;
    }
    return Number(value).toFixed(fractionDigits);
  }

  toggleDisabled(): void {
    this._state.disabled = !this._state.disabled;
    this.changes();
  }

  /**
   * Generate the Python code for this parameter.
   * @returns parameter as Python code
   */
  toPythonCode(): string {
    let value: string;
    if (this.isConstant) {
      // Constant value.
      if (this._format === "integer") {
        // Integer value
        value = this.toFixed(this._value as number, 0);
      } else if (this._format === "float") {
        // Float value
        value = this.toFixed(this._value as number);
      } else if (typeof this._value === "string") {
        // TODO: this condition should be checked if it is really possible.
        // String value
        value = this._value as string;
      } else if (typeof this._value === "boolean") {
        // Boolean value
        value = this._value ? "True" : "False";
      } else if (Array.isArray(this._value)) {
        value = JSON.stringify(this._value.map((value) => value));
      } else {
        value = JSON.stringify(this._value);
      }
    } else if (this._type.id.startsWith("numpy")) {
      const specs: string = this.specs
        .filter((spec: any) => !(spec.optional && spec.value === spec.default))
        .map((spec: any) => spec.value)
        .join(", ");
      value = `${this._type.id}(${specs})`;
    } else if (this._type.id === "spatial.distance") {
      // Distance-dependent linear function.
      const specs: any[] = this.specs;
      value = "";
      value += specs[0].value !== 1 ? `${specs[0].value} * ` : "";
      value += `nest.${this._type.id}`;
      value += specs[1].value !== 0 ? ` + ${specs[1].value}` : "";
    } else if (this._type.id.startsWith("spatial")) {
      // Spatial distribution.
      const specs: string = this.specs
        .map((spec: any) => spec.value)
        .join(", ");
      value = `nest.${this._type.id}(nest.spatial.distance, ${specs})`;
    } else {
      // Non-spatial distribution.
      const specs: string = this.specs
        .map((spec: any) => spec.value)
        .join(", ");
      value = `nest.${this._type.id}(${specs})`;
    }
    return value;
  }

  /**
   * Serialize parameter type for JSON.
   * @return parameter type object
   */
  typeToJSON(): any {
    const specs = this._type.specs.map((spec: any) => ({
      id: spec.id,
      value: Number(spec.value),
    }));

    return {
      id: this._type.id,
      specs,
    };
  }

  /**
   * Serialize for JSON.
   * @return parameter object
   */
  toJSON(): ParameterProps {
    const param: any = {
      id: this._id,
      value: this._value,
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
      param.type = this.typeToJSON();
    }

    return param;
  }

  /**
   * Update parameter
   * @param param parameter props
   */
  update(param: ParameterProps): void {
    this._id = param.id;
    this._value = param.value || 0;

    this._state = reactive({
      visible: param.visible != undefined ? param.visible : false,
      disabled: param.disabled != undefined ? param.disabled : true,
    });

    // optional param specifications
    this._rules = param.rules || [];
    this._factors = param.factors || [];

    if (param.type) {
      const type = this.config.types.find((t: any) => t.id === param.type.id);
      if (type != null) {
        this._type = { ...type, ...param.type };
      }
    }

    this._format = param.format || "";
    this._items = param.items || [];
    this._label = param.label || param.id;
    this._max = param.max || 1;
    this._min = param.min || 0;
    this._readonly = param.readonly || false;
    this._step = param.step || 1;
    this._ticks = param.ticks || [];
    this._unit = param.unit || "";
    this._variant = param.variant || param.input || "valueInput";
  }
}
