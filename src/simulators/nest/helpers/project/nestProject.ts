// nestProject.ts

import { BaseProject, ProjectProps } from "@/helpers/project/baseProject";

import { useNESTModelDBStore } from "@nest/store/model/nestModelDBStore";
import { useNESTProjectDBStore } from "@nest/store/project/nestProjectDBStore";
import { useNESTProjectStore } from "@nest/store/project/nestProjectStore";

import { Insite } from "../insite/insite";
import { NESTNetwork, NESTNetworkProps } from "../network/nestNetwork";
import {
  NESTSimulation,
  NESTSimulationProps,
} from "../simulation/nestSimulation";

export interface NESTProjectProps extends ProjectProps {
  network?: NESTNetworkProps;
}

export class NESTProject extends BaseProject {
  private _insite: Insite; // insite

  constructor(project: NESTProjectProps = {}) {
    super(project);
    this._insite = new Insite(this);
  }

  get insite(): Insite {
    return this._insite;
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  override get simulation(): NESTSimulation {
    return this._simulation as NESTSimulation;
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable;
   */
  override clone(): NESTProject {
    this.logger.trace("clone");
    const newProject = new NESTProject({
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
  override duplicate(): NESTProject {
    this.logger.trace("duplicate");
    const newProject: NESTProject = this.clone();
    this.projectDBStore.addProject(newProject.toJSON());
    return newProject;
  }

  /**
   * Initialize store for NEST.
   */
  override initStore(): void {
    this.modelStore = useNESTModelDBStore();
    this.projectDBStore = useNESTProjectDBStore();
    this.projectStore = useNESTProjectStore();
  }

  override newNetwork(data?: NESTNetworkProps): NESTNetwork {
    return new NESTNetwork(this, data);
  }

  override newSimulation(data?: NESTSimulationProps): NESTSimulation {
    return new NESTSimulation(this, data);
  }
}
