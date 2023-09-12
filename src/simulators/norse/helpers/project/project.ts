// project.ts

import { BaseProject, ProjectProps } from "@/helpers/project/project";

import { NorseNetwork, NorseNetworkProps } from "../network/network";
import {
  NorseSimulation,
  NorseSimulationProps,
} from "../simulation/simulation";
import { useNorseModelDBStore } from "../../store/model/modelDBStore";

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
   * Initialize store for Norse.
   */
  override initStore(): void {
    this.modelDBStore = useNorseModelDBStore();
  }

  override newNetwork(data?: NorseNetworkProps): NorseNetwork {
    return new NorseNetwork(this, data);
  }

  override newSimulation(data?: NorseSimulationProps): NorseSimulation {
    return new NorseSimulation(this, data);
  }
}
