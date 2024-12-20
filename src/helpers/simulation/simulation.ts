// simulation.ts

import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { UnwrapRef, reactive } from "vue";

import { IAxiosErrorData, IAxiosResponseData } from "@/stores/defineBackendStore";
import { TProject, TSimulationCode } from "@/types";

import { BaseObj } from "../common/base";
import { BaseProject } from "../project/project";
import { BaseSimulationCode, ISimulationCodeProps } from "./simulationCode";
import { notifyError, notifySuccess } from "../common/notification";

export interface IResponseProps {
  data: object | string;
  config: object;
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
  error: IAxiosErrorData;
  running: boolean;
  timeInfo: Record<string, number>;
}

export class BaseSimulation extends BaseObj {
  private _state: UnwrapRef<ISimulationState>;
  private _time: number; // simulation time

  public _code: TSimulationCode;
  public _project: BaseProject | TProject; // parent

  constructor(project: BaseProject | TProject, simulationProps: ISimulationProps = {}) {
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
      error: {
        lineNumber: -1,
        message: "",
      },
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

  get project(): BaseProject | TProject {
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
   * Reset error state.
   */
  resetErrorState(): void {
    this._state.error = {
      lineNumber: -1,
      message: "",
    };
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

    this.resetErrorState();
  }

  /**
   * Run simulation.
   * @remarks It sends request to the backend to start the simulation.
   */
  async run(): Promise<void | AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("run simulation");

    const axiosInstance = axios.create();
    return axiosInstance.get<IAxiosResponseData>("");
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
    return this.run()
      .then((response: void | AxiosResponse<IAxiosResponseData>) => {
        switch (response?.status) {
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
      .catch((error: AxiosError<IAxiosErrorData | string>) => {
        if ("response" in error && error.response?.data != undefined) {
          // The request made and the server responded.
          const responseData = error.response.data;
          if (typeof responseData === "string") {
            notifyError(responseData);
            this._state.error.message = responseData as string;
          } else if ("message" in responseData) {
            notifyError(responseData.message as string);
            this._state.error = responseData;
          }
        } else if ("request" in error) {
          // The request was made but no response was received.
          notifyError("Failed to perform simulation (Simulator backend is not running).");
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
    if (this.code.state.customBlocks) simulationProps.code = this.code.toJSON();

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
