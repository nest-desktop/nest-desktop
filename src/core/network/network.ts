import { Config } from '../common/config';
import { Connection } from '../connection/connection';
import { consoleLog } from '../common/logger';
import { NetworkCode } from './networkCode';
import { NetworkState } from './networkState';
import { Node } from '../node/node';
import { Project } from '../project/project';

export class Network extends Config {
  private _code: NetworkCode; // network code
  private _connections: Connection[] = []; // for nest.Connect
  private _nodes: Node[] = []; // for nest.Create
  private _project: Project; // project
  private _state: NetworkState; // network state

  constructor(project: Project, network: any = {}) {
    super('Network');
    this._project = project;
    this._code = new NetworkCode(this);
    this._state = new NetworkState(this);

    this.update(network);
  }

  get code(): NetworkCode {
    return this._code;
  }

  get colors(): string[] {
    return this.config.color.cycle;
  }

  set colors(value: string[]) {
    const color: any = this.config.color;
    color.cycle = value;
    this.config.update({ color });
  }

  get connections(): Connection[] {
    return this._connections;
  }

  set connections(values: Connection[]) {
    this._connections = values;
    this._connections.forEach((connection: Connection) => {
      connection.clean();
    });

    this.updateRecords();
    this.updateRecordsColor();

    this.networkChanges();
  }

  get neurons(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isNeuron());
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

    this.updateRecords();
    this.updateRecordsColor();

    this.networkChanges();
  }

  get project(): Project {
    return this._project;
  }

  get recorders(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isRecorder());
  }

  get recordersAnalog(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isAnalogRecorder());
  }

  get state(): NetworkState {
    return this._state;
  }

  get stimulators(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isStimulator());
  }

  get visibleNodes(): Node[] {
    return this._nodes.filter((node: Node) => node.view.visible);
  }

  get visibleConnections(): Connection[] {
    return this._connections.filter(
      (connection: Connection) => connection.view.visible
    );
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 5);
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
    this.clean();

    this._project.code.generate();
    this._state.updateHash();
    this._project.updateHash();

    this._project.commitNetwork(this);

    // Simulate when the configuration is set
    // and the view mode is activity explorer.
    const projectView = this._project.app.project.view;
    if (
      projectView.config.simulateAfterChange &&
      projectView.state.modeIdx === 1
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
  addNode(data: any): void {
    this.consoleLog('Add node');
    this._nodes.push(new Node(this, data));
  }

  /**
   * Create node component by user interaction.
   */
  createNode(view: any): void {
    this.consoleLog('Create node');

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
   */
  addConnection(data: any): Connection {
    this.consoleLog('Add connection');
    const connection: Connection = new Connection(this, data);
    this._connections.push(connection);
    return connection;
  }

  /**
   * Connect node components by user interaction.
   *
   * @remarks
   * When it connects to a recorder, it initializes activity graph.
   */
  connectNodes(source: Node, target: Node): void {
    this.consoleLog('Connect nodes');

    const weight: string = source.view.weight;
    const connection: Connection = this.addConnection({
      source: source.idx,
      target: target.idx,
    });
    if (weight === 'inhibitory') {
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
   * Delete node component from the network.
   *
   * @remarks
   * It emits network changes.
   */
  deleteNode(node: Node): void {
    this.consoleLog('Delete node');

    this._state.reset();
    this._connections = this._connections.filter(
      (connection: Connection) =>
        connection.source !== node && connection.target !== node
    );

    // Update source and target idx in connections
    this._connections.forEach((connection: Connection) => {
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
  deleteConnection(connection: Connection): void {
    this.consoleLog('Delete connection');

    this._state.reset();
    // this.connections = this.connections.filter((c: Connection) => c.idx !== connection.idx);
    const idx: number = connection.idx;
    this._connections = this._connections
      .slice(0, idx)
      .concat(this.connections.slice(idx + 1));

    // Trigger network change.
    this.networkChanges();

    // Initialize activity graph.
    this._project.initActivityGraph();
  }

  /**
   * Clean nodes and connection components.
   */
  clean(): void {
    this._nodes.forEach((node: Node) => node.clean());
    this._connections.forEach((connection: Connection) => connection.clean());

    this._connections.forEach((connection: Connection) => {
      connection.sourceSlice.update();
      connection.targetSlice.update();
    });

    this._state.updateHash();
  }

  /**
   * Copy network component.
   */
  override copy(item: any): any {
    return Object.assign({}, item);
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
    // Add nodes to network.
    this._nodes = [];
    if (network.nodes) {
      network.nodes.forEach((data: any) => this.addNode(data));
    }

    // Add connections to network.
    this._connections = [];
    if (network.connections) {
      network.connections.forEach((data: any) => this.addConnection(data));
    }

    this.updateRecords();
    this.clean();
  }

  /**
   * Update records of recorders.
   *
   * @remarks
   * It should be called after network created.
   */
  updateRecords(): void {
    this.recorders.forEach((recorder: Node) => recorder.updateRecords());
  }

  /**
   * Update records color of recorders.
   */
  updateRecordsColor(): void {
    this.recorders.forEach((recorder: Node) => recorder.updateRecordsColor());
  }

  /**
   * Clear the network by deleting every node and every connection.
   *
   * @remarks
   * It emits network changes.
   */
  empty(): void {
    this._state.reset();
    this._connections = [];
    this._nodes = [];
    this.clean();
    this.networkChanges();
  }

  isEmpty(): boolean {
    return this._nodes.length === 0 && this._connections.length === 0;
  }

  /**
   * Check if network has any spatial nodes.
   */
  hasPositions(): boolean {
    return this._nodes.some((node: Node) => node.spatial.hasPositions());
  }

  /**
   * Get node color.
   */
  getNodeColor(idx: number): string {
    const colors: string[] = this.config.color.cycle;
    return colors[idx % colors.length];
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
