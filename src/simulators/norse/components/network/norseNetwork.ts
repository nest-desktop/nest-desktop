// norseNetwork.ts

import { BaseNetwork, NetworkProps } from "@/components/network/baseNetwork";

import { NorseConnectionProps } from "../../components/connection/norseConnection";
import { NorseConnections } from "../connection/norseConnections";
import { NorseNodeProps } from "../../components/node/norseNode";
import { NorseNodes } from "../node/norseNodes";

import { Project } from "@/types/projectTypes";
import { NodeProps } from "@/components/node/baseNode";
import { ConnectionProps } from "@/components/connection/baseConnection";

export interface NorseNetworkProps extends NetworkProps {
  nodes?: NorseNodeProps[];
  connections?: NorseConnectionProps[];
}

export class NorseNetwork extends BaseNetwork {
  constructor(project: Project, network: NorseNetworkProps = {}) {
    super(project, network, "NorseNetwork");

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
