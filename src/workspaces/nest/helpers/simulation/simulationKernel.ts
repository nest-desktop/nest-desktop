// simulationKernel.ts

import { BaseObj } from "@/helpers/common/base";

import { NESTSimulation } from "./simulation";

export interface INESTSimulationKernelProps {
  resolution?: number;
  localNumThreads?: number;
  rngSeed?: number;
}

export class NESTSimulationKernel extends BaseObj {
  private _simulation: NESTSimulation; // parent

  constructor(simulation: NESTSimulation) {
    super({
      config: { name: "NESTSimulationKernel", simulator: "nest" },
    });

    this._simulation = simulation;
  }

  get localNumThreads(): number | undefined {
    return this.intf?.local_num_threads?.value;
  }

  get rngSeed(): number | undefined {
    return this.intf?.rng_seed?.value;
  }

  get resolution(): number | undefined {
    return this.intf?.resolution?.value;
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
      localNumThreads: this.localNumThreads,
      resolution: this.resolution,
      rngSeed: this.rngSeed,
    };
  }
}
