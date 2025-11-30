// nodeView.ts

import { NodeView } from "@/network";

import type { NESTNode } from "../node";
import type { NESTConnection } from "../../connection";
import type { NESTCopyModel } from "../../copyModel";

export class NESTNodeView extends NodeView<NESTNode> {
  override get color(): string {
    if (this.state.color) {
      return this.state.color;
    } else if (this.node.model.isWeightRecorder) {
      const models = this.node.assignedModels;
      if (models.length === 1) return models[0]?.connections[0]?.sourceNode.view.color ?? "black";
    } else if (this.node.model.isRecorder && this.node.connectedNodes.length === 1) {
      return this.node.connectedNodes[0]?.view.color ?? "black";
    }
    return this.node.network.getNodeColor(this.node.idx);
  }

  /**
   * Get term based on synapse weight.
   */
  get synWeights(): string {
    if (
      this._node.model.isRecorder ||
      this._node.network.connections.length === 0 ||
      this._node.connections.length === 0 ||
      this._node.connectionsNeuronTargets.length === 0
    )
      return "";

    const weights: number[] = this.node.connectionsNeuronTargets.map(
      (connection: NESTConnection) => connection.synapse.params.weightValue,
    );

    if (weights.every((weight: number) => weight > 0)) return "excitatory";
    if (weights.every((weight: number) => weight < 0)) return "inhibitory";
    return "mixed";
  }

  /**
   * Set all synaptic weights.
   * @param term inhibitory (negative) or excitatory (positive)
   * @remarks It emits node changes.
   */
  set synWeights(value: string) {
    this.state.synWeights = value;

    if (this.node.connectionsNeuronTargets.length === 0) return;

    this.node.connectionsNeuronTargets.forEach((connection: NESTConnection) => {
      connection.synapse.params.weightLabel = value;
    });
    this.node.changes();
  }

  /**
   * Clean node.
   */
  override clean(): void {
    const cleanWeightRecorder = false;

    if (this.node.model.isWeightRecorder && cleanWeightRecorder) {
      const copiedSynapseModels = this.node.nodes.network.copyModels.synapseModels.filter((model: NESTCopyModel) =>
        model.isAssignedToWeightRecorder(this.node),
      );

      if (copiedSynapseModels.length === 1) {
        const copiedSynapseModel = copiedSynapseModels[0];
        if (copiedSynapseModel) {
          const connection = this.node.nodes.network.connections.getBySynapseModelId(copiedSynapseModel.id);
          if (connection) this.state.position = connection.view.centerPosition;
        }
      }
    }
  }
}
