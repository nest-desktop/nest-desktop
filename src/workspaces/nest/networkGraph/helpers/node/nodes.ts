// nodes.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import { BaseNodes } from "@/networkGraph/helpers/node/nodes";
import type { Class, TNodeGroup } from "@/types";

import { NESTNode } from "./node";
import type { NESTActivityGraph } from "../../../activityGraph/helpers/activityGraph";
import type { NESTNetwork } from "../network/network";

export class NESTNodes extends BaseNodes {
  override get Node(): Class<NESTNode> {
    return NESTNode;
  }

  get codeNodes(): AbstractCodeNode[] {
    return (
      this._network.project.code.graph?.nodes.filter((codeNode: AbstractCodeNode) => codeNode.type === "nest.Create") ??
      []
    );
  }

  /**
   * Check if the network has some nodes with compartments
   */
  get hasSomeNodeCompartments(): boolean {
    return this.nodeItems.some((node: NESTNode) => node.compartments.length > 0);
  }

  /**
   * Check if the network has some nodes with receptors
   */
  get hasSomeNodeReceptors(): boolean {
    return this.nodeItems.some((node: NESTNode) => node.receptors.length > 0);
  }

  /**
   * Check if the network has some spatial nodes
   */
  get hasSomeSpatialNodes(): boolean {
    return this.nodeItems.some((node: NESTNode) => node.spatial.hasPositions);
  }

  get isWeightRecorderSelected(): boolean {
    const selectedNode = this.network.connections.state.selectedNode as NESTNode;
    return selectedNode ? selectedNode.model.isWeightRecorder : false;
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  override get neurons(): NESTNode[] {
    return this.nodeItems.filter((node: NESTNode) => node.model.isNeuron) as NESTNode[];
  }

  override get nodeItems(): NESTNode[] {
    return this.nodes.filter((node: TNodeGroup | NESTNode) => node.isNode) as NESTNode[];
  }

  override get recorders(): NESTNode[] {
    return this.nodeItems.filter((node: NESTNode) => node.model.isRecorder) as NESTNode[];
  }

  /**
   * Get spatial nodes
   */
  get spatialNodes(): NESTNode[] {
    return this.nodeItems.filter((node: NESTNode) => node.spatial.hasPositions);
  }

  override get stimulators(): NESTNode[] {
    return this.nodeItems.filter((node: NESTNode) => node.model.isStimulator) as NESTNode[];
  }

  /**
   * Get nodes with weight recorders.
   */
  get weightRecorders(): NESTNode[] {
    return this.nodeItems.filter((node: NESTNode) => node.model.isWeightRecorder);
  }

  /**
   * Clean weight recorder components.
   */
  cleanWeightRecorders(): void {
    this.weightRecorders.forEach((node: NESTNode) => node.clean());
  }

  /**
   * Update records color of recorders.
   * @remarks It updates colors in activity animation graph additionally.
   */
  override updateRecordsColor(): void {
    this.logger.trace("update records color");

    super.updateRecordsColor();

    const activityGraph = this.network.project.activityGraph as NESTActivityGraph;
    if (activityGraph.activityAnimationGraph) activityGraph.activityAnimationGraph.renderFrameLayers();
  }
}
