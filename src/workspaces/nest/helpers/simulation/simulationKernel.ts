// simulationKernel.ts

import { BaseObj } from "@/helpers/common/base";

import { NESTSimulation } from "./simulation";

export interface INESTSimulationKernelProps {
  resolution?: number;
  localNumThreads?: number;
  rngSeed?: number;
}

export class NESTSimulationKernel extends BaseObj {
  private _localNumThreads: number; // number of threads
  private _resolution: number; // time resolution of simulation steps
  private _simulation: NESTSimulation; // parent
  private _rngSeed: number; // seed for random renerator

  constructor(simulation: NESTSimulation, kernelProps: INESTSimulationKernelProps = {}) {
    super({
      config: { name: "NESTSimulationKernel", simulator: "nest" },
      logger: { settings: { minLevel: 3 } },
    });

    this._simulation = simulation;

    this._resolution = kernelProps.resolution || 0.1;
    this._localNumThreads = kernelProps.localNumThreads || 1;
    this._rngSeed = kernelProps.rngSeed || 1;
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

  get simulation(): NESTSimulation {
    return this._simulation;
  }

  /**
   * Serialize for JSON.
   * @return simulation kernel props
   */
  toJSON(): INESTSimulationKernelProps {
    return {
      localNumThreads: this._localNumThreads,
      resolution: this._resolution,
      rngSeed: this._rngSeed,
    };
  }
}
