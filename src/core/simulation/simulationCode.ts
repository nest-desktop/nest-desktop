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
    let script = 'nest.SetKernelStatus({';
    script +=
      this._() +
      `"local_num_threads": ${this._simulation.kernel.localNumThreads},`;
    script +=
      this._() +
      `"resolution": ${this.format(this._simulation.kernel.resolution)},`;
    script += this._() + `"rng_seed": ${this._simulation.kernel.rngSeed}`;

    script += this.end() + '})';
    return script + '\n';
  }

  /**
   * Write script for simulation.
   */
  simulate(): string {
    return `nest.Simulate(${this._simulation.time})\n`;
  }
}
