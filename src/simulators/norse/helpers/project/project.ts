// project.ts

import { BaseProject, ProjectProps } from "@/helpers/project/project";

import { NorseNetwork, NorseNetworkProps } from "../network/network";
import {
  NorseSimulation,
  NorseSimulationProps,
} from "../simulation/simulation";
import { useNorseModelDBStore } from "../../store/model/modelDBStore";
import { useNorseProjectStore } from "../../store/project/projectStore";

export interface NorseProjectProps extends ProjectProps {
  network?: NorseNetworkProps;
  simulation?: NorseSimulationProps;
}

export class NorseProject extends BaseProject {
  constructor(project: NorseProjectProps = {}) {
    super(project);
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable;
   */
  clone(): NorseProject {
    this.logger.trace("clone");
    const newProject = new NorseProject({
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
  duplicate(): NorseProject {
    this.logger.trace("duplicate");
    const newProject: NorseProject = this.clone();
    this.projectStore.db.addProject(newProject);
    return newProject;
  }

  /**
   * Initialize store for Norse.
   */
  override initStore(): void {
    this.modelDBStore = useNorseModelDBStore();
    // this.projectStore = useNorseProjectStore();
  }

  override newNetwork(data?: NorseNetworkProps): NorseNetwork {
    return new NorseNetwork(this, data);
  }

  override newSimulation(data?: NorseSimulationProps): NorseSimulation {
    return new NorseSimulation(this, data);
  }
}
