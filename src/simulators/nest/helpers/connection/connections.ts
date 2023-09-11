// connections.ts

import { BaseConnections } from "@/helpers/connection/connections";
import { Network } from "@/types/networkTypes";
import { Connection } from "@/types/connectionTypes";

import { NESTNetwork } from "../network/network";

import { NESTConnection, NESTConnectionProps } from "./connection";

export class NESTConnections extends BaseConnections {
  constructor(network: Network, connections: NESTConnectionProps[] = []) {
    super(network, connections);
  }

  override get all(): NESTConnection[] {
    return this._connections as NESTConnection[];
  }

  override get connections(): NESTConnection[] {
    return this._connections as NESTConnection[];
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  /**
   * filter connection list by weight recorder.
   */
  get recordedByWeightRecorder(): Connection[] {
    return this.all.filter((connection: NESTConnection) => {
      const synapseModel = connection.synapse.model;
      return synapseModel.hasWeightRecorderParam;
    });
  }

  /**
   * Add connection component to the network.
   */
  override add(data: NESTConnectionProps): NESTConnection {
    this.logger.trace("add");
    const connection: NESTConnection = this.newConnection(data);
    this.connections.push(connection);
    return connection;
  }

  /**
   * Clean nodes and connection components.
   */
  override clean(): void {
    this.logger.trace("clean");
    this.all.forEach((connection: NESTConnection) =>
      connection.clean()
    );

    this.all.forEach((connection: NESTConnection) => {
      connection.sourceSlice.update();
      connection.targetSlice.update();
    });

    this.updateHash();
  }

  getBySynapseModelId(modelId: string): NESTConnection | undefined {
    return this.all.find(
      (connection: NESTConnection) => connection.synapse.modelId === modelId
    );
  }

  /**
   * Create a new connection component.
   */
  override newConnection(data: NESTConnectionProps): NESTConnection {
    return new NESTConnection(this, data);
  }
}
