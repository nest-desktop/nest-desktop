// project.ts

import { type INetworkProjectProps, NetworkProject } from "@/networkGraph/helpers/network/networkProject";

import norseSimulator from "../../stores/backends/norseSimulatorStore";
import { type INorseNetworkProps, NorseNetwork } from "../../networkGraph/helpers/network/network";
import { type INorseSimulationProps, NorseSimulation } from "../simulation/simulation";
import { useNorseModelDBStore } from "../../stores/model/modelDBStore";

export interface INorseProjectProps extends INetworkProjectProps {
  network?: INorseNetworkProps;
  simulation?: INorseSimulationProps;
}

export class NorseProject extends NetworkProject {
  constructor(projectProps: INorseProjectProps = {}) {
    super(projectProps);

    this.simulation.registerBackend(norseSimulator);
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
