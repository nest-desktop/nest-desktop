// simulation.ts

import type { CodeNodeInterface } from "@babsey/code-graph";

import type { IBaseState } from "@/core";
import { BaseSimulation } from "@/simulation";

import { getNESTSimulateNode } from "@/codeGraph/codeNodeTypes/nest/nestSimulate";

import { type INESTSimulationKernelState, NESTSimulationKernel } from "./simulationKernel";
import { NESTProject } from "../project";

export interface INESTSimulationState extends IBaseState {
  kernel?: INESTSimulationKernelState;
  time?: number;
  modules?: string[];
}

export class NESTSimulation extends BaseSimulation<INESTSimulationState> {
  private _kernel: NESTSimulationKernel; // simulation kernel

  constructor(project: NESTProject) {
    super(project);
    this._kernel = new NESTSimulationKernel(this);
  }

  get kernel(): NESTSimulationKernel {
    return this._kernel;
  }

  override get project(): NESTProject {
    return this.codeNode?.code?.project ?? (this._project as NESTProject);
  }

  get time(): CodeNodeInterface | undefined {
    return this.intf?.t;
  }

  override beforeSimulation(): void {
    this.logger.trace("before simulation");

    this.generateSeed();
  }

  /**
   * Initialize simulation.
   */
  override init(): void {
    this.logger.trace("init");

    this.kernel.init();

    this.registerCodeNode();
    this.updateHash();
  }

  /**
   * Generate seed.
   * @remarks It generates simulation code.
   */
  generateSeed(): void {
    this.logger.trace("generate seed");

    if (this.kernel.config?.localStorage.autoRNGSeed) this.kernel.rngSeed.value = Math.round(Math.random() * 1000);
  }

  /**
   * Register code node.
   */
  override registerCodeNode(): void {
    this.codeNode = getNESTSimulateNode(this.project.viewModel.editor.graph);
    this.codeNode.mask = this;
  }

  /**
   * Save simulation state.
   * @return simulation state
   */
  override save(): INESTSimulationState {
    const simulationState: INESTSimulationState = {
      kernel: this.kernel.save(),
      time: this.time?.value,
    };

    return simulationState;
  }
}
