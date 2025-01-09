// nodes.ts

import { NodeGroup } from "@/helpers/node/nodeGroup";
import { BaseNodes } from "@/helpers/node/nodes";

import { NESTActivityGraph } from "../activityGraph/activityGraph";
import { NESTNetwork } from "../network/network";
import { INESTNodeProps, NESTNode } from "./node";

export class NESTNodes extends BaseNodes {
  constructor(network: NESTNetwork, nodesProps?: INESTNodeProps[]) {
    super(network, nodesProps);
  }

  override get Node() {
    return NESTNode;
  }

  override get all() {
    return this._nodes as (NodeGroup | NESTNode)[];
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

  override get nodes(): (NodeGroup | NESTNode)[] {
    return this._nodes as (NodeGroup | NESTNode)[];
  }

  override get nodeItems(): NESTNode[] {
    return this.nodes.filter((node: NodeGroup | NESTNode) => node.isNode) as NESTNode[];
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
   * @remarks It updates colors in activity chart graph and in activity animation graph.
   */
  override updateRecordsColor(): void {
    this.logger.trace("update records color");

    this.recorders.forEach((recorder: NESTNode) => {
      recorder.updateRecordsColor();
    });

    const activityGraph = this.network.project.activityGraph as NESTActivityGraph;

    if (activityGraph.activityChartGraph) activityGraph.activityChartGraph.updateRecordsColor();
    if (activityGraph.activityAnimationGraph) activityGraph.activityAnimationGraph.renderFrameLayers();
  }
}
