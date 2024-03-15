// nodeView.ts

import { NESTConnection } from "../connection/connection";
import { NESTCopyModel } from "../model/copyModel";
import { NESTNode } from "./node";
import { INodeViewProps, NodeView } from "@/helpers/node/nodeView";

export class NESTNodeView extends NodeView {
  constructor(
    node: NESTNode,
    viewProps: INodeViewProps = {
      position: { x: 0, y: 0 },
      visible: true,
    }
  ) {
    super(node, viewProps);
  }

  override get color(): string {
    if (this.state.color) {
      return this.state.color;
    } else if (this.node.model.isWeightRecorder) {
      const models = this.node.assignedModels;
      if (models.length === 1) {
        const connection = models[0].connections[0];
        return connection.source.view.color;
      }
    } else if (this.node.model.isRecorder) {
      const connections: NESTConnection[] =
        this.node.network.connections.all.filter(
          (connection: NESTConnection) =>
            connection.sourceIdx === this._node.idx ||
            connection.targetIdx === this._node.idx
        );
      if (
        connections.length === 1 &&
        connections[0].sourceIdx !== connections[0].targetIdx
      ) {
        const connection: NESTConnection = connections[0];
        const node: NESTNode = (
          connection.sourceIdx === this.node.idx
            ? connection.target
            : connection.source
        ) as NESTNode;
        return node.view.color;
      }
    }
    return this.node.network.getNodeColor(this.node.idx);
  }

  override get node(): NESTNode {
    return this._node as NESTNode;
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
      (connection: NESTConnection) =>
        connection.synapse.params.weight.value as number
    );

    if (weights.every((weight: number) => weight > 0)) {
      return "excitatory";
    }
    if (weights.every((weight: number) => weight < 0)) {
      return "inhibitory";
    }
    return "mixed";
  }

  /**
   * Set all synaptic weights.
   *
   * @remarks
   * It emits node changes.
   *
   * @param term - inhibitory (negative) or excitatory (positive)
   */
  set synWeights(value: string) {
    this.state.synWeights = value;

    if (this.node.connectionsNeuronTargets.length === 0) return;

    this.node.connectionsNeuronTargets.forEach((connection: NESTConnection) => {
      connection.synapse.weightLabel = value;
    });
    this.node.changes();
  }

  /**
   * Clean node.
   */
  override clean(): void {
    const cleanWeightRecorder = false;

    if (this.node.model.isWeightRecorder && cleanWeightRecorder) {
      const copiedSynapseModels =
        this.node.nodes.network.modelsCopied.synapseModels.filter(
          (model: NESTCopyModel) => model.isAssignedToWeightRecorder(this.node)
        );

      if (copiedSynapseModels.length === 1) {
        const copiedSynapseModel = copiedSynapseModels[0];
        const connection =
          this.node.nodes.network.connections.getBySynapseModelId(
            copiedSynapseModel.id
          );
        if (connection) {
          this.state.position = connection.view.centerPosition;
        }
      }
    }
  }
}
