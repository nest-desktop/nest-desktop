// simulation.ts

import { openToast } from "@/helpers/common/toast";
import { BaseSimulation } from "@/helpers/simulation/simulation";

import { NESTProject } from "../project/project";
import { INESTSimulationCodeProps, NESTSimulationCode } from "./simulationCode";
import {
  INESTSimulationKernelProps,
  NESTSimulationKernel,
} from "./simulationKernel";
import { useNESTSimulatorStore } from "../../stores/backends/nestSimulatorStore";

export interface INESTSimulationProps {
  code?: INESTSimulationCodeProps;
  kernel?: INESTSimulationKernelProps;
  time?: number;
}

export class NESTSimulation extends BaseSimulation {
  private _kernel: NESTSimulationKernel; // simulation kernel

  constructor(
    project: NESTProject,
    simulationProps: INESTSimulationProps = {}
  ) {
    super(project, simulationProps);
    this._kernel = new NESTSimulationKernel(this, simulationProps.kernel);
  }

  override get SimulationCode() {
    return NESTSimulationCode;
  }

  override get code(): NESTSimulationCode {
    return this._code as NESTSimulationCode;
  }

  override get project(): NESTProject {
    return this._project as NESTProject;
  }

  get nestSimulator() {
    const nestSimulatorStore = useNESTSimulatorStore();
    return nestSimulatorStore;
  }

  get kernel(): NESTSimulationKernel {
    return this._kernel;
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
  override async run(): Promise<any> {
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
  async runSimulation(): Promise<any> {
    this.logger.trace("run simulation");

    return this.nestSimulator
      .axiosInstance()
      .post("exec", {
        source: this.code.script,
        return: "response",
      })
      .then((response: any) => {
        let data: any;
        switch (response.status) {
          case 0:
            openToast("Failed to find NEST Simulator.", { type: "error" });
            break;
          case 200:
            if (response.data.data == null) {
              break;
            }
            data = response.data.data;

            // Get biological time
            this.state.biologicalTime =
              data.biological_time != null ? data.biological_time : this.time;

            break;
          default:
            openToast(response.data, { type: "error" });
            break;
        }
        return response;
      });
  }

  /**
   * Run simulation with recording backend Insite.
   *
   * @remarks
   * During the simulation it gets and updates activities.
   */
  private async runWithInsite(): Promise<any> {
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
      .then((response: any) => {
        switch (response.status) {
          case 0:
            openToast(
              "Failed to perform simulation (NEST Simulator is not running).",
              { type: "error" }
            );
            this.project.insite.cancelAllIntervals();
            break;
          case 200:
            if (this.code.runSimulation) {
              this.project.insite.simulationEndNotification();
            }
            break;
          default:
            openToast(response.responseText, { type: "error" });
            this.project.insite.cancelAllIntervals();
            break;
        }
        return response;
      })
      .catch((error: any) => {
        this.project.insite.cancelAllIntervals();
        if ("response" in error && error.response.data != undefined) {
          openToast(error.response.data, { type: "error" });
        }
        return error;
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
