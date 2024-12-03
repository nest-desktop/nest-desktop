// valueGenerator.ts

import { fill, linSpace, range } from "../../utils/array";
import { randomNormalArray, randomUniformFloatArray, randomUniformIntArray } from "../../utils/random";

interface IValueGeneratorOption {
  id: string;
  label: string;
  value: number;
  visible: boolean;
}

export class ValueGenerator {
  private _inputs: Record<string, string[]> = {
    fill: ["value", "size"],
    range: ["start", "end", "step"],
    linSpace: ["start", "end", "size"],
    randomUniformInt: ["min", "max", "size"],
    randomUniformFloat: ["min", "max", "size"],
    randomNormal: ["mu", "sigma", "size"],
  };
  private _type: string = "fill";
  private _sort: boolean = false;
  private _options: IValueGeneratorOption[] = [
    { id: "value", label: "value", value: 0, visible: true },
    { id: "start", label: "start", value: 0, visible: false },
    { id: "end", label: "end", value: 1, visible: false },
    { id: "min", label: "min", value: 0, visible: false },
    { id: "max", label: "max", value: 1, visible: false },
    { id: "mu", label: "mean", value: 0, visible: false },
    { id: "sigma", label: "std", value: 0, visible: false },
    { id: "step", label: "step", value: 1, visible: false },
    { id: "size", label: "size", value: 1, visible: true },
  ];
  private _params: Record<string, number | string> = {
    value: 0,
    start: 0,
    end: 1,
    min: 0,
    max: 1,
    mu: 0,
    sigma: 0,
    step: 0,
    size: 1,
  };
  private _types: string[] = [];

  constructor() {
    this._types = Object.keys(this._inputs);
  }

  get options(): IValueGeneratorOption[] {
    return this._options;
  }

  get params(): Record<string, number | string> {
    return this._params;
  }

  set sort(value: boolean) {
    this._sort = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
    this.resetToParamDefaults();
    this.updateParamViews();
  }

  get types(): string[] {
    return this._types;
  }

  /**
   * Reset values to parameter defaults.
   */
  resetToParamDefaults(): void {
    this._options.forEach((option: IValueGeneratorOption) => {
      this._params[option.id] = option.value;
    });
  }

  /**
   * Update parameter views.
   */
  updateParamViews(): void {
    const params: string[] = this._inputs[this._type];
    this._options.forEach((option: IValueGeneratorOption) => (option.visible = params.includes(option.id)));
  }

  /**
   * Generate values in an array.
   */
  generate(d?: Record<string, number>): number[] {
    const p = d || this._params;
    let array: number[] = [];
    switch (this._type) {
      case "fill":
        array = fill(parseFloat(p.value as string), parseInt(p.size as string, 0));
        break;
      case "range":
        array = range(parseFloat(p.start as string), parseFloat(p.end as string), parseFloat(p.step as string));
        break;
      case "linSpace":
        array = linSpace(parseFloat(p.start as string), parseFloat(p.end as string), parseInt(p.size as string, 0));
        array = array.map((a: number) => (p.toFixed === -1 ? a : parseFloat(a.toFixed(p.toFixed as number))));
        break;
      case "randomUniformInt":
        array = randomUniformIntArray(
          parseFloat(p.min as string),
          parseFloat(p.max as string),
          parseInt(p.size as string, 0),
        );
        break;
      case "randomUniformFloat":
        array = randomUniformFloatArray(
          parseFloat(p.min as string),
          parseFloat(p.max as string),
          parseInt(p.size as string, 0),
        );
        array = array.map((a: number) => (p.toFixed === -1 ? a : parseFloat(a.toFixed(p.toFixed as number))));
        break;
      case "randomNormal":
        array = randomNormalArray(
          parseFloat(p.mu as string),
          parseFloat(p.sigma as string),
          parseInt(p.size as string, 0),
        );
        array = array.map((a: number) => (p.toFixed === -1 ? a : parseFloat(a.toFixed(p.toFixed as number))));
    }
    if (array.length > 0 && this._sort) {
      array.sort((a: number, b: number) => a - b);
    }
    return array;
  }
}
