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
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable;
   */
  override clone(): PyNNProject {
    this.logger.trace("clone");

    return new PyNNProject({
      ...this.toJSON(),
      id: undefined,
      updatedAt: "",
    });
  }

  /**
   * Initialize model store for PyNN.
   */
  override initModelStore(): void {
    this.modelDBStore = usePyNNModelDBStore();
  }
}
