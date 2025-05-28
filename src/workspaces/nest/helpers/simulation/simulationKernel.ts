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
    });

    this._simulation = simulation;

    this._resolution = kernelProps.resolution || 0.1;
    this._localNumThreads = kernelProps.localNumThreads || 1;
    this._rngSeed = kernelProps.rngSeed || 1;
  }

  get localNumThreads(): number {
    return this.codeNodes.node ? this.codeNodes.node.inputs.local_num_threads.value : this._localNumThreads;
  }

  set localNumThreads(value: number) {
    if (this.codeNodes.node) this.codeNodes.node.inputs.local_num_threads.value = value;
    else {
      this._localNumThreads = value;
      this._simulation.onUpdate();
    }
  }

  get rngSeed(): number {
    return this.codeNodes.node ? this.codeNodes.node.inputs.rng_seed.value : this._rngSeed;
  }

  set rngSeed(value: number) {
    if (this.codeNodes.node) this.codeNodes.node.inputs.rng_seed.value = value;
    else {
      this._rngSeed = value;
      this._simulation.onUpdate();
    }
  }

  get resolution(): number {
    return this.codeNodes.node ? this.codeNodes.node.inputs.resolution.value : this._resolution;
  }

  set resolution(value: number) {
    if (this.codeNodes.node) this.codeNodes.node.inputs.resolution.value = value;
    else {
      this._resolution = value;
      this._simulation.onUpdate();
    }
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

  /**
   * Update code node.
   */
  updateCodeNodes(): void {
    if (!this.codeNodes.node) return;

    this.codeNodes.node.inputs.local_num_threads.value = this._localNumThreads;
    this.codeNodes.node.inputs.resolution.value = this._resolution;
    this.codeNodes.node.inputs.rng_seed.value = this._rngSeed;
  }
}
