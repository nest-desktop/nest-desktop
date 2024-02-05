// project.ts

import { BaseProject, ProjectProps } from "@/helpers/project/project";

import { Insite } from "../insite/insite";
import { NESTNetwork, NESTNetworkProps } from "../network/network";
import {
  NESTSimulation,
  NESTSimulationProps,
} from "../simulation/simulation";
import { useNESTModelDBStore } from "../../stores/model/modelDBStore";

export interface NESTProjectProps extends ProjectProps {
  network?: NESTNetworkProps;
  simulation? : NESTSimulationProps;
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
   * Initialize store for NEST.
   */
  override initStore(): void {
    this.modelDBStore = useNESTModelDBStore();
  }

  override newNetwork(data?: NESTNetworkProps): NESTNetwork {
    return new NESTNetwork(this, data);
  }

  override newSimulation(data?: NESTSimulationProps): NESTSimulation {
    return new NESTSimulation(this, data);
  }
}
