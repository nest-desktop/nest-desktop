// network.ts

import { BaseNetwork, INetworkProps } from "@/helpers/network/network";
import { INodeGroupProps } from "@/helpers/node/nodeGroup";
import { INodeProps } from "@/helpers/node/node";

import { INorseConnectionProps } from "../connection/connection";
import { NorseConnections } from "../connection/connections";
import { NorseNodes } from "../node/nodes";
import { NorseProject } from "../project/project";

export interface INorseNetworkProps extends INetworkProps {
  nodes?: (INodeGroupProps | INodeProps)[];
  connections?: INorseConnectionProps[];
}

export class NorseNetwork extends BaseNetwork {
  constructor(project: NorseProject, networkProps: INorseNetworkProps = {}) {
    super(project, networkProps);

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
