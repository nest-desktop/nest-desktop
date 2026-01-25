// simulation.ts

import type { AxiosResponse } from "axios";
import { type UnwrapRef, reactive } from "vue";

import type { IAxiosResponseData, IResponseData } from "@/backends";
import type { TNetworkProject } from "@/types";
import { type IBackendStore, CodeNodeMask } from "@/codeGraph";

import type { IBaseState } from "../core";
import { SimulationHandler } from "./simulationHandler";

export interface ISimulationState extends IBaseState {
  time?: number;
}

interface ISimulationRefState {
  biologicalTime: number;
  running: boolean;
  timeInfo: Record<string, number>;
}

export class BaseSimulation<T = ISimulationState> extends CodeNodeMask<T> {
  private _handler: SimulationHandler;
  private _state: UnwrapRef<ISimulationRefState>;
  private _time: number = 1000; // simulation time

  public _project: TNetworkProject; // parent

  constructor(project: TNetworkProject) {
    super({ config: { name: "Simulation" } });

    this._project = project;

    this._handler = new SimulationHandler();

    // Initialize simulation state.
    this._state = reactive<ISimulationRefState>({
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

  /**
   * before Simulation.
   */
  beforeSimulation(): void {}

  /**
   * Initialize simulation.
   */
  init(): void {
    this.logger.trace("init");

    // this.updateHash();
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

  //   if (this.kernel.config.autoRNGSeed) {
  //     this.kernel.rngSeed = Math.round(Math.random() * 1000);
  //   }
  // }

  /**
   * Register backend
   * @param backend Backend store
   */
  registerBackend(backend: IBackendStore): void {
    this.handler.backend = backend;
  }

  /**
   * Reset simulation states.
   */
  resetState(): void {
    this.logger.trace("reset state");

    this.state.biologicalTime = 0;
    this.state.timeInfo = {
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

    this.state.running = true;
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
        this.state.running = false;
      });
  }

  /**
   * Save simulation to state.
   * @return simulation state
   */
  override save(): ISimulationState {
    return {
      time: this.time,
    };
  }
}
