// project.ts

import { BaseProject, IProjectProps } from "@/helpers/project/project";

import { usePyNNModelDBStore } from "../../stores/model/modelDBStore";
import { IPyNNSimulationProps, PyNNSimulation } from "../simulation/simulation";

export interface IPyNNProjectProps extends IProjectProps {
  simulation?: IPyNNSimulationProps;
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
