// connections.ts

import { BaseConnections } from "@/helpers/connection/connections";

import { NorseNetwork } from "../network/network";
import { NorseConnection, NorseConnectionProps } from "./connection";

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
