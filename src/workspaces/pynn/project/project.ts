// project.ts

import { INetworkProjectState, NetworkProject } from "@/project";

import pynnSimulator from "../backends/pynnSimulator";
import { usePyNNModelDBStore } from "../model";

export class PyNNProject extends NetworkProject {
  constructor(projectState: INetworkProjectState = {}) {
    super(projectState);

    this.simulation.registerBackend(pynnSimulator);
  }

  /**
   * Initialize model store for PyNN.
   */
  override initModelStore(): void {
    this.modelDBStore = usePyNNModelDBStore();
  }
}
