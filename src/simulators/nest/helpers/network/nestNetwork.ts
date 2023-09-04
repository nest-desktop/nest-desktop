// nestNetwork.ts

import { BaseNetwork } from "@/helpers/network/baseNetwork";
import { Node } from "@/types/nodeTypes";

import {
  NESTConnection,
  NESTConnectionProps,
} from "../connection/nestConnection";
import { NESTConnections } from "../connection/nestConnections";
import { NESTCopyModel, NESTCopyModelProps } from "../model/nestCopyModel";
import { NESTCopyModels } from "../model/nestCopyModels";
import { NESTNodeProps } from "../node/nestNode";
import { NESTNodes } from "../node/nestNodes";
import { NESTProject } from "../project/nestProject";


export interface NESTNetworkProps {
  models?: NESTCopyModelProps[];
  nodes?: NESTNodeProps[];
  connections?: NESTConnectionProps[];
}

export class NESTNetwork extends BaseNetwork {
  private _modelsCopied: NESTCopyModels; // for nest.CopyModel

  constructor(project: NESTProject, network: NESTNetworkProps = {}) {
    super(project, network, "NESTNetwork");
    this._modelsCopied = new NESTCopyModels(this, network.models);
  }

  override get connections(): NESTConnections {
    return this._connections as NESTConnections;
  }

  override get isEmpty(): boolean {
    return (
      this.modelsCopied.all.length === 0 &&
      this.nodes.all.length === 0 &&
      this.connections.all.length === 0
    );
  }

  /**
   * Get copied models
   */
  get modelsCopied(): NESTCopyModels {
    return this._modelsCopied;
  }

  override get project(): NESTProject {
    return this._project as NESTProject;
  }

  override get nodes(): NESTNodes {
    return this._nodes as NESTNodes;
  }

  /**
   * Clean nodes and connection components.
   */
  override clean(): void {
    this.logger.trace("clean");
    this.nodes.clean();
    this.connections.clean();
    this.modelsCopied.clean();

    this.nodes.updateRecords();
    this.updateStates();
  }

  /**
   * Clear the network.
   */
  override clear(): void {
    this.logger.trace("clear");
    this.connections.clear();
    this.nodes.clear();
    this.modelsCopied.clear();

    this.updateStates();
  }

  /**
   * Clone network component.
   */
  override clone(): NESTNetwork {
    return new NESTNetwork(this.project, { ...this.toJSON() });
  }

  /**
   * Connect node components by user interaction.
   *
   * @remarks
   * When it connects to a recorder, it initializes activity graph.
   */
  override connectNodes(source: Node, target: Node): void {
    this.logger.trace("connect nodes");

    const connection: NESTConnection = this.connections.add({
      source: source.idx,
      target: target.idx,
    });

    if (source.view.state.synWeights) {
      connection.synapse.weightLabel = source.view.state.synWeights;
    }

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    if (connection.view.connectRecorder()) {
      connection.recorder.initActivity();
      // this._project.initActivityGraph();
    }
  }

  /**
   * Delete model component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteModel(model: NESTCopyModel): void {
    this.logger.trace("delete copy model");

    // Remove model from the list.
    this.modelsCopied.remove(model);

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    // this._project.initActivityGraph();
  }

  /**
   * New nodes component.
   */
  override newNodes(data?: NESTNodeProps[] | undefined): NESTNodes {
    return new NESTNodes(this, data);
  }

  /**
   * New components component.
   */
  override newConnections(data: NESTConnectionProps[] | undefined): NESTConnections {
    return new NESTConnections(this, data);
  }

  /**
   * Serialize for JSON.
   * @return network object
   */
  override toJSON(): NESTNetworkProps {
    return {
      connections: this.connections.toJSON(),
      models: this.modelsCopied.toJSON(),
      nodes: this.nodes.toJSON(),
    };
  }

  /**
   * Update network component.
   *
   * @param network - network object
   */
  override update(network: NESTNetworkProps): void {
    this.logger.trace("update");
    this.modelsCopied.update(network.models);
    this.nodes.update(network.nodes);
    this.connections.update(network.connections);

    // Update states.
    this.updateStates();
  }
}
