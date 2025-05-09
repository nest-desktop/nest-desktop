// connections.ts

import { BaseConnections } from "@/helpers/connection/connections";

import { INESTConnectionProps, NESTConnection } from "./connection";
import { NESTNetwork } from "../network/network";

export class NESTConnections extends BaseConnections {
  constructor(network: NESTNetwork, connectionsProps: INESTConnectionProps[] = []) {
    super(network, connectionsProps);
  }

  override get Connection() {
    return NESTConnection;
  }

  override get all(): NESTConnection[] {
    return this._connections as NESTConnection[];
  }

  override get connections(): NESTConnection[] {
    return this._connections as NESTConnection[];
  }

  /**
   * filter connection list containing weight recorder.
   */
  get filterWithWeightRecorder(): NESTConnection[] {
    return this.all.filter((connection: NESTConnection) => connection.synapse.recordedByWeightRecorder);
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  /**
   * Add connection component to the network.
   * @param connectionProps connection props
   * @returns connection object
   */
  override addConnection(connectionProps: INESTConnectionProps): NESTConnection {
    this.logger.trace("add");

    const connection: NESTConnection = new this.Connection(this, connectionProps);
    connection.updateHash();
    this.connections.push(connection);
    return connection;
  }

  /**
   * Clean nodes and connection components.
   */
  override clean(): void {
    this.logger.trace("clean");

    this.all.forEach((connection: NESTConnection) => connection.clean());

    this.all.forEach((connection: NESTConnection) => {
      if (connection.source.isNode) connection.sourceSlice.update();
      if (connection.target.isNode) connection.targetSlice.update();
    });
  }

  /**
   * Find connection by synapse model id.
   * @param modelId string
   * @returns connection object
   */
  getBySynapseModelId(modelId: string): NESTConnection | undefined {
    return this.all.find((connection: NESTConnection) => connection.synapse.modelId === modelId);
  }
}
