// connections.ts

import { BaseConnections } from "@/network";

import { NorseNetwork } from "../network";
import { type INorseConnectionState, NorseConnection } from "./connection";

export class NorseConnections extends BaseConnections {
  constructor(network: NorseNetwork, connectionStates: INorseConnectionState[] = []) {
    super(network, connectionStates);
  }

  override get Connection() {
    return NorseConnection;
  }

  override get all(): NorseConnection[] {
    return this.connections as NorseConnection[];
  }
}
