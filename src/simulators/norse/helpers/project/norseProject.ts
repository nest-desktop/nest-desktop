// norseProject.ts

import { BaseProject, ProjectProps } from "@/helpers/project/baseProject";

import { useNorseModelDBStore } from "@norse/store/model/norseModelDBStore";
import { useNorseProjectDBStore } from "@norse/store/project/norseProjectDBStore";
import { useNorseProjectStore } from "@norse/store/project/norseProjectStore";

import { NorseNetwork, NorseNetworkProps } from "../network/norseNetwork";
import {
  NorseSimulation,
  NorseSimulationProps,
} from "../simulation/norseSimulation";

export interface NorseProjectProps extends ProjectProps {
  network?: NorseNetworkProps;
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
    this.projectDBStore.addProject(newProject);
    return newProject;
  }

  /**
   * Initialize store for Norse.
   */
  override initStore(): void {
    this.modelStore = useNorseModelDBStore();
    this.projectDBStore = useNorseProjectDBStore();
    this.projectStore = useNorseProjectStore();
  }

  override newNetwork(data?: NorseNetworkProps): NorseNetwork {
    return new NorseNetwork(this, data);
  }

  override newSimulation(data?: NorseSimulationProps): NorseSimulation {
    return new NorseSimulation(this, data);
  }
}
