import { Config } from '../config';
import { Simulation } from './simulation';


export class SimulationKernel extends Config {
  private _localNumThreads: number;              // number of threads
  private _resolution: number;                   // time resolution of simulation steps
  private _simulation: Simulation;               // parent
  private _time: number;                         // endtime of the simulation

  constructor(simulation: Simulation, kernel: any = {}) {
    super('SimulationKernel');
    this._simulation = simulation;
    this._time = 0;
    this._resolution = kernel.resolution || 1;
    this._localNumThreads = kernel.localNumThreads || 1;
  }

  get localNumThreads(): number {
    return this._localNumThreads;
  }

  set localNumThreads(value: number) {
    this._localNumThreads = value;
  }

  get resolution(): number {
    return this._resolution;
  }

  set resolution(value: number) {
    this._resolution = value;
  }

  get time(): number {
    return this._time;
  }

  set time(value: number) {
    this._time = value;
  }

  toJSON(target: string = 'db'): any {
    const kernel: any = {
      resolution: this._resolution,
    };
    if (target === 'simulator') {
      kernel.local_num_threads = this._localNumThreads;
    } else {
      kernel.localNumThreads = this._localNumThreads;
    }
    return kernel;
  }

}
