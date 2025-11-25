// network.ts

import { BaseNetwork, type INetworkState } from "@/networkGraph/helpers/network/network";
import type { INodeGroupState } from "@/networkGraph/helpers/node/nodeGroup";
import type { INodeState } from "@/networkGraph/helpers/node/node";

import type { INorseConnectionState } from "../connection/connection";
import { NorseConnections } from "../connection/connections";
import { NorseNodes } from "../node/nodes";
import { NorseProject } from "../../../helpers/project/project";

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
