// simulation.ts

import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { UnwrapRef, reactive } from "vue";

import { TProject, TSimulationCode } from "@/types";

import { notifyError, notifySuccess } from "../../utils/notification";
import { BaseObj } from "../common/base";
import { BaseSimulationCode, ISimulationCodeProps } from "./simulationCode";

export interface IResponseProps {
  data: Object | string;
  config: Object;
  headers: AxiosHeaders;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}

export interface ISimulationProps {
  code?: ISimulationCodeProps;
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

  public _code: TSimulationCode;
  public _project: TProject; // parent

  constructor(project: TProject, simulationProps: ISimulationProps = {}) {
    super({
      config: { name: "Simulation" },
      logger: { settings: { minLevel: 3 } },
    });

    this._project = project;

    // Initialize time.
    this._time = simulationProps.time ? simulationProps.time : 1000;

    // Initialize simulation code.
    this._code = new this.SimulationCode(this, simulationProps.code);

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

  get SimulationCode() {
    return BaseSimulationCode;
  }

  get code(): TSimulationCode {
    return this._code;
  }

  get project(): TProject {
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

    this._code.init();
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
   * Run simulation.
   *
   * @remarks
   * After the simulation it updates the activities and commits the network.
   */
  async run(): Promise<any> {
    this.logger.trace("run simulation");
  }

  /**
   * Start simulation.
   *
   * @remarks
   * It starts the simulation.
   */
  async start(): Promise<AxiosResponse<any, any> | void> {
    this.logger.trace("start");

    this.resetState();
    this.beforeSimulation();

    this._state.running = true;
    return this.run()
      .then((response: AxiosResponse<any, any>) => {
        switch (response.status) {
          case 0:
            notifyError("Failed to find Simulator.");
            break;
          case 200:
            notifySuccess("Simulation finished.");
            break;
          case 400:
            if (typeof response.data === "string") {
              notifyError(response.data);
            }
            break;
          default:
            break;
        }
        return response;
      })
      .catch((error: AxiosError<any, any>) => {
        if ("response" in error && error.response?.data != undefined) {
          // The request made and the server responded.
          if (typeof error.response.data === "string") {
            notifyError(error.response.data);
          }
        } else if ("request" in error) {
          // The request was made but no response was received.
          notifyError(
            "Failed to perform simulation (Simulator backend is not running)."
          );
        } else if ("message" in error && error.message != undefined) {
          // Something happened in setting up the request
          // that triggered an error.
          notifyError(error.message);
        }
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
    if (this.code.state.customBlocks) {
      simulationProps.code = this.code.toJSON();
    }
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
