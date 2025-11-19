// simulation.ts

import type { CodeNodeInterface } from "@babsey/code-graph";

import { BaseSimulation } from "@/helpers/simulation/simulation";
import { getNESTSimulateNode } from "@/codeGraph/codeNodeTypes/nest/nestSimulate";

import { type INESTSimulationKernelProps, NESTSimulationKernel } from "./simulationKernel";
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
    this.props = simulationProps;
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
   * Serialize for JSON.
   * @return simulation object
   */
  override toJSON(): INESTSimulationProps {
    const simulationProps: INESTSimulationProps = {
      kernel: this.kernel.toJSON(),
      time: this.time?.value,
    };

    if (this.modules.length > 0) simulationProps.modules = this.modules;

    return simulationProps;
  }
}
