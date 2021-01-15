import * as objectHash from 'object-hash';

import { Config } from '../config';
import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { NetworkCode } from './networkCode';
import { NetworkView } from './networkView';
import { Node } from '../node/node';
import { Project } from '../project/project';

export class Network extends Config {
  private _code: NetworkCode; // code
  private _connections: Connection[] = []; // for nest.Connect
  private _nodes: Node[] = []; // for nest.Create
  private _project: Project; // parent
  private _view: NetworkView; // view
  private _hash: string; // network hash

  constructor(project: Project, network: any = {}) {
    super('Network');
    this._project = project;
    this._code = new NetworkCode(this);
    this._view = new NetworkView(this);

    this.update(network);
    this.clean();
    this.updateHash();
  }

  get code(): NetworkCode {
    return this._code;
  }

  get connections(): Connection[] {
    return this._connections;
  }

  get hash(): string {
    return this._hash;
  }

  get neurons(): Node[] {
    return this._nodes.filter(
      (node: Node) => node.model.elementType === 'neuron'
    );
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  get project(): Project {
    return this._project;
  }

  get recorders(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isRecorder());
  }

  get stimulators(): Node[] {
    return this._nodes.filter(
      (node: Node) => node.model.elementType === 'stimulator'
    );
  }

  get view(): NetworkView {
    return this._view;
  }

  /**
   * Observer for network changes
   *
   * @remarks
   * It commits network in the network editor.
   * It updates hash of the network.
   * It generates simulation code in the code editor.
   */
  networkChanges(): void {
    this.updateHash();
    if (this._project.app.view.project.mode === 'networkEditor') {
      this._project.commitNetwork(this);
    }
    this._project.code.generate();
    // this._project.activityGraph.init();
  }

  /**
   * Go to the oldest network version.
   */
  oldest(): void {
    this._project.networkOldest();
  }

  /**
   * Go to the older network version.
   */
  older(): void {
    this._project.networkOlder();
  }

  /**
   * Go to the newer network version.
   */
  newer(): void {
    this._project.networkNewer();
  }

  /**
   * Go to the newest network version.
   */
  newest(): void {
    this._project.networkNewest();
  }

  /**
   * Add node component to the network.
   */
  addNode(node: any): void {
    this._nodes.push(new Node(this, node));
  }

  /**
   * Add connection component to the network.
   *
   * @remarks
   * When it connects to a recorder, it initializes activity graph.
   */
  addConnection(connection: any): void {
    this._connections.push(new Connection(this, connection));
    if (connection.elementType === 'recorder') {
      this._project.activityGraph.init();
    }
  }

  /**
   * Delete node component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteNode(node: Node): void {
    this._view.resetFocus();
    this._view.resetSelection();
    this._connections = this._connections.filter(
      (c: Connection) => c.source !== node && c.target !== node
    );
    // this.nodes = this.nodes.filter((n: Node) => n.idx !== node.idx);
    const idx: number = node.idx;
    this._nodes = this._nodes.slice(0, idx).concat(this.nodes.slice(idx + 1));
    this.clean();
    this.networkChanges();
  }

  /**
   * Delete connection component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteConnection(connection: Connection): void {
    this._view.resetFocus();
    this._view.resetSelection();
    // this.connections = this.connections.filter((c: Connection) => c.idx !== connection.idx);
    const idx: number = connection.idx;
    this._connections = this._connections
      .slice(0, idx)
      .concat(this.connections.slice(idx + 1));
    this.clean();
    this.networkChanges();
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this._nodes.forEach((node: Node) => node.clean());
    this._connections.forEach((connection: Connection) => connection.clean());
  }

  /**
   * Copy network component.
   */
  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  /**
   * Clone network component.
   */
  clone(): Network {
    return new Network(this._project, this.toJSON());
  }

  /**
   * Update network component.
   *
   * @remarks
   * It generates simulation code in the code editor.
   *
   * @param network - network object
   */
  update(network: any): void {
    this._nodes = [];
    if (network.nodes) {
      network.nodes.forEach((node: any) => this.addNode(node));
    }
    this._connections = [];
    if (network.connections) {
      network.connections.forEach((connection: any) =>
        this.addConnection(connection)
      );
    }
    this.updateHash();
    // this._project.code.generate();
  }

  /**
   * Clear the network by deleting every node and every connection.
   *
   * @remarks
   * It emits network changes.
   */
  empty(): void {
    this._view.resetFocus();
    this._view.resetSelection();
    this._connections = [];
    this._nodes = [];
    this.clean();
    this.networkChanges();
  }

  isEmpty(): boolean {
    return this._nodes.length === 0 && this._connections.length === 0;
  }

  /**
   * Calculate hash of this component.
   */
  updateHash(): void {
    this._hash = objectHash(this.toJSON());
  }

  /**
   * Serialize for JSON.
   * @return network object
   */
  toJSON(target: string = 'db'): any {
    const connections: any[] = this._connections.map((connection: Connection) =>
      connection.toJSON(target)
    );
    const nodes: any[] = this._nodes.map((node: Node) => node.toJSON(target));
    return { connections, nodes };
  }
}
