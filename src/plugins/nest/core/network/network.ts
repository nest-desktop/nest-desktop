// network.ts

import { Config } from "@/helpers/config";

import { Connection, connectionProps } from "../connection/connection";
import { Connections } from "../connection/connections";
import { CopyModel, copyModelProps } from "../model/copyModel";
import { CopyModels } from "../model/copyModels";
import { NetworkState } from "./networkState";
import { Node, nodeProps } from "../node/node";
import { Nodes } from "../node/nodes";
import { Project } from "../project/project";

export interface networkProps {
  models?: copyModelProps[];
  nodes?: nodeProps[];
  connections?: connectionProps[];
}

export class Network extends Config {
  private _connections: Connections; // for nest.Connect
  private _models: CopyModels; // for nest.CopyModel
  private _nodes: Nodes; // for nest.Create
  private _project: Project; // project
  private _state: NetworkState; // network state

  constructor(project: Project, network: networkProps = {}) {
    super("Network");
    this._project = project;

    this._models = new CopyModels(this, network.models);
    this._nodes = new Nodes(this, network.nodes);
    this._connections = new Connections(this, network.connections);

    this._state = new NetworkState(this);
  }

  get colors(): string[] {
    return this.config.color.cycle;
  }

  set colors(value: string[]) {
    const color: any = this.config.color;
    color.cycle = value;
    this.config.update({ color });
  }

  get connections(): Connections {
    return this._connections;
  }

  /**
   * Get copied models
   */
  get models(): CopyModels {
    return this._models;
  }

  /**
   * Get nodes
   */
  get nodes(): Nodes {
    return this._nodes;
  }

  get project(): Project {
    return this._project;
  }

  get state(): NetworkState {
    return this._state;
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this._nodes.clean();
    this._connections.clean();
    this._models.clean();

    this._state.updateHash();
  }

  /**
   * Clone network component.
   */
  clone(): Network {
    return new Network(this._project, { ...this.toJSON() });
  }

  /**
   * Connect node components by user interaction.
   *
   * @remarks
   * When it connects to a recorder, it initializes activity graph.
   */
  connectNodes(source: Node, target: Node): void {
    // console.log("Connect nodes");

    const connection: Connection = this._connections.add({
      source: source.idx,
      target: target.idx,
    });

    const weight: string = source.view.weight;
    if (weight === "inhibitory") {
      source.setWeights(weight);
    }

    // Trigger network change.
    this.networkChanges();

    // Initialize activity graph.
    if (connection.view.connectRecorder()) {
      connection.recorder.initActivity();
      this._project.initActivityGraph();
    }
  }

  /**
   * Create node component by user interaction.
   */
  createNode(view: any): void {
    // console.log("Create node");

    const defaultModels: { [key: string]: string } = {
      neuron: "iaf_psc_alpha",
      recorder: "voltmeter",
      stimulator: "dc_generator",
    };

    this._nodes.add({
      model: defaultModels[view.elementType],
      view: view,
    });

    this.networkChanges();
  }

  /**
   * Delete connection component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteConnection(connection: Connection): void {
    // console.log("Delete connection");

    // Remove connection from the list.
    this._connections.remove(connection);

    // Trigger network change.
    this.networkChanges();

    // Initialize activity graph.
    this._project.initActivityGraph();
  }

  /**
   * Delete connection component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteModel(model: CopyModel): void {
    // console.log("Delete model");

    // Remove model from the list.
    this._models.remove(model);

    // Trigger network change.
    this.networkChanges();

    // Initialize activity graph.
    this._project.initActivityGraph();
  }

  /**
   * Delete node component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteNode(node: Node): void {
    // console.log("Delete node");

    // Remove connection from the list.
    this._connections.removeByNode(node);

    // Remove node from the list.
    this._nodes.remove(node);

    // Trigger network change.
    this.networkChanges();

    // Initialize activity graph.
    this._project.initActivityGraph();
  }

  /**
   * Clear the network.
   */
  empty(): void {
    this._connections.empty();
    this._nodes.empty();
    this._models.empty();

    this._state.updateHash();
  }

  /**
   * Get node color.
   */
  getNodeColor(idx: number): string {
    const colors: string[] = this.config.color.cycle;
    return colors[idx % colors.length];
  }

  /**
   * Observer for network changes
   *
   * @remarks
   * It updates hash of the network.
   * It generates simulation code in the code editor.
   * It commits the network in the network history.
   */
  networkChanges(): void {
    // console.log("Network changes");

    this._state.updateNodeAnnotations();
    this._project.simulation.code.generate();

    this._state.updateHash();
    this._project.state.updateHash();

    // this._project.commitNetwork(this);

    // Simulate when the configuration is set
    // and the view mode is activity explorer.
    // const projectView = this._project.app.project.view;
    // if (
    //   projectView.config.simulateAfterChange &&
    //   projectView.state.modeIdx === 1
    // ) {
    //   setTimeout(() => this._project.startSimulation(), 1);
    // }

    this._project.state.checkChanges();
  }

  /**
   * Serialize for JSON.
   * @return network object
   */
  toJSON(): networkProps {
    return {
      connections: this._connections.toJSON(),
      models: this._models.toJSON(),
      nodes: this._nodes.toJSON(),
    };
  }

  /**
   * Update network component.
   *
   * @param network - network object
   */
  update(network: networkProps): void {
    this._models.update(network.models);
    this._nodes.update(network.nodes);
    this._connections.update(network.connections);

    this._state.updateHash();
  }
}
