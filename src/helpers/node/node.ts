// mode.ts

import { ILogObj, Logger } from "tslog";

import { Activity, ActivityProps } from "@/helpers/activity/activity";
import { AnalogSignalActivity } from "@/helpers/activity/analogSignalActivity";
import { Config } from "@/helpers/config";
import { Connection } from "@/types/connectionTypes";
import { Model } from "@/types/modelTypes";
import { ModelParameter } from "@/helpers/model/modelParameter";
import { Network } from "@/types/networkTypes";
import { Node } from "@/types/nodeTypes";
import {
  NodeParameter,
  NodeParameterProps,
} from "@/helpers/node/nodeParameter";
import { NodeRecord, NodeRecordProps } from "@/helpers/node/nodeRecord";
import { NodeState } from "@/helpers/node/nodeState";
import { NodeView, NodeViewProps } from "@/helpers/node/nodeView";
import { Nodes } from "@/types/nodesTypes";
import { SpikeActivity } from "@/helpers/activity/spikeActivity";
import { logger as mainLogger } from "@/helpers/common/logger";

export interface NodeProps {
  activity?: ActivityProps;
  annotations?: string[];
  model?: string;
  params?: NodeParameterProps[];
  records?: NodeRecordProps[];
  size?: number;
  view?: NodeViewProps;
}

export class BaseNode extends Config {
  private readonly _name = "Node";

  private _activity?: SpikeActivity | AnalogSignalActivity | Activity =
    // @ts-ignore
    undefined as Activity;
  private _annotations: string[] = [];
  private _doc: NodeProps;
  private _idx: number; // generative
  private _logger: Logger<ILogObj>;
  private _params: { [key: string]: NodeParameter } = {};
  private _paramsVisible: string[] = [];
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = []; // only for multimeter
  private _size: number;
  private _state: NodeState;
  private _view: NodeView;

  public _modelId: string;
  public _model: Model;
  public _nodes: Nodes; // parent

  constructor(nodes: Nodes, node: NodeProps = {}) {
    super("Node");

    this._nodes = nodes;
    this._idx = this.nodes.all.length;

    this._logger = mainLogger.getSubLogger({
      name: `[${this.nodes.network.project.shortId}] node`,
    });

    this._modelId = node.model || "iaf_psc_alpha";
    this._size = node.size || 1;
    this._annotations = node.annotations || [];
    this._doc = node;

    this._model = this.getModel(this._modelId);
    this._view = new NodeView(this, node.view);

    this._state = new NodeState(this);

    this.init(node);
  }

  get activity(): SpikeActivity | AnalogSignalActivity | Activity | undefined {
    return this._activity;
  }

  set activity(value: SpikeActivity | AnalogSignalActivity | Activity) {
    this._activity = value;
  }

  get annotations(): string[] {
    return this._annotations;
  }

  get connectedNodes(): Node[] {
    if (this.model.isSpikeRecorder) {
      return this.sourceNodes;
    }
    if (this.model.isAnalogRecorder) {
      return this.targetNodes;
    }
    return [];
  }

  get connections(): Connection[] {
    return this.network.connections.all.filter(
      (connection: Connection) => connection.sourceIdx === this._idx
    );
  }

  get connectionsNeurons(): Connection[] {
    return this.network.connections.all.filter(
      (connection: Connection) =>
        (connection.sourceIdx === this._idx &&
          connection.target.model.isNeuron) ||
        (connection.targetIdx === this._idx && connection.source.model.isNeuron)
    );
  }

  get connectionsNeuronSources(): Connection[] {
    return this.network.connections.all.filter(
      (connection: Connection) =>
        connection.targetIdx === this._idx && connection.source.model.isNeuron
    );
  }

  get connectionsNeuronTargets(): Connection[] {
    return this.network.connections.all.filter(
      (connection: Connection) =>
        connection.sourceIdx === this._idx && connection.target.model.isNeuron
    );
  }

  get connectionsStimulatorSources(): Connection[] {
    return this.network.connections.all.filter(
      (connection: Connection) =>
        connection.targetIdx === this._idx &&
        connection.source.model.isStimulator
    );
  }

  get doc(): NodeProps {
    return this._doc;
  }

  get elementType(): string {
    return this.model.elementType;
  }

  get filteredParams(): NodeParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
  }

  get firstTargetNodeSize(): number {
    return this.targetNodes.length > 0 ? this.targetNodes[0].size : 0;
  }

  get hash(): string {
    return this._state.hash;
  }

  get hasSomeVisibleParams(): boolean {
    return this._paramsVisible.length > 0 || this._modelId === "multimeter";
  }

  /**
   * Check if it is an excitatory neuron.
   */
  get isExcitatoryNeuron(): boolean {
    return this.model.isNeuron && this._view.synWeights === "excitatory";
  }

  /**
   * Check if it is an inhibitory neuron.
   */
  get isInhibitoryNeuron(): boolean {
    return this.model.isNeuron && this._view.synWeights === "inhibitory";
  }

  get idx(): number {
    return this._idx;
  }

  get label(): string {
    return this._view.label;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get model(): Model {
    if (this._model?.id !== this._modelId) {
      this._model = this.getModel(this._modelId);
    }
    return this._model;
  }

  /**
   * Set model.
   *
   * @remarks
   * It initializes parameters and activity components.
   * It triggers node changes.
   *
   * @param model - node model
   */
  set model(model: Model) {
    this._modelId = model.id;
    this._model = model;
    this.modelChanges();
  }

  get modelDBStore(): any {
    return this.nodes.network.project.modelDBStore;
  }

  get modelId(): string {
    return this._modelId;
  }

  /**
   * Set model ID.
   *
   * @param value - id of the model
   */
  set modelId(value: string) {
    this.model = this.getModel(value);
  }

  get modelParams(): { [key: string]: ModelParameter } {
    return this.model.params;
  }

  get models(): Model[] {
    // Get models of the same element type.
    const elementType: string = this.model.elementType;
    const models: Model[] =
      this.modelDBStore.getModelsByElementType(elementType);

    return models;
  }

  get n(): number {
    return this._size;
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this.nodes.network;
  }

  get nodes(): Nodes {
    return this._nodes;
  }

  get params(): { [key: string]: NodeParameter } {
    return this._params;
  }

  set params(values: { [key: string]: NodeParameter }) {
    Object.values(values).forEach((value: NodeParameter) => {
      this._params[value.id] = new NodeParameter(this, value);
    });
  }

  get paramsAll(): NodeParameter[] {
    return Object.values(this._params);
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes();
  }

  get recordables(): NodeRecord[] {
    return this._recordables;
  }

  set recordables(value: NodeRecord[]) {
    this._recordables = value;
  }

  get records(): NodeRecord[] {
    return this._records;
  }

  set records(value: NodeRecord[]) {
    this._records = value;
  }

  get recordsFixed(): string {
    return (
      "[" +
      this._records
        .map((record: NodeRecord) => '"' + record.id + '"')
        .join(",") +
      "]"
    );
  }

  get recordSpikes(): boolean {
    return (
      this.connections.filter((connection: Connection) =>
        connection.view.connectSpikeRecorder()
      ).length > 0
    );
  }

  get size(): number {
    return this._size;
  }

  /**
   * Set network size.
   */
  set size(value: number) {
    this._size = value;
    this.changes();
  }

  get sizeVisible(): boolean {
    return this._view.state.showSize;
  }

  get sourceNodes(): Node[] {
    const nodes: Node[] = this.network.connections.all
      .filter((connection: Connection) => connection.targetIdx === this._idx)
      .map((connection: Connection) => connection.source);
    return nodes;
  }

  get state(): NodeState {
    return this._state;
  }

  get targetNodes(): Node[] {
    return this.network.connections.all
      .filter((connection: Connection) => connection.sourceIdx === this._idx)
      .map((connection: Connection) => connection.target);
  }

  get view(): NodeView {
    return this._view;
  }

  /**
   * Add annotation to the list.
   * @param text - string
   */
  addAnnotation(text: string): void {
    if (this._annotations.indexOf(text) !== -1) return;
    this._annotations.push(text);
    this.changes();
  }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addParameter(param: NodeParameterProps): void {
    this._params[param.id] = new NodeParameter(this, param);
  }

  /**
   * Observer for node changes.
   *
   * @remarks
   * It emits network changes.
   */
  changes(): void {
    this.clean();
    this._state.updateHash();
    this._logger.trace("changes");
    this.nodes.network.changes();
  }

  /**
   * Clean node component.
   */
  clean(): void {
    const nodes = this.nodes.all as Node[];
    this._idx = nodes.indexOf(this);
    this.view.clean();
  }

  /**
   * Clone this node component.
   * @return cloned node component
   */
  clone(): BaseNode {
    return new BaseNode(this.nodes, { ...this.toJSON() });
  }

  /**
   * Get model.
   */
  getModel(modelId: string): Model {
    this._logger.trace("get model:", modelId);
    return this.modelDBStore.getModel(modelId);
  }

  /**
   * Get parameter component.
   * @param paramId - parameter ID
   * @return parameter component
   */
  getParameter(paramId: string): NodeParameter {
    return this._params[paramId];
  }

  /**
   * Check if node has parameter component.
   * @param paramId - parameter ID
   */
  hasParameter(paramId: string): boolean {
    return Object.keys(this._params).some(
      (paramKey: string) => paramKey === paramId
    );
  }

  /**
   * Check if node has params.
   */
  hasParameters(node: NodeProps): boolean {
    return "params" in node;
  }

  /**
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.paramsVisible = [];
  }

  /**
   * Initialize node.
   */
  init(node?: NodeProps): void {
    this._logger.trace("init");

    this.initParameters(node);

    if (this.model.isRecorder) {
      this.initActivity(node?.activity);
    }

    this._state.updateHash();
  }

  /**
   * Initialize activity for the recorder.
   */
  initActivity(activity?: ActivityProps): void {
    this._logger.trace("init activity");
    if (!this.model.isRecorder) {
      return;
    }

    if (this.model.isSpikeRecorder) {
      this._activity = new SpikeActivity(this, activity);
    } else if (this.model.isAnalogRecorder) {
      this._activity = new AnalogSignalActivity(this, activity);
    }
  }

  /**
   * Initialize parameter components.
   * @param node - node object
   */
  initParameters(node?: NodeProps): void {
    this._logger.trace("init parameters");
    this._paramsVisible = [];
    this._params = {};
    if (this.model) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) => {
        if (node && node.params) {
          const nodeParam = node.params.find(
            (param: NodeParameterProps) => param.id === modelParam.id
          );
          if (nodeParam) {
            this.addParameter({
              ...nodeParam,
              ...modelParam,
            });
            if (nodeParam.visible !== false) {
              this._paramsVisible.push(modelParam.id);
            }
          } else {
            this.addParameter(modelParam);
          }
        } else {
          this.addParameter(modelParam);
        }
      });
    } else if (node && node.params) {
      node.params.forEach((param: any) => this.addParameter(param));
    }
  }

  /**
   * Observer for model changes.
   *
   * @remarks
   * It emits node changes.
   */
  modelChanges(): void {
    this._logger.trace("model change");
    this.init();
    this.updateRecords();
    this.updateRecordsColor();

    // Trigger node change.
    this.changes();

    // Initialize activity graph.
    // if (this.model.isRecorder) {
    //   this.network.project.initActivityGraph();
    // }
  }

  /**
   * Delete node.
   *
   * @remarks
   * It removes node component of the network.
   */
  remove(): void {
    this.network.deleteNode(this);
  }

  /**
   * Remove annotation from the list.
   * @param text - string
   */
  removeAnnotation(text: string): void {
    if (this._annotations.indexOf(text) === -1) return;
    this._annotations.splice(this._annotations.indexOf(text), 1);
    this.changes();
  }

  /**
   * Remove record from the state.
   */
  removeRecord(record: any): void {
    this._records.splice(this._records.indexOf(record), 1);
    this._records = [...this._records];
  }

  reset(): void {}

  /**
   * Reset value in parameter components.
   *
   * @remarks
   * It emits node changes.
   */
  resetParameters(): void {
    this._logger.trace("reset parameters");
    this.paramsAll.forEach((param: NodeParameter) => {
      param.reset();
    });

    this.changes();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.paramsVisible = Object.keys(this._params);
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  toJSON(): NodeProps {
    const node: NodeProps = {
      model: this._modelId,
      view: this._view.toJSON(),
    };

    if (this._size > 1) {
      node.size = this._size;
    }

    if (this.filteredParams.length > 0) {
      node.params = this.filteredParams.map((param: NodeParameter) =>
        param.toJSON()
      );
    }

    // Add annotations if provided.
    if (this._annotations.length > 0) {
      node.annotations = this._annotations;
    }

    // Add records if this model is multimeter.
    if (this.model.isMultimeter) {
      node.records = this._records.map((nodeRecord: NodeRecord) =>
        nodeRecord.toJSON()
      );
    }

    return node;
  }

  /**
   * Update records.
   *
   * @remarks
   * It should be called after connections are created.
   */
  updateRecords(): void {
    this._logger.trace("update records");
    let recordables: any[] = [];
    // Initialize recordables.
    if (this.connections.length > 0) {
      if (this.model.isMultimeter) {
        const recordablesNodes = this.targetNodes.map((target: Node) => {
          return [...target.model.recordables];
        });
        if (recordablesNodes.length > 0) {
          const recordablesPooled: any[] = recordablesNodes.flat();
          recordables = [...new Set(recordablesPooled)];
          recordables.sort((a: any, b: any) => a.id - b.id);
        }
      } else if (this._modelId === "voltmeter") {
        recordables.push(
          this.model.config.recordables.find(
            (record: any) => record.id === "V_m"
          )
        );
      }
    }

    let recordableIds: string[];
    recordableIds = recordables.map((record: any) => record.id);
    this._recordables = [
      ...this._recordables.filter((record: NodeRecord) =>
        recordableIds.includes(record.id)
      ),
    ];

    recordableIds = this._recordables.map((record: any) => record.id);
    recordables
      .filter((record: any) => !recordableIds.includes(record.id))
      .forEach((record: any) => {
        this._recordables.push(new NodeRecord(this, record));
      });

    // Initialize selected records.
    if (this._doc.records != null) {
      // Load record from stored nodes.
      const recordIds = this._doc.records.map((record: any) => record.id);
      this._records = [
        ...this._recordables.filter((record: NodeRecord) =>
          recordIds.includes(record.id)
        ),
      ];
    } else if (this._records.length > 0) {
      // In case when user select other model.
      const recordIds = this._records.map((record: NodeRecord) => record.id);
      this._records = [
        ...this._recordables.filter((record: NodeRecord) =>
          recordIds.includes(record.id)
        ),
      ];
      this.records.forEach((record: NodeRecord) => record.updateGroupID());
    } else {
      this._records = [...this._recordables];
    }
  }

  // /**
  //  * Update receptor component.
  //  * @param receptorOld - node receptor object
  //  * @param receptorNew - receptor object
  //  */
  // updateReceptor(receptorOld: NodeReceptor, receptorNew: any): void {
  //   receptorNew.compIdx = receptorOld.compartment.idx;
  //   const receptorIdx = this._receptors.indexOf(receptorOld);
  //   this._receptors[receptorIdx] = new NodeReceptor(this, receptorNew);
  //   this._receptors = [...this._receptors];
  // }

  /**
   * Update record colors.
   */
  updateRecordsColor(): void {
    const color = this._view.color;
    this._recordables.forEach((record: NodeRecord) => {
      record.color = color;
    });
  }
}
