// simulation.ts

import type { AxiosResponse } from "axios";
import { type UnwrapRef, reactive } from "vue";

import type { IAxiosResponseData, IResponseData } from "@/stores/defineBackendStore";
import type { IBackendStore } from "@/codeGraph/codeHandler";
import type { TNetworkProject } from "@/types";

import { BaseObj } from "../common/base";
import { SimulationHandler } from "./simulationHandler";

export interface ISimulationProps {
  time?: number;
}

interface ISimulationState {
  biologicalTime: number;
  running: boolean;
  timeInfo: Record<string, number>;
}

export class BaseSimulation extends BaseObj {
  private _handler: SimulationHandler;
  private _state: UnwrapRef<ISimulationState>;
  private _time: number; // simulation time

  public _project: TNetworkProject; // parent

  constructor(project: TNetworkProject, simulationProps: ISimulationProps = {}) {
    super({
      config: { name: "Simulation" },
    });

    this._project = project;

    // Initialize time.
    this._time = simulationProps.time ? simulationProps.time : 1000;

    this._handler = new SimulationHandler();

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

  get handler(): SimulationHandler {
    return this._handler;
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
  changes(props = {}): void {
    this.updateHash();
    this.logger.trace("changes");

    this.project.changes(props);
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

  registerBackend(backend: IBackendStore): void {
    this.handler.backend = backend;
  }

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
  async start(script: string): Promise<void | AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("start");

    this.resetState();
    this.beforeSimulation();

    this._state.running = true;
    return this.handler
      .run(script)
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        if (!response) return response;

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
