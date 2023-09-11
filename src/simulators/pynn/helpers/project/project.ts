// project.ts

import { BaseProject, ProjectProps } from "@/helpers/project/project";

import {
  PyNNSimulation,
  PyNNSimulationProps,
} from "../simulation/simulation";
import { usePyNNModelDBStore } from "../../store/model/modelDBStore";
import { usePyNNProjectDBStore } from "../../store/project/projectDBStore";
import { usePyNNProjectStore } from "../../store/project/projectStore";

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
   * Clone this current project and add it to the list.
   *
   * @remarks
   * It pushes new project to the first line of the list.
   */
  duplicate(): PyNNProject {
    this.logger.trace("duplicate");
    const newProject: PyNNProject = this.clone();
    this.projectDBStore.addProject(newProject);
    return newProject;
  }

  /**
   * Initialize store for PyNN.
   */
  override initStore(): void {
    this.modelStore = usePyNNModelDBStore();
    this.projectDBStore = usePyNNProjectDBStore();
    this.projectStore = usePyNNProjectStore();
  }

  override newSimulation(data?: PyNNSimulationProps): PyNNSimulation {
    return new PyNNSimulation(this, data);
  }
}
