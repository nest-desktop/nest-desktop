import { Code } from '../code';
import { Simulation } from './simulation';

export class SimulationCode extends Code {
  private _simulation: Simulation; // parent

  constructor(simulation: Simulation) {
    super();
    this._simulation = simulation;
  }

  setRandomSeed(): string {
    const script = `numpy.random.seed(${this._simulation.randomSeed})`;
    return script + '\n';
  }

  setKernelStatus(): string {
    let script = 'nest.SetKernelStatus({';
    script +=
      this._() +
      `"local_num_threads": ${this._simulation.kernel.localNumThreads},`;
    script +=
      this._() +
      `"resolution": ${this.format(this._simulation.kernel.resolution)},`;
    script +=
      this._() +
      `"rng_seeds": numpy.random.randint(0, 1000, ${this._simulation.kernel.localNumThreads}).tolist()`;
    script += this.end() + '})';
    return script + '\n';
  }

  simulate(): string {
    return `nest.Simulate(${this.format(this._simulation.time)})\n`;
  }
}
