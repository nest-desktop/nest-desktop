// network.ts

import { BaseNetwork } from "@/helpers/network/network";
import { INodeGroupProps } from "@/helpers/node/nodeGroup";
import { TNetworkProps, TNode, TNodeGroup } from "@/types";

import { INESTConnectionProps, NESTConnection } from "../connection/connection";
import { INESTCopyModelProps, NESTCopyModel } from "../model/copyModel";
import { INESTNodeProps } from "../node/node";
import { NESTConnections } from "../connection/connections";
import { NESTCopyModels } from "../model/copyModels";
import { NESTModel } from "../model/model";
import { NESTNodes } from "../node/nodes";
import { NESTProject } from "../project/project";

export interface INESTNetworkProps {
  models?: INESTCopyModelProps[];
  nodes?: (INESTNodeProps | INodeGroupProps)[];
  connections?: INESTConnectionProps[];
}

const _elementTypes: { icon: string; id: string; title: string }[] = [
  { icon: "mdi:mdi-all-inclusive", id: "all", title: "all" },
  { icon: "mdi:mdi-select-group", id: "group", title: "group" },
  { icon: "network:stimulator", id: "stimulator", title: "stimulator" },
  { icon: "network:neuron-shape", id: "neuron", title: "neuron" },
  { icon: "network:recorder", id: "recorder", title: "recorder" },
  { icon: "nest:copy-model", id: "model", title: "model" },
];

// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
export function isNESTNetworkProps(networkProps: TNetworkProps): networkProps is INESTNetworkProps {
  return (networkProps as INESTNetworkProps).models != undefined;
}

export class NESTNetwork extends BaseNetwork {
  private _copyModels: NESTCopyModels; // for nest.CopyModel

  constructor(project: NESTProject, networkProps: INESTNetworkProps = {}) {
    super(project, networkProps);

    this._copyModels = new NESTCopyModels(this, networkProps.models);
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

  override get elementTypes() {
    return _elementTypes;
  }

  override get isEmpty(): boolean {
    return this.copyModels.all.length === 0 && this.nodes.all.length === 0 && this.connections.all.length === 0;
  }

  /**
   * Get copied models
   */
  get models(): NESTCopyModels {
    return this._copyModels;
  }

  get copyModels(): NESTCopyModels {
    return this._copyModels;
  }

  override get project(): NESTProject {
    return this._project as NESTProject;
  }

  override get nodes(): NESTNodes {
    return this._nodes as NESTNodes;
  }

  /**
   * Get synapse models.
   * @returns a list of synapse models
   */
  get synapseModels(): (NESTModel | NESTCopyModel)[] {
    this.logger.debug("get synapse models by element type");

    return this.project.modelDBStore.getModelsByElementType("synapse");
  }

  /**
   * Clean nodes and connection components.
   */
  override clean(): void {
    this.logger.trace("clean");

    this.connections.clean();
    this.nodes.clean();
    this.copyModels.clean();
  }

  /**
   * Clear the network.
   */
  override clear(): void {
    this.logger.trace("clear");

    this.connections.clear();
    this.nodes.clear();
    this.copyModels.clear();
  }

  /**
   * Delete model component from the network.
   * @param model NEST copy model
   *
   * @remarks
   * It emits network changes.
   */
  deleteModel(model: NESTCopyModel): void {
    this.logger.trace("delete copy model");

    // Remove model from the list.
    this.copyModels.remove(model);

    // Trigger network change.
    this.changes();

    // Initialize activity graph.
    // this._project.initActivityGraph();
  }

  /**
   * Get node models of the element type.
   * @param elementType string
   * @returns a list of models
   */
  getNodeModelsByElementType(elementType: string): (NESTModel | NESTCopyModel)[] {
    this.logger.debug("get node models by element type", elementType);
    return elementType === "copied"
      ? this.copyModels.filterByGeneralElementType("node")
      : this.project.modelDBStore.getModelsByElementType(elementType);
  }

  /**
   * Initialize network.
   * @remarks Do not use it in the constructor.
   */
  override init(): void {
    this.logger.trace("init");

    this.nodes.init();
    this.connections.init();
    this.copyModels.init();

    this.updateStyle();
    this.updateHash();
  }

  /**
   * Serialize for JSON.
   * @return network props
   */
  override toJSON(): INESTNetworkProps {
    return {
      connections: this.connections.toJSON(),
      models: this.copyModels.toJSON(),
      nodes: this.nodes.toJSON(),
    };
  }

  /**
   * Update network component.
   * @param network network props
   */
  override update(networkProps: INESTNetworkProps): void {
    this.logger.trace("update");

    this.clear();

    this.copyModels.update(networkProps.models);
    this.nodes.update(networkProps.nodes);
    this.connections.update(networkProps.connections);

    this.init();
  }

  /**
   * Update hash.
   */
  override updateHash(): void {
    this._updateHash({
      models: this.copyModels.all.map((model: NESTCopyModel) => model.hash),
      nodes: this.nodes.all.map((node: TNode | TNodeGroup) => node.hash),
      connections: this.connections.all.map((connection: NESTConnection) => connection.hash),
    });
  }
}
