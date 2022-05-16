import { reactive, UnwrapRef } from '@vue/composition-api';

import { Config } from '../common/config';
import { Project } from '../project/project';
import { SimulationKernel } from './simulationKernel';
import { SimulationCode } from './simulationCode';

export class Simulation extends Config {
  private _code: SimulationCode;
  private _kernel: SimulationKernel; // simulation kernel
  private _project: Project; // parent
  private _running = false;
  private _state: UnwrapRef<any>;
  private _time: number; // simulation time

  constructor(project: Project, simulation: any = {}) {
    super('Simulation');
    this._project = project;

    // Initialize code, kernel and time.
    this._code = new SimulationCode(this, simulation.code);
    this._kernel = new SimulationKernel(this, simulation.kernel);
    this._time = simulation.time != null ? parseFloat(simulation.time) : 1000;

    // Initialize simulation state.
    this._state = reactive({
      biologicalTime: 0,
      timeInfo: {
        begin: 0,
        current: 0,
        end: 0,
        stepSize: 1,
      },
    });
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

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get time(): number {
    return this._time;
  }

  set time(value: number) {
    this._time = value;
  }

  get timeFixed(): string {
    return this._time.toFixed(1);
  }

  /**
   * Reset state in simulation
   */
  resetState(): void {
    // Reset simulation state.
    this._state.biologicalTime = 0;
    this._state.timeInfo = {
      begin: 0,
      current: 0,
      end: 0,
      stepSize: 1,
    };
  }

  /**
   * Serialize for JSON.
   * @return simulation object
   */
  toJSON(): any {
    const simulation: any = {
      code: this._code.toJSON(),
      kernel: this._kernel.toJSON(),
      time: this._time,
    };
    return simulation;
  }
}
