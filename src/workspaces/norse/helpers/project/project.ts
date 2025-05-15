// project.ts

import { INetworkProjectProps, NetworkProject } from "@/helpers/project/networkProject";

import { INorseNetworkProps, NorseNetwork } from "../network/network";
import { INorseSimulationProps, NorseSimulation } from "../simulation/simulation";
import { NorseCode } from "../code/code";
import { NorseNode } from "../node/node";
import { NorseSimulationCode } from "../simulation/simulationCode";
import { useNorseModelDBStore } from "../../stores/model/modelDBStore";

const codeGraph: boolean = true;

export interface INorseProjectProps extends INetworkProjectProps {
  network?: INorseNetworkProps;
  simulation?: INorseSimulationProps;
}

export class NorseProject extends NetworkProject {
  constructor(projectProps: INorseProjectProps = {}) {
    super(projectProps);
  }

  override get Code() {
    return codeGraph ? NorseCode : NorseSimulationCode;
  }

  override get Network() {
    return NorseNetwork;
  }

  override get Simulation() {
    return NorseSimulation;
  }

  override get code(): NorseCode | NorseSimulationCode {
    return codeGraph ? (this._code as NorseCode) : (this._code as NorseSimulationCode);
  }

  override get network(): NorseNetwork {
    return this._network as NorseNetwork;
  }

  override get simulation(): NorseSimulation {
    return this._simulation as NorseSimulation;
  }

  /**
   * Generate simulation code.
   * @remarks It generates node codes.
   */
  override generateCode(): void {
    this.network.nodes.nodeItems.forEach((node: NorseNode) => node.renderNodeCode());
    this.code.generate();
  }

  /**
   * Initialize model store for Norse.
   */
  override initModelStore(): void {
    this.modelDBStore = useNorseModelDBStore();
  }
}
