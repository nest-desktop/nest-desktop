// randomParameter.ts

import { BaseObj } from "./base";

interface IParameterRandomProps {
  distribution: string;
  specs: {
    [key: string]: number;
  };
}

export class ParameterRandom extends BaseObj {
  private _defaults: Record<string, Record<string, number>>;
  private _distribution: string;
  private _specs: {
    [key: string]: number | string;
  };

  constructor(randomProps: IParameterRandomProps) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._defaults = {
      exponential: { beta: 1 },
      logNormal: { mean: 0, std: 1 },
      normal: { mean: 0, std: 1 },
      uniform: { min: 0, max: 1 },
    };
    this._distribution = randomProps.distribution || "uniform";
    this._specs = randomProps.specs || this._defaults[randomProps.distribution];
  }

  get defaults(): Record<string, Record<string, number>> {
    return this._defaults;
  }

  get distribution(): string {
    return this._distribution;
  }

  get specs(): {
    [key: string]: number | string;
  } {
    return this._specs;
  }

  /**
   * Serialize for JSON.
   * @return random parameter object
   */
  toJSON(): IParameterRandomProps {
    const specs: Record<string, number> = {};
    Object.keys(this._defaults[this._distribution]).map((param: string) => {
      if (param in this._specs) {
        specs[param] = parseFloat(this._specs[param] as string);
      }
    });
    return {
      distribution: this._distribution,
      specs,
    };
  }
}
