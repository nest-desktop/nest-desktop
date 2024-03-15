// valueGenerator.ts

import { fill, linSpace, range } from "./array";
import {
  randomUniformIntArray,
  randomUniformFloatArray,
  randomNormalArray,
} from "./random";

export class ValueGenerator {
  private _inputs: any = {
    fill: ["value", "size"],
    range: ["start", "end", "step"],
    linSpace: ["start", "end", "size"],
    randomUniformInt: ["min", "max", "size"],
    randomUniformFloat: ["min", "max", "size"],
    randomNormal: ["mu", "sigma", "size"],
  };
  private _type: string = "fill";
  private _sort: boolean = false;
  private _options: any[] = [
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
  private _params: { [key: string]: number } = {
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

  get options(): any[] {
    return this._options;
  }

  get params(): any {
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
    this._options.forEach((option: any) => {
      this._params[option.id] = option.value;
    });
  }

  /**
   * Update parameter views.
   */
  updateParamViews(): void {
    const params: string[] = this._inputs[this._type];
    this._options.forEach(
      (option: any) => (option.visible = params.includes(option.id))
    );
  }

  /**
   * Generate values in an array.
   */
  generate(d: any = undefined): number[] {
    const p: any = d || this._params;
    let array: number[] = [];
    switch (this._type) {
      case "fill":
        array = fill(parseFloat(p.value), parseInt(p.size, 0));
        break;
      case "range":
        array = range(
          parseFloat(p.start),
          parseFloat(p.end),
          parseFloat(p.step)
        );
        break;
      case "linSpace":
        array = linSpace(
          parseFloat(p.start),
          parseFloat(p.end),
          parseInt(p.size, 0)
        );
        array = array.map((a: any) =>
          p.toFixed === -1 ? parseInt(a, 0) : parseFloat(a.toFixed(p.toFixed))
        );
        break;
      case "randomUniformInt":
        array = randomUniformIntArray(
          parseFloat(p.min),
          parseFloat(p.max),
          parseInt(p.size, 0)
        );
        break;
      case "randomUniformFloat":
        array = randomUniformFloatArray(
          parseFloat(p.min),
          parseFloat(p.max),
          parseInt(p.size, 0)
        );
        array = array.map((a: any) =>
          p.toFixed === -1 ? parseInt(a, 0) : parseFloat(a.toFixed(p.toFixed))
        );
        break;
      case "randomNormal":
        array = randomNormalArray(
          parseFloat(p.mu),
          parseFloat(p.sigma),
          parseInt(p.size, 0)
        );
        array = array.map((a: any) =>
          p.toFixed === -1 ? parseInt(a, 0) : parseFloat(a.toFixed(p.toFixed))
        );
    }
    if (array.length > 0 && this._sort) {
      array.sort((a: number, b: number) => a - b);
    }
    return array;
  }
}
