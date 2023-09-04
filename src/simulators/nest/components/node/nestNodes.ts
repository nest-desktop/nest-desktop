// nestNodes.ts

import { BaseNodes } from "@/components/node/baseNodes";

import { NESTNode, NESTNodeProps } from "./nestNode";
import { NESTNetwork } from "@nest/components/network/nestNetwork";

export class NESTNodes extends BaseNodes {
  constructor(network: NESTNetwork, nodes?: NESTNodeProps[]) {
    super(network, nodes);
  }

  override get all(): NESTNode[] {
    return this.nodes
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
    return selectedNode ? selectedNode.nestModel.isWeightRecorder : false;
  }

  override get network(): NESTNetwork {
    return this.parent as NESTNetwork;
  }

  override get nodes(): NESTNode[] {
    return this.nodes as NESTNode[]
  }

  /**
   * Get spatial nodes
   */
  get spatialNodes(): NESTNode[] {
    return this.nodes.filter((node: NESTNode) => node.spatial.hasPositions);
  }

  /**
   * Get nodes with weight recorders.
   */
  get weightRecorders(): NESTNode[] {
    return this.nodes.filter((node: NESTNode) => node.nestModel.isWeightRecorder);
  }

  /**
   * Clean weight recorder components.
   */
  cleanWeightRecorders(): void {
    this.weightRecorders.forEach((node: NESTNode) => node.clean());
  }

}
