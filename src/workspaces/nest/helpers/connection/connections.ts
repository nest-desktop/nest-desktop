// connections.ts

import { BaseConnections } from "@/helpers/connection/connections";

import { INESTConnectionProps, NESTConnection } from "./connection";
import { NESTNetwork } from "../network/network";
import { addNESTConnectNode } from "../codeNodeTypes/nest/nestConnect";

export class NESTConnections extends BaseConnections {
  constructor(network: NESTNetwork, connectionsProps: INESTConnectionProps[] = []) {
    super(network, connectionsProps);
  }

  override get Connection() {
    return NESTConnection;
  }

  override get allConnections(): NESTConnection[] {
    return this.connections as NESTConnection[];
  }

  override get connections(): NESTConnection[] {
    return super.connections as NESTConnection[];
  }

  /**
   * filter connection list containing weight recorder.
   */
  get filterWithWeightRecorder(): NESTConnection[] {
    return this.allConnections.filter((connection: NESTConnection) => connection.synapse.recordedByWeightRecorder);
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  /**
   * Connect node components by user interaction.
   * @param sourceIdx node index
   * @param targetIdx node index
   */
  addConnection(sourceIdx: number, targetIdx: number): void {
    this.logger.trace("connect nodes");

    addNESTConnectNode(
      this.network.project.code.graph,
      { source: sourceIdx, target: targetIdx },
      this.network.nodes.codeNodes,
    );
  }

  /**
   * Clean nodes and connection components.
   */
  override clean(): void {
    this.logger.trace("clean");

    this.allConnections.forEach((connection: NESTConnection) => connection.clean());

    this.allConnections.forEach((connection: NESTConnection) => {
      if (connection.source?.isNode) connection.sourceSlice.update();
      if (connection.target?.isNode) connection.targetSlice.update();
    });
  }

  /**
   * Find connection by synapse model id.
   * @param modelId string
   * @returns connection object
   */
  getBySynapseModelId(modelId: string): NESTConnection | undefined {
    return this.allConnections.find((connection: NESTConnection) => connection.synapse.modelId === modelId);
  }
}
