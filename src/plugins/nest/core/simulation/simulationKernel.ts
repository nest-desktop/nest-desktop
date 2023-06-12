// simulationKernel.ts

import { Config } from '@/helpers/config';

import { Simulation } from './simulation';

export interface simulationKernelProps {
  resolution?: number;
  localNumThreads?: number;
  rngSeed?: number;
}

export class SimulationKernel extends Config {
  private _localNumThreads: number; // number of threads
  private _resolution: number; // time resolution of simulation steps
  private _simulation: Simulation; // parent
  private _rngSeed: number; // seed for random renerator

  constructor(simulation: Simulation, kernel: simulationKernelProps = {}) {
    super('SimulationKernel');
    this._simulation = simulation;
    this._resolution = kernel.resolution || 0.1;
    this._localNumThreads = kernel.localNumThreads || 1;
    this._rngSeed = kernel.rngSeed || 0;
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
  toJSON(): simulationKernelProps {
    const kernel: simulationKernelProps = {
      localNumThreads: this._localNumThreads,
      resolution: this._resolution,
      rngSeed: this._rngSeed,
    };
    return kernel;
  }
}
