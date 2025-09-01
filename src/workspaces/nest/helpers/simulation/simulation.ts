// simulation.ts

import { BaseSimulation } from "@/helpers/simulation/simulation";

import { INESTSimulationKernelProps, NESTSimulationKernel } from "./simulationKernel";
import { NESTProject } from "../project/project";
import { loadNESTInstallNodes } from "../codeNodeTypes/nest/nestInstall";

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
    this._kernel = new NESTSimulationKernel(this);
  }

  get kernel(): NESTSimulationKernel {
    return this._kernel;
  }

  get modules(): string[] {
    return this._modules;
  }

  set modules(value: string[]) {
    this._modules = value;
    loadNESTInstallNodes(this.project.code.graph, this._modules);
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

    if (this.kernel.config?.localStorage.autoRNGSeed) {
      this.kernel.rngSeed = Math.round(Math.random() * 1000);
      this.onUpdate();
    }
  }

  /**
   * Serialize for JSON.
   * @return simulation object
   */
  override toJSON(): INESTSimulationProps {
    const simulationProps: INESTSimulationProps = {
      kernel: this.kernel.toJSON(),
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
      kernel: this.kernel.toJSON(),
      time: this.time,
    });
  }
}
