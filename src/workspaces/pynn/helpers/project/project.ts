// project.ts

import { INetworkProjectProps, NetworkProject } from "@/helpers/project/networkProject";
import { ISimulationProps } from "@/helpers/simulation/simulation";

import { PyNNSimulation } from "../simulation/simulation";
import { usePyNNModelDBStore } from "../../stores/model/modelDBStore";

export interface IPyNNProjectProps extends INetworkProjectProps {
  simulation?: ISimulationProps;
}

export class PyNNProject extends NetworkProject {
  constructor(projectProps: IPyNNProjectProps = {}) {
    super(projectProps);
  }

  override get Simulation() {
    return PyNNSimulation;
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
