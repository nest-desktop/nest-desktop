// project.ts

import { BaseProject, IProjectProps } from "@/helpers/project/project";

import { useNorseModelDBStore } from "../../stores/model/modelDBStore";
import { INorseNetworkProps, NorseNetwork } from "../network/network";
import { NorseNode } from "../node/node";
import { INorseSimulationProps, NorseSimulation } from "../simulation/simulation";

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
   * Generate codes
   *
   * @remarks
   * It generates node codes.
   * It generates simulation code in the code editor.
   */
  override generateCodes(): void {
    this.network.nodes.nodeItems.forEach((node: NorseNode) => node.renderNodeCode());
    this._simulation.code.generate();
  }

  /**
   * Clone a new project of this current project.
   *
   * @remarks
   * It generates new project id and empties updatedAt variable;
   */
  override clone(): NorseProject {
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
