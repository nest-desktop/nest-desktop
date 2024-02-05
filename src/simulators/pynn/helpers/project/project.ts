// project.ts

import { BaseProject, ProjectProps } from "@/helpers/project/project";

import {
  PyNNSimulation,
  PyNNSimulationProps,
} from "../simulation/simulation";
import { usePyNNModelDBStore } from "../../stores/model/modelDBStore";

export interface PyNNProjectProps extends ProjectProps {
  simulation?: PyNNSimulationProps;
}

export class PyNNProject extends BaseProject {
  constructor(project: PyNNProjectProps = {}) {
    super(project);
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable;
   */
  clone(): PyNNProject {
    this.logger.trace("clone");
    const newProject = new PyNNProject({
      ...this.toJSON(),
      id: undefined,
      updatedAt: "",
    });
    return newProject;
  }

  /**
   * Initialize store for PyNN.
   */
  override initStore(): void {
    this.modelDBStore = usePyNNModelDBStore();
  }

  override newSimulation(data?: PyNNSimulationProps): PyNNSimulation {
    return new PyNNSimulation(this, data);
  }
}
