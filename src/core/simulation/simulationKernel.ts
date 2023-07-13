import { Config } from '../common/config';
import { Simulation } from './simulation';

export class SimulationKernel extends Config {
  private _dataPath: string;
  private _localNumThreads: number; // number of threads
  private _resolution: number; // time resolution of simulation steps
  private _simulation: Simulation; // parent
  private _rngSeed: number; // seed for random renerator

  constructor(simulation: Simulation, kernel: any = {}) {
    super('SimulationKernel');
    this._simulation = simulation;
    this._dataPath = kernel.dataPath || '';
    this._localNumThreads = kernel.localNumThreads || 1;
    this._resolution = kernel.resolution || 0.1;
    this._rngSeed = parseInt(kernel.rngSeed, 0) || 1;
  }

  get dataPath(): string {
    return this._dataPath;
  }

  get localNumThreads(): number {
    return this._localNumThreads;
  }

  set localNumThreads(value: number) {
    this._localNumThreads = value;
  }

  get rngSeed(): number {
    return this._rngSeed;
  }

  set rngSeed(value: number) {
    this._rngSeed = value;
  }

  get resolution(): number {
    return this._resolution;
  }

  set resolution(value: number) {
    this._resolution = value;
  }

  get simulation(): Simulation {
    return this._simulation;
  }

  /**
   * Serialize for JSON.
   * @return simulation kernel object
   */
  toJSON(): any {
    const kernel: any = {
      localNumThreads: this._localNumThreads,
      resolution: this._resolution,
      rngSeed: this._rngSeed,
    };
    return kernel;
  }
}
