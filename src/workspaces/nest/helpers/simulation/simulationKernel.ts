// simulationKernel.ts

import type { CodeNodeInterface } from "@babsey/code-graph";

import { CodeNodeMask } from "@/codeGraph/codeNodeMask";
import { getNESTSetKernelStatusParameterNode } from "@/codeGraph/codeNodeTypes/nest/nestSetKernelStatus";
import type { IParamProps } from "@/codeGraph/codeNodeTypes/nest/nestParameters";

import type { NESTSimulation } from "./simulation";

export interface INESTSimulationKernelProps {
  resolution?: number;
  localNumThreads?: number;
  rngSeed?: number;
}

export class NESTSimulationKernel extends CodeNodeMask {
  private _simulation: NESTSimulation; // parent

  constructor(simulation: NESTSimulation, kernelProps?: Record<string, IParamProps>) {
    super({
      config: { name: "NESTSimulationKernel", simulator: "nest" },
    });

    this._simulation = simulation;
    this.props.value = kernelProps;
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
    this.codeNode = getNESTSetKernelStatusParameterNode(
      this.simulation.project.viewModel.editor.graph,
      this.props.value,
    );
    this.codeNode.mask = this;
  }

  /**
   * Serialize for JSON.
   * @return simulation kernel props
   */
  toJSON(): INESTSimulationKernelProps {
    return {
      localNumThreads: this.localNumThreads?.value,
      resolution: this.resolution?.value,
      rngSeed: this.rngSeed?.value,
    };
  }
}
