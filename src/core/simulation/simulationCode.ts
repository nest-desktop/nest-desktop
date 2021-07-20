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
    let script = 'nest.SetKernelStatus({' + this._();
    const specs: string[] = [];
    specs.push(
      `"local_num_threads": ${this._simulation.kernel.localNumThreads}`
    );
    specs.push(`"resolution": ${this._simulation.kernel.resolution}`);
    specs.push(`"rng_seed": ${this._simulation.kernel.rngSeed}`);
    script += specs.join(',' + this._());
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
