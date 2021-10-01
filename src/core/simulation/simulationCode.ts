import { Code } from '../code';
import { Simulation } from './simulation';

export class SimulationCode extends Code {
  private _simulation: Simulation; // parent

  constructor(simulation: Simulation) {
    super();
    this._simulation = simulation;
  }

  /**
   * Write script for simulation kernel.
   */
  setKernelStatus(): string {
    let script = '';
    script += `nest.local_num_threads = ${this._simulation.kernel.localNumThreads}\n`;
    script += `nest.resolution = ${this._simulation.kernel.resolution}\n`;
    script += `nest.rng_seed = ${this._simulation.kernel.rngSeed}\n`;
    return script;
  }

  /**
   * Write script for simulation.
   */
  simulate(): string {
    return `nest.Simulate(${this._simulation.time})\n`;
  }
}
