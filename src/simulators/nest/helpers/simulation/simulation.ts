// simulation.ts

import { AxiosError, AxiosResponse } from "axios";

import { BaseSimulation } from "@/helpers/simulation/simulation";
import { IAxiosErrorData, IAxiosResponseData, IResponseData } from "@/stores/defineBackendStore";
import { ISimulationCodeProps } from "@/helpers/simulation/simulationCode";
import { notifyError } from "@/helpers/common/notification";

import nest from "../../stores/backends/nestSimulatorStore";
import { NESTProject } from "../project/project";
import { NESTSimulationCode } from "./simulationCode";
import { INESTSimulationKernelProps, NESTSimulationKernel } from "./simulationKernel";

export interface INESTSimulationProps {
  code?: ISimulationCodeProps;
  kernel?: INESTSimulationKernelProps;
  time?: number;
  modules?: string[];
}

export class NESTSimulation extends BaseSimulation {
  private _kernel: NESTSimulationKernel; // simulation kernel
  private _modules: string[];

  constructor(project: NESTProject, simulationProps: INESTSimulationProps = {}) {
    super(project, simulationProps);
    this._modules = simulationProps.modules || [];
    this._kernel = new NESTSimulationKernel(this, simulationProps.kernel);
  }

  override get SimulationCode() {
    return NESTSimulationCode;
  }

  override get code(): NESTSimulationCode {
    return this._code as NESTSimulationCode;
  }

  get kernel(): NESTSimulationKernel {
    return this._kernel;
  }

  get modules(): string[] {
    return this._modules;
  }

  set modules(value: string[]) {
    this._modules = value;
  }

  override get project(): NESTProject {
    return this._project as NESTProject;
  }

  override beforeSimulation(): void {
    this.logger.trace("before simulation");

    this.generateSeed();
  }

  /**
   * Generate seed.
   * @remarks It generates simulation code.
   */
  generateSeed(): void {
    this.logger.trace("generate seed");

    if (this._kernel.config?.localStorage.autoRNGSeed) {
      this._kernel.rngSeed = Math.round(Math.random() * 1000);
      this.changes();
    }
  }

  /**
   * Run simulation.
   * @remarks It runs the simulation with or without Insite.
   */
  override async run(): Promise<void | AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("run simulation");

    return this.code.runSimulationInsite ? this.runWithInsite() : this.runSimulation();
  }

  /**
   * Run simulation.
   */
  async runSimulation(): Promise<void | AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("run simulation");

    return nest
      .simulate({ source: this.code.script, return: "response" })
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        if (response.data.data == null) return response;

        let data: IResponseData;
        switch (response.status) {
          case 200:
            data = response.data.data;

            // Get biological time
            this.state.biologicalTime = data.biological_time != null ? data.biological_time : this.time;
            break;
        }
        return response;
      });
  }

  /**
   * Run simulation with recording backend Insite.
   * @remarks During the simulation it gets and updates activities.
   */
  private async runWithInsite(): Promise<void | AxiosResponse<IAxiosResponseData>> {
    this.logger.trace("run simulation with Insite");

    this.state.timeInfo = {
      begin: 0,
      current: 0,
      end: 0,
      stepSize: 1,
    };

    return nest
      .simulate({ source: this.code.script })
      .then((response: AxiosResponse<IAxiosResponseData>) => {
        switch (response.status) {
          case 200:
            if (this.code.runSimulation) {
              this.project.insite.simulationEndNotification();
            }
            break;
          default:
            notifyError("Failed to find NEST simulation instance.");
            this.project.insite.cancelAllIntervals();
            break;
        }
        return response;
      })
      .catch((error: AxiosError<IAxiosErrorData | string>) => {
        this.project.insite.cancelAllIntervals();
        if ("response" in error && error.response?.data != undefined) {
          notifyError(error.response.data as string);
        }
      });
  }

  /**
   * Serialize for JSON.
   * @return simulation object
   */
  override toJSON(): INESTSimulationProps {
    const simulationProps: INESTSimulationProps = {
      kernel: this._kernel.toJSON(),
      time: this.time,
    };
    if (this.code.state.customBlocks) {
      simulationProps.code = this.code.toJSON();
    }
    if (this._modules.length > 0) {
      simulationProps.modules = this._modules;
    }
    return simulationProps;
  }

  /**
   * Update hash.
   */
  override updateHash(): void {
    this._updateHash({
      kernel: this._kernel.toJSON(),
      time: this.time,
    });
  }
}
