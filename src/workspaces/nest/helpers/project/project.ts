// project.ts

import { type INetworkProjectProps, NetworkProject } from "@/helpers/network/networkProject";

import nestSimulator from "../../stores/backends/nestSimulatorStore";
import { NESTActivityGraph } from "../activityGraph/activityGraph";
import { registerNESTNodeTypes } from "@/codeGraph/codeNodeTypes/nest";
import { type INESTNetworkProps, NESTNetwork } from "../network/network";
import { type INESTSimulationProps, NESTSimulation } from "../simulation/simulation";
import { useNESTModelDBStore } from "../../stores/model/modelDBStore";

export interface INESTProjectProps extends INetworkProjectProps {
  network?: INESTNetworkProps;
  simulation?: INESTSimulationProps;
}

export class NESTProject extends NetworkProject {
  constructor(projectProps: INESTProjectProps = {}) {
    super(projectProps);
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
