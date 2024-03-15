// project.ts

import { BaseProject, IProjectProps } from "@/helpers/project/project";

import { NorseNetwork, INorseNetworkProps } from "../network/network";
import { NorseNode } from "../node/node";
import {
  NorseSimulation,
  INorseSimulationProps,
} from "../simulation/simulation";
import { nextTick } from "vue";
import { useNorseModelDBStore } from "../../stores/model/modelDBStore";
import { useProjectViewStore } from "@/stores/project/projectViewStore";

export interface INorseProjectProps extends IProjectProps {
  network?: INorseNetworkProps;
  simulation?: INorseSimulationProps;
}

export class NorseProject extends BaseProject {
  constructor(projectProps: INorseProjectProps = {}) {
    super(projectProps);
  }

  override get Network() {
    return NorseNetwork;
  }

  override get Simulation() {
    return NorseSimulation;
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
    this.updateHash();
    this.state.checkChanges();

    this.logger.trace("changes");
    this.activities.checkRecorders();

    this.network.nodes.all.forEach((node: NorseNode) => node.generateCode());
    this._simulation.code.generate();

    this.networkRevision.commit();

    // Simulate when the configuration is set
    // and the view mode is activity explorer.
    const projectViewStore = useProjectViewStore();
    if (projectViewStore.state.simulateAfterChange.value) {
      nextTick(() => this.startSimulation());
    }
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable;
   */
  clone(): NorseProject {
    this.logger.trace("clone");
    return new NorseProject({
      ...this.toJSON(),
      id: undefined,
      updatedAt: "",
    });
  }

  /**
   * Initialize model store for Norse.
   */
  override initModelStore(): void {
    this.modelDBStore = useNorseModelDBStore();
  }
}
