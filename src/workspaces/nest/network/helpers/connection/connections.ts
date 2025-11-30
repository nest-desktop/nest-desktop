// connections.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import { BaseConnections } from "@/network";
import type { Class } from "@/types";

import { NESTConnection } from "./connection";
import type { NESTNetwork } from "../../network";

export class NESTConnections extends BaseConnections<NESTNetwork> {
  override get Connection(): Class<NESTConnection> {
    return NESTConnection;
  }

  get codeNodes(): AbstractCodeNode[] {
    return (
      this.network.project.code?.graph?.nodes.filter(
        (codeNode: AbstractCodeNode) => codeNode.type === "nest.Connect",
      ) ?? []
    );
  }

  /**
   * filter connection list containing weight recorder.
   */
  get filterWithWeightRecorder(): NESTConnection[] {
    return this.connections.filter((connection: NESTConnection) => connection.synapse.recordedByWeightRecorder);
  }

  // /**
  //  * Add connection component to the network.
  //  * @param connectionState connection state
  //  * @returns connection instance
  //  */
  // override addConnection(connectionState: INESTConnectionState): NESTConnection {
  //   this.logger.trace("add");

  //   const connection: NESTConnection = new this.Connection(this);
  //   connection.load(connectionState);
  //   connection.init();
  //   return connection;
  // }

  /**
   * Clean nodes and connection instances.
   */
  override clean(): void {
    this.logger.trace("clean");

    this.connections.forEach((connection: NESTConnection) => connection.clean());

    // this.connections.forEach((connection: NESTConnection) => {
    //   if (connection.source.isNode) connection.sourceSlice.update();
    //   if (connection.target.isNode) connection.targetSlice.update();
    // });
  }

  /**
   * Find connection by synapse model ID.
   * @param modelId synapse model ID
   * @returns connection instance
   */
  getBySynapseModelId(modelId: string): NESTConnection | undefined {
    return this.connections.find((connection: NESTConnection) => connection.synapse.modelId === modelId);
  }
}
