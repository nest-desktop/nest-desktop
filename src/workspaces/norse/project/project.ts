// project.ts

import { type INetworkProjectState, NetworkProject } from "@/project";
import { registerNorseNodeTypes } from "@/codeGraph/codeNodeTypes/norse";

import norseSimulator from "../backends/norseSimulator";
import { type INorseNetworkState, NorseNetwork } from "../network";
import { type INorseSimulationState, NorseSimulation } from "../simulation";
import { useNorseModelDBStore } from "../model";

export interface INorseProjectState extends INetworkProjectState {
  network?: INorseNetworkState;
  simulation?: INorseSimulationState;
}

export class NorseProject extends NetworkProject {
  constructor() {
    super();

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

  /**
   * Initialize model store for Norse.
   */
  override initModelStore(): void {
    this.modelDBStore = useNorseModelDBStore();
  }
}
