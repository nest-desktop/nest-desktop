// project.ts

import { registerNESTNodeTypes } from "@/codeGraph/codeNodeTypes/nest";
import { type INetworkProjectState, NetworkProject } from "@/helpers/project/networkProject";

import nestSimulator from "../../stores/backends/nestSimulatorStore";
import { NESTActivityGraph } from "../../activityGraph/helpers/activityGraph";
import { type INESTNetworkState, NESTNetwork } from "../../networkGraph/helpers/network/network";
import { type INESTSimulationState, NESTSimulation } from "../simulation/simulation";
import { useNESTModelDBStore } from "../../stores/model/modelDBStore";

export interface INESTProjectState extends INetworkProjectState {
  network?: INESTNetworkState;
  simulation?: INESTSimulationState;
}

export class NESTProject extends NetworkProject<INESTProjectState> {
  constructor(projectState: INESTProjectState = {}) {
    super(projectState);

    this.simulation.registerBackend(nestSimulator);
    registerNESTNodeTypes(this.viewModel);
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
