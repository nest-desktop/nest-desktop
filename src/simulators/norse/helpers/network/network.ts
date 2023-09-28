// network.ts

import { BaseNetwork, NetworkProps } from "@/helpers/network/network";
import { Project } from "@/types/projectTypes";

import { NorseConnectionProps } from "../connection/connection";
import { NorseConnections } from "../connection/connections";
import { NorseNodeProps } from "../node/node";
import { NorseNodes } from "../node/nodes";

export interface NorseNetworkProps extends NetworkProps {
  nodes?: NorseNodeProps[];
  connections?: NorseConnectionProps[];
}

export class NorseNetwork extends BaseNetwork {
  constructor(project: Project, network: NorseNetworkProps = {}) {
    super(project, network);

    this.defaultModels = {
      neuron: "LIF",
      recorder: "voltmeter",
      stimulator: "dc_generator",
    };
  }

  override get connections(): NorseConnections {
    return this._connections as NorseConnections;
  }

  override get nodes(): NorseNodes {
    return this._nodes as NorseNodes;
  }

  /**
   * Clone norse network component.
   */
  override clone(): NorseNetwork {
    return new NorseNetwork(this.project, { ...this.toJSON() });
  }

  override newNodes(data?: NorseNodeProps[]): NorseNodes {
    return new NorseNodes(this, data);
  }

  override newConnections(data: NorseConnectionProps[]): NorseConnections {
    return new NorseConnections(this, data);
  }
}
