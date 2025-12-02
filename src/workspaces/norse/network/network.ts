// network.ts

import { BaseNetwork, type INetworkState, type INodeGroupState, type INodeState } from "@/network";

import type { INorseConnectionState } from "./connection";
import { NorseConnections } from "./connection";
import { NorseNodes } from "./node";
import { NorseProject } from "../project";

export interface INorseNetworkState extends INetworkState {
  nodes?: (INodeGroupState | INodeState)[];
  connections?: INorseConnectionState[];
}

export class NorseNetwork extends BaseNetwork {
  constructor(project: NorseProject, networkState: INorseNetworkState = {}) {
    super(project, networkState);

    this.defaultModels = {
      neuron: "LIF",
      recorder: "voltmeter",
      stimulator: "dc_generator",
    };
  }

  override get Connections() {
    return NorseConnections;
  }

  override get Nodes() {
    return NorseNodes;
  }

  override get connections(): NorseConnections {
    return this._connections as NorseConnections;
  }

  override get nodes(): NorseNodes {
    return this._nodes as NorseNodes;
  }

  override get project(): NorseProject {
    return this._project as NorseProject;
  }
}
