// simulation.ts

import { AxiosError, AxiosResponse } from "axios";

import { BaseSimulation } from "@/helpers/simulation/simulation";
import { notifyError } from "@/utils/dialog";

import { useNESTSimulatorStore } from "../../stores/backends/nestSimulatorStore";
import { NESTProject } from "../project/project";
import { INESTSimulationCodeProps, NESTSimulationCode } from "./simulationCode";
import {
  INESTSimulationKernelProps,
  NESTSimulationKernel,
} from "./simulationKernel";

export interface INESTSimulationProps {
  code?: INESTSimulationCodeProps;
  kernel?: INESTSimulationKernelProps;
  time?: number;
  modules?: string[];
}

export class NESTSimulation extends BaseSimulation {
  private _kernel: NESTSimulationKernel; // simulation kernel
  private _modules: string[];

  constructor(
    project: NESTProject,
    simulationProps: INESTSimulationProps = {}
  ) {
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
    this.changes();
  }

  get nestSimulator() {
    const nestSimulatorStore = useNESTSimulatorStore();
    return nestSimulatorStore;
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
   *
   * Generate simulation code.
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
   *
   * @remarks
   * It runs the simulation with or without Insite.
   */
  override async run(): Promise<AxiosResponse<any, { data: any }> | void> {
    this.logger.trace("run simulation");

    return this.code.runSimulationInsite
      ? this.runWithInsite()
      : this.runSimulation();
  }

  /**
   * Run simulation.
   *
   * @remarks
   * After the simulation it updates the activities and commits the network.
   */
  async runSimulation(): Promise<AxiosResponse<any, { data: any }>> {
    this.logger.trace("run simulation");

    return this.nestSimulator
      .axiosInstance()
      .post("exec", {
        source: this.code.script,
        return: "response",
      })
      .then(
        (
          response: AxiosResponse<
            any,
            {
              data: {
                events: any[];
                biological_time: number;
              };
              status: number;
            }
          >
        ) => {
          if (response.data.data == null) {
            return response;
          }

          let data: {
            events: any[];
            biological_time: number;
          };
          switch (response.status) {
            case 200:
              data = response.data.data;

              // Get biological time
              this.state.biologicalTime =
                data.biological_time != null ? data.biological_time : this.time;

              break;
          }
          return response;
        }
      );
  }

  /**
   * Run simulation with recording backend Insite.
   *
   * @remarks
   * During the simulation it gets and updates activities.
   */
  private async runWithInsite(): Promise<AxiosResponse<
    any,
    { data: any }
  > | void> {
    this.logger.trace("run simulation with Insite");

    this.state.timeInfo = {
      begin: 0,
      current: 0,
      end: 0,
      stepSize: 1,
    };

    return this.nestSimulator
      .axiosInstance()
      .post("exec", { source: this.code.script })
      .then((response: AxiosResponse<any, { data: any; status: number }>) => {
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
      .catch((error: AxiosError<any, { response: { data: any } }>) => {
        this.project.insite.cancelAllIntervals();
        if ("response" in error && error.response?.data != undefined) {
          notifyError(error.response.data);
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
