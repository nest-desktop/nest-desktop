// nestNodes.ts

import { BaseNodes } from "@/helpers/node/baseNodes";

import { NESTNode, NESTNodeProps } from "./nestNode";
import { NESTNetwork } from "../network/nestNetwork";

export class NESTNodes extends BaseNodes {
  constructor(network: NESTNetwork, nodes?: NESTNodeProps[]) {
    super(network, nodes);
  }

  override get all(): NESTNode[] {
    return this.nodes;
  }

  /**
   * Check if the network has some nodes with compartments
   */
  get hasSomeNodeCompartments(): boolean {
    return this.nodes.some((node: NESTNode) => node.compartments.length > 0);
  }

  /**
   * Check if the network has some nodes with receptors
   */
  get hasSomeNodeReceptors(): boolean {
    return this.nodes.some((node: NESTNode) => node.receptors.length > 0);
  }

  /**
   * Check if the network has some spatial nodes
   */
  get hasSomeSpatialNodes(): boolean {
    return this.nodes.some((node: NESTNode) => node.spatial.hasPositions);
  }

  get isWeightRecorderSelected(): boolean {
    const selectedNode = this.state.selectedNode as NESTNode;
    return selectedNode ? selectedNode.model.isWeightRecorder : false;
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  override get neurons(): NESTNode[] {
    return this.nodes.filter(
      (node: NESTNode) => node.model.isNeuron
    ) as NESTNode[];
  }

  override get nodes(): NESTNode[] {
    return this._nodes as NESTNode[];
  }

  override get recorders(): NESTNode[] {
    return this.nodes.filter(
      (node: NESTNode) => node.model.isRecorder
    ) as NESTNode[];
  }

  /**
   * Get spatial nodes
   */
  get spatialNodes(): NESTNode[] {
    return this.nodes.filter((node: NESTNode) => node.spatial.hasPositions);
  }

  override get stimulators(): NESTNode[] {
    return this.nodes.filter(
      (node: NESTNode) => node.model.isStimulator
    ) as NESTNode[];
  }

  /**
   * Get nodes with weight recorders.
   */
  get weightRecorders(): NESTNode[] {
    return this.nodes.filter((node: NESTNode) => node.model.isWeightRecorder);
  }

  /**
   * Clean weight recorder components.
   */
  cleanWeightRecorders(): void {
    this.weightRecorders.forEach((node: NESTNode) => node.clean());
  }

  override newNode(data?: NESTNodeProps): NESTNode {
    return new NESTNode(this, data);
  }
}
