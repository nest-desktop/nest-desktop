// project.ts

import { type INetworkProjectState, NetworkProject } from "@/project";

import nestSimulator from "../backends/nestSimulator";
import { NESTActivityGraph } from "../activityGraph";
import { registerNESTNodeTypes } from "../codeNodeTypes/nest";
import { type INESTNetworkState, NESTNetwork } from "../network";
import { type INESTSimulationState, NESTSimulation } from "../simulation";
import { useNESTModelDBStore } from "../model";

export interface INESTProjectState extends INetworkProjectState {
  network?: INESTNetworkState;
  simulation?: INESTSimulationState;
}

export class NESTProject extends NetworkProject<INESTProjectState> {
  constructor() {
    super();

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
