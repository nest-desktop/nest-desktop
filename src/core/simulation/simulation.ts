import { reactive, UnwrapRef } from '@vue/composition-api';
import Vue from 'vue';

import { Config } from '../common/config';
import { consoleLog } from '../common/logger';
import { Project } from '../project/project';
import { SimulationKernel } from './simulationKernel';
import { SimulationCode } from './simulationCode';

export class Simulation extends Config {
  private _code: SimulationCode;
  private _kernel: SimulationKernel; // simulation kernel
  private _project: Project; // parent
  private _state: {
    biologicalTime: number;
    running: boolean;
    timeInfo: object;
  };
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
      running: false,
      timeInfo: {
        begin: 0,
        current: 0,
        end: 0,
        stepSize: 1,
      },
    });
  }

  get backends(): any {
    return this._project.app.backends;
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

  consoleLog(text: string): void {
    consoleLog(this, text, 5);
  }

  /**
   *Generate seed and simulation code.
   */
  generateSeed(): void {
    if (this._kernel.config.autoRNGSeed) {
      this._kernel.rngSeed = Math.round(Math.random() * 1000);
      this._code.generate();
    }
  }

  /**
   * Open toast to show message from the backend.
   */
  openToast(message: string, type: string = 'success') {
    const stateToast = this._project.app.project.view.state;
    stateToast.message = message;
    stateToast.type = type;

    // Add click event handler to redirect user to the documentation.
    if (type === 'error') {
      stateToast.message += ' -- Click me for more details.';
      stateToast.onClick = () =>
        window.open(
          'https://nest-desktop.readthedocs.io/en/latest/user/troubleshooting.html#error-messages',
          '_blank'
        );
    }

    // Show NEST or Python error message via toast notification.
    if (stateToast.message) {
      Vue.$toast.open(stateToast);
    }
  }

  /**
   * Reset simulation states.
   */
  resetState(): void {
    this._state.biologicalTime = 0;
    this._state.timeInfo = {
      begin: 0,
      current: 0,
      end: 0,
      stepSize: 1,
    };
  }

  /**
   * Run simulation.
   *
   * @remarks
   * After the simulation it updates the activities and commits the network.
   */
  private async runSimulation(): Promise<any> {
    this.consoleLog('Run simulation');

    return this.backends.nestSimulator.instance
      .post('exec', {
        source: this._code.script,
        return: 'response',
      })
      .then((response: any) => {
        let data: any;
        switch (response.status) {
          case 0:
            this.openToast('Failed to find NEST Simulator.', 'error');
            break;
          case 200:
            if (response.data.data == null) {
              break;
            }
            data = response.data.data;

            // Get biological time
            this.state.biologicalTime =
              data.biological_time != null ? data.biological_time : this._time;

            break;
          default:
            this.openToast(response.data, 'error');
            break;
        }
        return response;
      })
      .catch((error: any) => {
        if ('response' in error && error.response.data != undefined) {
          // The request made and the server responded.
          this.openToast(error.response.data, 'error');
        } else if ('request' in error) {
          // The request was made but no response was received.
          this.openToast(
            'Failed to perform simulation (NEST Simulator is missing).',
            'error'
          );
        } else if ('message' in error && error.message != undefined) {
          // Something happened in setting up the request
          // that triggered an error.
          this.openToast(error.message, 'error');
        } else {
          this.openToast(error, 'error');
        }
      })
      .finally(() => {
        this._state.running = false;
      });
  }

  /**
   * Run simulation with recording backend Insite.
   *
   * @remarks
   * During the simulation it gets and updates activities.
   */
  private async runWithInsite(): Promise<any> {
    this.consoleLog('Run simulation with Insite');

    return this.backends.nestSimulator.instance
      .post('exec', { source: this._code.script })
      .then((response: any) => {
        switch (response.status) {
          case 0:
            this.openToast(
              'Failed to perform simulation (NEST Simulator is missing).',
              'error'
            );
            this._project.insite.cancelGettingActivity();
            break;
          case 200:
            if (this._code.runSimulation) {
              this.backends.insiteAccess.instance
                .get('nest/simulationTimeInfo/')
                .then((response: any) => {
                  // Notify user when the simulation is finished.
                  this.openToast('Simulation is finished.', 'success');
                  this._state.running =
                    response.data.end >
                    response.data.current + response.data.stepSize;
                });
            }
            break;
          default:
            this.openToast(response.responseText, 'error');
            this._project.insite.cancelGettingActivity();
            break;
        }
        return response;
      })
      .catch((error: any) => {
        this._project.insite.cancelGettingActivity();
        if ('response' in error && error.response.data != undefined) {
          this.openToast(error.response.data, 'error');
        }
        return error;
      })
      .finally(() => {
        this._state.running = false;
      });
  }

  /**
   * Start simulation.
   *
   * @remarks
   * It runs the simulation with or without Insite.
   */
  async start(): Promise<any> {
    this.resetState();

    // Generate seed and update simulation code.
    this.generateSeed();

    this._state.running = true;
    return this._code.runSimulationInsite
      ? this.runWithInsite()
      : this.runSimulation();
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
