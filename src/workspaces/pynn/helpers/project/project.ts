// project.ts

import { INetworkProjectState, NetworkProject } from "@/helpers/project/networkProject";

import pynnSimulator from "../../stores/backends/pynnSimulatorStore";
import { usePyNNModelDBStore } from "../../stores/model/modelDBStore";

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
