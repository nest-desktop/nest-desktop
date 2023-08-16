// simulationKernel.ts

import { NorseConfig } from "@norse/core/helpers/norseConfig";
import { Simulation } from "./simulation";

export interface SimulationKernelProps {
  resolution?: number;
  localNumThreads?: number;
  rngSeed?: number;
}

export class SimulationKernel extends NorseConfig {
  private _localNumThreads: number; // number of threads
  private _resolution: number; // time resolution of simulation steps
  private _simulation: Simulation; // parent
  private _rngSeed: number; // seed for random renerator

  constructor(simulation: Simulation, kernel: SimulationKernelProps = {}) {
    super("SimulationKernel");
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
    this._simulation.changes();
  }

  get rngSeed(): number {
    return this._rngSeed;
  }

  set rngSeed(value: number) {
    this._rngSeed = value;
    this._simulation.changes();
  }

  get resolution(): number {
    return this._resolution;
  }

  set resolution(value: number) {
    this._resolution = value;
    this._simulation.changes();
  }

  get simulation(): Simulation {
    return this._simulation;
  }

  /**
   * Serialize for JSON.
   * @return simulation kernel object
   */
  toJSON(): SimulationKernelProps {
    const kernel: SimulationKernelProps = {
      localNumThreads: this._localNumThreads,
      resolution: this._resolution,
      rngSeed: this._rngSeed,
    };
    return kernel;
  }
}
