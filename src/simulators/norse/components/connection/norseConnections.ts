// norseConnections.ts

import { BaseConnections } from "@/components/connection/baseConnections";

import { NorseConnection, NorseConnectionProps } from "./norseConnection";
import { NorseNetwork } from "../network/norseNetwork";

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
