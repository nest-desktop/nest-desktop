// project.ts

import { BaseProject, IProjectProps } from "@/helpers/project/project";
import { ISimulationProps } from "@/helpers/simulation/simulation";

import { usePyNNModelDBStore } from "../../stores/model/modelDBStore";
import { PyNNSimulation } from "../simulation/simulation";

export interface IPyNNProjectProps extends IProjectProps {
  simulation?: ISimulationProps;
}

export class PyNNProject extends BaseProject {
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
  clone(): PyNNProject {
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
