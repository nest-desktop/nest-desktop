// baseSimulation.ts - 9 anys

import { reactive, UnwrapRef } from "vue";
import { ILogObj, Logger } from "tslog";

import { openToast } from "@/utils/toast";
import { logger as mainLogger } from "@/utils/logger";
import { Config } from "@/helpers/config";

import { BaseSimulationCode, SimulationCodeProps } from "./baseSimulationCode";
import { sha1 } from "object-hash";

import { Project } from "@/types/projectTypes";

export interface SimulationProps {
  code?: SimulationCodeProps;
  time?: number;
}

interface SimulationState {
  biologicalTime: number;
  hash: string;
  running: boolean;
  timeInfo: { [key: string]: number };
}

export class BaseSimulation extends Config {
  private _code: BaseSimulationCode;
  private _logger: Logger<ILogObj>;
  private _project: Project; // parent
  private _state: UnwrapRef<SimulationState>;
  private _time: number; // simulation time

  constructor(
    project: Project,
    simulation: SimulationProps = {},
    name: string = "Simulation"
  ) {
    super(name);
    this._project = project;

    this._logger = mainLogger.getSubLogger({
      name: `[${this._project.shortId}] simulation`,
      minLevel: 1
    });

    // Initialize time.
    this._time = simulation.time ? simulation.time : 1000;

    // Initialize simulation code.
    this._code = this.newSimulationCode(simulation.code);

    // Initialize simulation state.
    this._state = reactive({
      biologicalTime: 0,
      hash: "",
      running: false,
      timeInfo: {
        begin: 0,
        current: 0,
        end: 0,
        stepSize: 1,
      },
    });
  }

  get code(): BaseSimulationCode {
    return this._code;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get project(): Project {
    return this._project;
  }

  get state(): UnwrapRef<SimulationState> {
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

  changes(): void {
    this.updateHash();
    this._logger.trace("changes");
    this._project.changes();
  }

  // /**
  //  * Generate seed.
  //  *
  //  * Generate simulation code.
  //  *
  //  * @remarks It updates simulation codes.
  //  */
  // generateSeed(): void {
  //   this._logger.trace("generate seed");
  //   if (this._kernel.config.autoRNGSeed) {
  //     this._kernel.rngSeed = Math.round(Math.random() * 1000);
  //     this.changes();
  //   }
  // }

  newSimulationCode(simulationCode?: SimulationCodeProps): BaseSimulationCode {
    return new BaseSimulationCode(this, simulationCode);
  }

  prepare(): void {
    // this.generateSeed();
  }

  /**
   * Reset simulation states.
   */
  resetState(): void {
    this._logger.trace("reset state");
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
    this._logger.trace("run simulation");

  }

  /**
   * Start simulation.
   *
   * @remarks
   * It runs the simulation with or without Insite.
   */
  async start(): Promise<any> {
    this._logger.trace("start");
    this.resetState();

    this.prepare();

    this._state.running = true;
    return this.run()
      .catch((error: any) => {
        if ("response" in error && error.response.data != undefined) {
          // The request made and the server responded.
          openToast(error.response.data, { type: "error" });
        } else if ("request" in error) {
          // The request was made but no response was received.
          openToast(
            "Failed to perform simulation (Simulator backend is not running).",
            { type: "error" }
          );
        } else if ("message" in error && error.message != undefined) {
          // Something happened in setting up the request
          // that triggered an error.
          openToast(error.message, { type: "error" });
        } else {
          openToast(error, { type: "error" });
        }
      })
      .finally(() => {
        this._state.running = false;
      });
  }

  /**
   * Serialize for JSON.
   * @return simulation object
   */
  toJSON(): SimulationProps {
    const simulation: SimulationProps = {
      code: this._code.toJSON(),
      time: this._time,
    };
    return simulation;
  }

  updateHash(): void {
    this._state.hash = sha1({
      time: this._time,
    }).slice(0, 6);
    this._logger.settings.name = `[${this._project.shortId}] simulation #${this._state.hash}`;
  }
}
