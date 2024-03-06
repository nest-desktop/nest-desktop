// project.ts

import { BaseProject, ProjectProps } from "@/helpers/project/project";

import { NorseNetwork, NorseNetworkProps } from "../network/network";
import {
  NorseSimulation,
  NorseSimulationProps,
} from "../simulation/simulation";
import { useNorseModelDBStore } from "../../stores/model/modelDBStore";
import { NorseNode } from "../node/node";

export interface NorseProjectProps extends ProjectProps {
  network?: NorseNetworkProps;
  simulation?: NorseSimulationProps;
}

export class NorseProject extends BaseProject {
  constructor(project: NorseProjectProps = {}) {
    super(project);
  }

  override get network(): NorseNetwork {
    return this._network as NorseNetwork;
  }

  override get simulation(): NorseSimulation {
    return this._simulation as NorseSimulation;
  }

  /**
   * Observer for network changes
   *
   * @remarks
   * It updates hash of the network.
   * It generates simulation code in the code editor.
   * It commits the network in the network history.
   */
  override changes(): void {
    this.state.updateHash();
    this.state.checkChanges();

    this.logger.trace("changes");
    this.activities.checkRecorders();

    this.network.nodes.all.forEach((node: NorseNode) => node.generateCode());
    this._simulation.code.generate();

    // Simulate when the configuration is set
    // and the view mode is activity explorer.
    // const projectView = this._project.app.project.view;
    // if (
    //   projectView.config.simulateAfterChange &&
    //   projectView.state.modeIdx === 1
    // ) {
    //   nextTick(() => this.startSimulation());
    // }
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
