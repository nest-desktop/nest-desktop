// norseNetwork.ts

import { BaseNetwork, NetworkProps } from "@/helpers/network/baseNetwork";
import { ConnectionProps } from "@/helpers/connection/baseConnection";
import { NodeProps } from "@/helpers/node/baseNode";
import { Project } from "@/types/projectTypes";

import { NorseConnectionProps } from "../connection/norseConnection";
import { NorseConnections } from "../connection/norseConnections";
import { NorseNodeProps } from "../node/norseNode";
import { NorseNodes } from "../node/norseNodes";

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

  /**
   * Clone norse network component.
   */
  override clone(): NorseNetwork {
    return new NorseNetwork(this.project, { ...this.toJSON() });
  }

  override newNodes(data?: NodeProps[]): NorseNodes {
    return new NorseNodes(this, data);
  }

  override newConnections(data: ConnectionProps[]): NorseConnections {
    return new NorseConnections(this, data);
  }
}
