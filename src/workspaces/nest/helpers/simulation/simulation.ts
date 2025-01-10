// simulation.ts

import { BaseSimulation } from "@/helpers/simulation/simulation";

import { INESTSimulationKernelProps, NESTSimulationKernel } from "./simulationKernel";
import { NESTProject } from "../project/project";

export interface INESTSimulationProps {
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
   * Serialize for JSON.
   * @return simulation object
   */
  override toJSON(): INESTSimulationProps {
    const simulationProps: INESTSimulationProps = {
      kernel: this._kernel.toJSON(),
      time: this.time,
    };
    if (this._modules.length > 0) simulationProps.modules = this._modules;
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
