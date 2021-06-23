import { Config } from '../config';
import { Project } from '../project/project';
import { SimulationKernel } from './simulationKernel';
import { SimulationCode } from './simulationCode';

export class Simulation extends Config {
  private _code: SimulationCode;
  private _kernel: SimulationKernel; // simulation kernel
  private _project: Project; // parent
  private _running = false;
  private _time: number; // simulation time

  constructor(project: Project, simulation: any = {}) {
    super('Simulation');
    this._project = project;
    this._kernel = new SimulationKernel(this, simulation.kernel);
    this._code = new SimulationCode(this);
    this._time = parseFloat(simulation.time) || 1000;
  }

  get code(): SimulationCode {
    return this._code;
  }

  get kernel(): SimulationKernel {
    return this._kernel;
  }

  get project(): Project {
    return this._project;
  }

  get running(): boolean {
    return this._running;
  }

  set running(value: boolean) {
    this._running = value;
  }

  get time(): number {
    return this._time;
  }

  set time(value: number) {
    this._time = value;
  }

  /**
   * Serialize for JSON.
   * @return simulation object
   */
  toJSON(): any {
    const simulation: any = {
      kernel: this._kernel.toJSON(),
      time: this._time,
    };
    return simulation;
  }
}
