// network.ts

import { BaseNetwork, INetworkState } from "@/network";
import type { Class, TNetworkState, TNode, TNodeGroup } from "@/types";
import type { IBaseState } from "@/core";

import type { NESTConnection } from "./connection";
import type { NESTModel } from "../model";
import type { NESTProject } from "../project";
import { NESTConnections } from "./connection";
import { NESTCopyModels, type INESTCopyModelState, type NESTCopyModel } from "./copyModel";
import { NESTNodes } from "./node";

export interface INESTNetworkState extends INetworkState {
  models?: INESTCopyModelState[];
}

const _elementTypes: { icon: string; id: string; title: string }[] = [
  { icon: "mdi:mdi-all-inclusive", id: "all", title: "all" },
  { icon: "mdi:mdi-select-group", id: "group", title: "group" },
  { icon: "graph:stimulator", id: "stimulator", title: "stimulator" },
  { icon: "graph:neuron-shape", id: "neuron", title: "neuron" },
  { icon: "graph:recorder", id: "recorder", title: "recorder" },
  { icon: "nest:copy-model", id: "model", title: "model" },
];

// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
export function isNESTNetworkState(networkState: TNetworkState): networkState is INESTNetworkState {
  return (networkState as INESTNetworkState).models != undefined;
}

export class NESTNetwork extends BaseNetwork<INESTNetworkState> {
  private _copyModels: NESTCopyModels; // for nest.CopyModel

  constructor(project: NESTProject) {
    super(project);

    this._copyModels = new NESTCopyModels(this);
  }

  override get Connections(): Class<NESTConnections> {
    return NESTConnections;
  }

  override get Nodes(): Class<NESTNodes> {
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

  override get hashObject(): IBaseState {
    return {
      models: this.copyModels.all.map((model: NESTCopyModel) => model.hash),
      nodes: this.nodes.all.map((node: TNode | TNodeGroup) => node.hash),
      connections: this.connections.all.map((connection: NESTConnection) => connection.hash),
    };
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
    this.logger.trace("get node models by element type", elementType);
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
   * Update network component.
   * @param network network state
   */
  override load(networkState: INESTNetworkState): void {
    this.logger.trace("update");

    this.clear();

    if (networkState.models) this.copyModels.load(networkState.models);
    this.nodes.load(networkState.nodes);
    this.connections.load(networkState.connections);

    this.init();
  }

  /**
   * Save nest network to state.
   * @return nest network state
   */
  override save(): INESTNetworkState {
    return {
      connections: this.connections.save(),
      models: this.copyModels.save(),
      nodes: this.nodes.save(),
    };
  }
}
