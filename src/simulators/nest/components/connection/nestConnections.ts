// nestConnections.ts

import { BaseConnections } from "@/components/connection/baseConnections";
import { Network } from "@/types/networkTypes";
import { Connection } from "@/types/connectionTypes";

import { NESTConnection, NESTConnectionProps } from "./nestConnection";
import { NESTNetwork } from "../network/nestNetwork";

export class NESTConnections extends BaseConnections {
  constructor(network: Network, connections: NESTConnectionProps[] = []) {
    super(network, connections);
  }

  override get all(): NESTConnection[] {
    return this.connections as NESTConnection[];
  }

  override get network(): NESTNetwork {
    return this.parent as NESTNetwork;
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
  newConnection(data: NESTConnectionProps): NESTConnection {
    return new NESTConnection(this, data);
  }
}
