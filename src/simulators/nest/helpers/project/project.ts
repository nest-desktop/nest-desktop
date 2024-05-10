// project.ts

import { BaseProject, IProjectProps } from "@/helpers/project/project";

import { INESTNetworkProps, NESTNetwork } from "../network/network";
import { INESTSimulationProps, NESTSimulation } from "../simulation/simulation";
import { Insite } from "../insite/insite";
import { NESTActivityGraph } from "../activity/activityGraph";
import { useNESTModelDBStore } from "../../stores/model/modelDBStore";

export interface INESTProjectProps extends IProjectProps {
  network?: INESTNetworkProps;
  simulation?: INESTSimulationProps;
}

export class NESTProject extends BaseProject {
  private _insite: Insite; // insite

  constructor(projectProps: INESTProjectProps = {}) {
    super(projectProps);
    this._insite = new Insite(this);
  }

  override get ActivityGraph() {
    return NESTActivityGraph;
  }

  override get Network() {
    return NESTNetwork;
  }

  override get Simulation() {
    return NESTSimulation;
  }

  override get activityGraph(): NESTActivityGraph {
    return this._activityGraph as NESTActivityGraph;
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

    return new NESTProject({
      ...this.toJSON(),
      id: undefined,
      updatedAt: "",
    });
  }

  /**
   * Initialize model store for NEST.
   */
  override initModelStore(): void {
    this.modelDBStore = useNESTModelDBStore();
  }
}
