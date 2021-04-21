import { sha1 } from 'object-hash';

import { Config } from '../config';
import { Connection } from '../connection/connection';
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
  }

  get code(): NetworkCode {
    return this._code;
  }

  get connections(): Connection[] {
    return this._connections;
  }

  set connections(values: Connection[]) {
    this._connections = values;
    this._connections.forEach((connection: Connection) => {
      connection.clean();
    });
    this.networkChanges();
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

  set nodes(values: Node[]) {
    const nodeIdx: number[] = values.map((node: Node) => node.idx);
    this._nodes = values;
    this._nodes.forEach((node: Node) => {
      node.clean();
    });
    this._connections.forEach((connection: Connection) => {
      connection.sourceIdx = nodeIdx.indexOf(connection.sourceIdx);
      connection.targetIdx = nodeIdx.indexOf(connection.targetIdx);
      connection.clean();
    });
    this.networkChanges();
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
   * Check if the network has any spatial nodes.
   */
  hasSpatialNodes(): boolean {
    return (
      this._nodes.filter((node: Node) => node.spatial.hasPositions()).length > 0
    );
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
    this.updateHash();
    this._project.code.generate();
    this._project.commitNetwork(this);

    // Simulate when the configuration is set
    // and the view mode is activity explorer.
    if (
      this._project.config.simulateAfterChange &&
      this._project.view.modeIdx === 1
    ) {
      setTimeout(() => this._project.runSimulation(), 1);
    }
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
   * Create node component by user interaction.
   */
  createNode(view: any): void {
    const defaultModels: any = {
      neuron: 'iaf_psc_alpha',
      recorder: 'voltmeter',
      stimulator: 'dc_generator',
    };
    this.addNode({
      model: defaultModels[view.elementType],
      view: view,
    });
    this.networkChanges();
  }

  /**
   * Add connection component to the network.
   *
   * @remarks
   * When it connects to a recorder, it initializes activity graph.
   */
  addConnection(conn: any): void {
    const connection: Connection = new Connection(this, conn);
    this._connections.push(connection);

    // Initialize activity and activity graph.
    if (connection.view.connectRecorder()) {
      connection.recorder.initActivity();
      this._project.activityGraph.init();
    }
  }

  /**
   * Connect node components by user interaction.
   */
  connectNodes(source: Node, target: Node): void {
    this.addConnection({
      source: source.idx,
      target: target.idx,
    });
    this.networkChanges();
  }

  /**
   * Delete node component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteNode(node: Node): void {
    this._view.reset();
    this._connections = this._connections.filter(
      (c: Connection) => c.source !== node && c.target !== node
    );

    // Update source and target idx in connections
    this._connections.forEach(connection => {
      if (connection.sourceIdx > node.idx) {
        connection.sourceIdx -= 1;
      }
      if (connection.targetIdx > node.idx) {
        connection.targetIdx -= 1;
      }
    });

    // this.nodes = this.nodes.filter((n: Node) => n.idx !== node.idx);
    const idx: number = node.idx;
    this._nodes = this._nodes.slice(0, idx).concat(this.nodes.slice(idx + 1));

    // clean network
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
    this._view.reset();
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
   * @param network - network object
   */
  update(network: any): void {
    // add nodes to network.
    this._nodes = [];
    if (network.nodes) {
      network.nodes.forEach((node: any) => this.addNode(node));
    }

    // add connections to network.
    this._connections = [];
    if (network.connections) {
      network.connections.forEach((connection: any) =>
        this.addConnection(connection)
      );
    }

    this.clean();
    this.updateHash();
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
    this._hash = sha1(this.toJSON());
  }

  /**
   * Serialize for JSON.
   * @return network object
   */
  toJSON(): any {
    const connections: any[] = this._connections.map((connection: Connection) =>
      connection.toJSON()
    );
    const nodes: any[] = this._nodes.map((node: Node) => node.toJSON());
    return { connections, nodes };
  }
}
