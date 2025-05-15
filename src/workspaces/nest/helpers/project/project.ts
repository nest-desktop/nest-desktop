// project.ts

import { INetworkProjectProps, NetworkProject } from "@/helpers/project/networkProject";

import { INESTNetworkProps, NESTNetwork } from "../network/network";
import { INESTSimulationProps, NESTSimulation } from "../simulation/simulation";
import { Insite } from "../insite/insite";
import { NESTActivityGraph } from "../activityGraph/activityGraph";
import { NESTCode } from "../code/code";
import { NESTSimulationCode } from "../simulation/simulationCode";
import { useNESTModelDBStore } from "../../stores/model/modelDBStore";

const codeGraph: boolean = true;

export interface INESTProjectProps extends INetworkProjectProps {
  network?: INESTNetworkProps;
  simulation?: INESTSimulationProps;
}

export class NESTProject extends NetworkProject {
  private _insite: Insite;

  constructor(projectProps: INESTProjectProps = {}) {
    super(projectProps);

    this._insite = new Insite(this);
  }

  override get ActivityGraph() {
    return NESTActivityGraph;
  }

  override get Code() {
    return codeGraph ? NESTCode : NESTSimulationCode;
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

  override get code(): NESTCode | NESTSimulationCode {
    return codeGraph ? (this._code as NESTCode) : (this._code as NESTSimulationCode);
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
   * Initialize model store for NEST.
   */
  override initModelStore(): void {
    this.modelDBStore = useNESTModelDBStore();
  }
}
