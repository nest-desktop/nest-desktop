// simulation.ts

import { AxiosResponse } from "axios";
import { UnwrapRef, reactive } from "vue";

import { IAxiosResponseData, IResponseData } from "@/stores/defineBackendStore";
import { TNetworkProject } from "@/types";

import { BaseObj } from "../common/base";

export interface ISimulationProps {
  time?: number;
}

interface ISimulationState {
  biologicalTime: number;
  running: boolean;
  timeInfo: Record<string, number>;
}

export class BaseSimulation extends BaseObj {
  private _state: UnwrapRef<ISimulationState>;
  private _time: number; // simulation time

  public _project: TNetworkProject; // parent

  constructor(project: TNetworkProject, simulationProps: ISimulationProps = {}) {
    super({
      config: { name: "Simulation" },
      logger: { settings: { minLevel: 3 } },
    });

    this._project = project;

    // Initialize time.
    this._time = simulationProps.time ? simulationProps.time : 1000;

    // Initialize simulation state.
    this._state = reactive<ISimulationState>({
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

  get project(): TNetworkProject {
    return this._project;
  }

  get state(): UnwrapRef<ISimulationState> {
    return this._state;
  }

  get time(): number {
    return this._time;
  }

  set time(value: number) {
    this._time = value;
    this.changes();
  }

  get timeFixed(): string {
    return this._time.toFixed(1);
  }

  beforeSimulation(): void {}

  /**
   * Triggers on simulation changes.
   */
  changes(): void {
    this.updateHash();
    this.logger.trace("changes");

    this.project.changes();
  }

  /**
   * Initialize simulation.
   */
  init(): void {
    this.logger.trace("init");

    this.updateHash();
  }

  // /**
  //  * Generate seed.
  //  *
  //  * Generate simulation code.
  //  *
  //  * @remarks It updates simulation codes.
  //  */
  // generateSeed(): void {
  //   this.logger.trace("generate seed");

  //   if (this._kernel.config.autoRNGSeed) {
  //     this._kernel.rngSeed = Math.round(Math.random() * 1000);
  //     this.changes();
  //   }
  // }

  /**
   * Reset simulation states.
   */
  resetState(): void {
    this.logger.trace("reset state");

    this._state.biologicalTime = 0;
    this._state.timeInfo = {
      begin: 0,
      current: 0,
      end: 0,
      stepSize: 1,
    };
  }

  /**
   * Start simulation.
   * @remarks It sends request to the backend to start the simulation.
   */
  async start(): Promise<void | AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("start");

    this.resetState();
    this.beforeSimulation();

    this._state.running = true;
    return this.project.code
      .runSimulation()
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        let data: IResponseData;

        switch (response.status) {
          case 200:
            data = response.data.data;

            // Get biological time
            this.state.biologicalTime = data.biological_time != null ? data.biological_time : this.time;
            break;
        }
        return response;
      })
      .finally(() => {
        this._state.running = false;
      });
  }

  /**
   * Serialize for JSON.
   * @return simulation props
   */
  toJSON(): ISimulationProps {
    const simulationProps: ISimulationProps = {
      time: this._time,
    };

    return simulationProps;
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      time: this._time,
    });
  }
}
