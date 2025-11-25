// project.ts

import { type INetworkProjectState, NetworkProject } from "@/helpers/project/networkProject";
import { registerNorseNodeTypes } from "@/codeGraph/codeNodeTypes/norse";

import norseSimulator from "../../stores/backends/norseSimulatorStore";
import { type INorseNetworkState, NorseNetwork } from "../../networkGraph/helpers/network/network";
import { type INorseSimulationState, NorseSimulation } from "../simulation/simulation";
import { useNorseModelDBStore } from "../../stores/model/modelDBStore";

export interface INorseProjectState extends INetworkProjectState {
  network?: INorseNetworkState;
  simulation?: INorseSimulationState;
}

export class NorseProject extends NetworkProject {
  constructor(projectState: INorseProjectState = {}) {
    super(projectState);

    this.simulation.registerBackend(norseSimulator);
    registerNorseNodeTypes(this.viewModel);
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
    return this._simulation;
  }

  // /**
  //  * Generate simulation code.
  //  * @remarks It generates node codes.
  //  */
  // override generateCode(): void {
  //   this.network.nodes.nodeItems.forEach((node: NorseNode) => node.renderNodeCode());
  //   this.code.generate();
  // }

  /**
   * Initialize model store for Norse.
   */
  override initModelStore(): void {
    this.modelDBStore = useNorseModelDBStore();
  }
}
