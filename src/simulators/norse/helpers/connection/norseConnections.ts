// norseConnections.ts

import { BaseConnections } from "@/helpers/connection/baseConnections";

import { NorseNetwork } from "@norse/helpers/network/norseNetwork";

import { NorseConnection, NorseConnectionProps } from "./norseConnection";

export class NorseConnections extends BaseConnections {
  constructor(network: NorseNetwork, connections: NorseConnectionProps[] = []) {
    super(network, connections);
  }

  /**
   * Create a new connection component.
   */
  newConnection(data: NorseConnectionProps): NorseConnection {
    return new NorseConnection(this, data);
  }
}
