// simulationKernel.ts

import type { CodeNodeInterface } from "@babsey/code-graph";

import type { IBaseState } from "@/helpers/common";
import { CodeNodeMask } from "@/codeGraph/helpers/codeNodeMask";
import { getNESTSetKernelStatusParameterNode } from "@/codeGraph/codeNodeTypes/nest/nestSetKernelStatus";

import type { NESTSimulation } from "./simulation";

export interface INESTSimulationKernelState extends IBaseState {
  resolution?: number;
  localNumThreads?: number;
  rngSeed?: number;
}

export class NESTSimulationKernel extends CodeNodeMask {
  private _simulation: NESTSimulation; // parent

  constructor(simulation: NESTSimulation) {
    super({
      config: { name: "NESTSimulationKernel", simulator: "nest" },
    });

    this._simulation = simulation;
  }

  get localNumThreads(): CodeNodeInterface | undefined {
    return this.intf?.local_num_threads;
  }

  get rngSeed(): CodeNodeInterface | undefined {
    return this.intf?.rng_seed;
  }

  get resolution(): CodeNodeInterface | undefined {
    return this.intf?.resolution;
  }

  get simulation(): NESTSimulation {
    return this._simulation;
  }

  /**
   * Initialize simulation kernel.
   */
  init(): void {
    this.registerCodeNode();
    this.updateHash();
  }

  /**
   * Register code node.
   */
  override registerCodeNode(): void {
    this.codeNode = getNESTSetKernelStatusParameterNode(this.simulation.project.viewModel.editor.graph);
    this.codeNode.mask = this;
  }

  /**
   * Save simulation kernel state.
   * @return simulation kernel state
   */
  override save(): INESTSimulationKernelState {
    return {
      localNumThreads: this.localNumThreads?.value,
      resolution: this.resolution?.value,
      rngSeed: this.rngSeed?.value,
    };
  }
}
