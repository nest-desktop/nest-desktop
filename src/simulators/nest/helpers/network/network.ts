// network.ts

import { BaseNetwork } from "@/helpers/network/network";

import { INESTConnectionProps, NESTConnection } from "../connection/connection";
import { NESTConnections } from "../connection/connections";
import { INESTCopyModelProps, NESTCopyModel } from "../model/copyModel";
import { NESTCopyModels } from "../model/copyModels";
import { INESTNodeProps } from "../node/node";
import { NESTNodes } from "../node/nodes";
import { NESTProject } from "../project/project";
import { TNetworkProps } from "@/types/networkTypes";

export interface INESTNetworkProps {
  models?: INESTCopyModelProps[];
  nodes?: INESTNodeProps[];
  connections?: INESTConnectionProps[];
}

// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
export function IsNESTNetworkProps(
  networkProps: TNetworkProps
): networkProps is INESTNetworkProps {
  return (networkProps as INESTNetworkProps).models != undefined;
}

export class NESTNetwork extends BaseNetwork {
  private _modelsCopied: NESTCopyModels; // for nest.CopyModel

  constructor(project: NESTProject, networkProps: INESTNetworkProps = {}) {
    super(project, networkProps);

    this._modelsCopied = new NESTCopyModels(this, networkProps.models);
  }

  override get Connections() {
    return NESTConnections;
  }

  override get Nodes() {
    return NESTNodes;
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
  get models(): NESTCopyModels {
    return this._modelsCopied;
  }

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
  }

  /**
   * Clear the network.
   */
  override clear(): void {
    this.logger.trace("clear");
    this.connections.clear();
    this.nodes.clear();
    this.modelsCopied.clear();
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
  override connectNodes(sourceIdx: number, targetIdx: number): void {
    this.logger.trace("connect nodes");

    const connection: NESTConnection = this.connections.add({
      source: sourceIdx,
      target: targetIdx,
    });

    const source = this.nodes.all[sourceIdx];
    if (source.view.state.synWeights) {
      connection.synapse.weightLabel = source.view.state.synWeights;
    }

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    if (connection.view.connectRecorder()) {
      connection.recorder.createActivity();
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
   * Initialize network.
   */
  override init(): void {
    this.logger.trace("init");

    this.modelsCopied.init();
    this.nodes.init();
    this.connections.init();

    this.updateStyle();
    this.updateHash();
  }

  /**
   * Serialize for JSON.
   * @return network object
   */
  override toJSON(): INESTNetworkProps {
    return {
      connections: this.connections.toJSON(),
      models: this.modelsCopied.toJSON(),
      nodes: this.nodes.toJSON(),
    };
  }

  /**
   * Update network component.
   *
   * @param network network props
   */
  override update(networkProps: INESTNetworkProps): void {
    this.logger.trace("update");

    this.clear();

    this.modelsCopied.update(networkProps.models);
    this.nodes.update(networkProps.nodes);
    this.connections.update(networkProps.connections);

    this.nodes.updateRecords();
  }
}
