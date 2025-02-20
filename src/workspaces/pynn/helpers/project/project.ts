// project.ts

import { INetworkProjectProps, NetworkProject } from "@/helpers/project/networkProject";

import { PyNNSimulationCode } from "../simulation/simulationCode";
import { usePyNNModelDBStore } from "../../stores/model/modelDBStore";

export class PyNNProject extends NetworkProject {
  constructor(projectProps: INetworkProjectProps = {}) {
    super(projectProps);
  }

  override get Code() {
    return PyNNSimulationCode;
  }

  override get code(): PyNNSimulationCode {
    return this._code as PyNNSimulationCode;
  }

  /**
   * Initialize model store for PyNN.
   */
  override initModelStore(): void {
    this.modelDBStore = usePyNNModelDBStore();
  }
}
