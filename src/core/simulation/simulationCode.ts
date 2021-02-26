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

  setRandomStates(): string {
    let script = '';
    script += `msd = ${this._simulation.randomSeed}\n`;
    script += 'N_vp = nest.GetKernelStatus(["total_num_virtual_procs"])[0]\n';
    script +=
      'pyrngs = [numpy.random.RandomState(s) for s in range(msd, msd+N_vp)]';
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
    // script += this._() + '"grng_seed": msd+N_vp';
    script +=
      this._() +
      `"rng_seeds": numpy.random.randint(0, 1000, ${this._simulation.kernel.localNumThreads}).tolist()`;
    // '"rng_seeds": range(msd+N_vp+1, msd+2*N_vp+1)';

    script += this.end() + '})';
    return script + '\n';
  }

  simulate(): string {
    return `nest.Simulate(${this.format(this._simulation.time)})\n`;
  }
}
