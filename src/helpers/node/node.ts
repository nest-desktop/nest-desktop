// node.ts

import { Activity, IActivityProps } from "../activity/activity";
import { AnalogSignalActivity } from "../activity/analogSignalActivity";
import { BaseObj } from "../common/base";
import { ModelParameter } from "../model/modelParameter";
import { INodeParamProps, NodeParameter } from "./nodeParameter";
import { INodeRecordProps, NodeRecord } from "./nodeRecord";
import { NodeState } from "./nodeState";
import { INodeViewProps, NodeView } from "./nodeView";
import { SpikeActivity } from "../activity/spikeActivity";
import { TConnection } from "@/types/connectionTypes";
import { TModel } from "@/types/modelTypes";
import { TNetwork } from "@/types/networkTypes";
import { TNode } from "@/types/nodeTypes";
import { TNodes } from "@/types/nodesTypes";
import { TSimulation } from "@/types/simulationTypes";

export interface INodeProps {
  activity?: IActivityProps;
  annotations?: string[];
  model?: string;
  params?: INodeParamProps[];
  records?: INodeRecordProps[];
  size?: number;
  view?: INodeViewProps;
}

export class BaseNode extends BaseObj {
  private readonly _name = "Node";

  private _activity?: SpikeActivity | AnalogSignalActivity | Activity =
    // @ts-ignore
    undefined as Activity;
  private _annotations: string[] = [];
  private _doc: INodeProps;
  private _idx: number; // generative
  private _params: { [key: string]: NodeParameter } = {};
  private _paramsVisible: string[] = [];
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = []; // only for multimeter
  private _size: number;
  private _state: NodeState;
  private _view: NodeView;

  public _modelId: string;
  public _model: TModel;
  public _nodes: TNodes; // parent

  constructor(nodes: TNodes, nodeProps: INodeProps = {}) {
    super({ config: { name: "Node" }, logger: { settings: { minLevel: 3 } } });

    this._nodes = nodes;
    this._idx = this.nodes.all.length;

    this._modelId = nodeProps.model || "iaf_psc_alpha";
    this._size = nodeProps.size || 1;
    this._annotations = nodeProps.annotations || [];
    this._doc = nodeProps;

    this._model = this.getModel(this._modelId);
    this._view = new NodeView(this, nodeProps.view);

    this._state = new NodeState(this);

    this.addParameters(nodeProps.params);

    if (this.model.isRecorder) {
      this.createActivity(nodeProps?.activity);
    }
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

  get connectedNodes(): TNode[] {
    if (this.model.isSpikeRecorder) {
      return this.sourceNodes;
    }
    if (this.model.isAnalogRecorder) {
      return this.targetNodes;
    }
    return [];
  }

  get connections(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) => connection.sourceIdx === this._idx
    );
  }

  get connectionsNeurons(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        (connection.sourceIdx === this._idx &&
          connection.target.model.isNeuron) ||
        (connection.targetIdx === this._idx && connection.source.model.isNeuron)
    );
  }

  get connectionsNeuronSources(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        connection.targetIdx === this._idx && connection.source.model.isNeuron
    );
  }

  get connectionsNeuronTargets(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        connection.sourceIdx === this._idx && connection.target.model.isNeuron
    );
  }

  get connectionsStimulatorSources(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        connection.targetIdx === this._idx &&
        connection.source.model.isStimulator
    );
  }

  get doc(): INodeProps {
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

  get hasSomeVisibleParams(): boolean {
    return this._paramsVisible.length > 0;
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

  get model(): TModel {
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
  set model(model: TModel) {
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

  get models(): TModel[] {
    // Get models of the same element type.
    const elementType: string = this.model.elementType;
    const models: TModel[] =
      this.modelDBStore.getModelsByElementType(elementType);

    return models;
  }

  get n(): number {
    return this._size;
  }

  get name(): string {
    return this._name;
  }

  get network(): TNetwork {
    return this.nodes.network;
  }

  get nodes(): TNodes {
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
      this.connections.filter((connection: TConnection) =>
        connection.view.connectSpikeRecorder()
      ).length > 0
    );
  }

  get simulation(): TSimulation {
    return this.nodes.network.project.simulation;
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

  get sourceNodes(): TNode[] {
    return this.network.connections.all
      .filter((connection: TConnection) => connection.targetIdx === this._idx)
      .map((connection: TConnection) => connection.source);
  }

  get state(): NodeState {
    return this._state;
  }

  get targetNodes(): TNode[] {
    return this.network.connections.all
      .filter((connection: TConnection) => connection.sourceIdx === this._idx)
      .map((connection: TConnection) => connection.target);
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
   * @param param - parameter props
   */
  addParameter(paramProps: INodeParamProps): void {
    this._params[paramProps.id] = new NodeParameter(this, paramProps);
  }

  /**
   * Add parameters to the node.
   * @param paramsProps - list of parameter props
   */
  addParameters(paramsProps?: INodeParamProps[]): void {
    this.logger.trace("add parameters");
    this._paramsVisible = [];
    this._params = {};
    if (this.model) {
      Object.values(this.model.params).forEach((modelParam: ModelParameter) => {
        if (paramsProps && paramsProps.length > 0) {
          const nodeParamProps = paramsProps.find(
            (paramProps: INodeParamProps) => paramProps.id === modelParam.id
          );
          if (nodeParamProps) {
            this.addParameter({
              ...nodeParamProps,
              ...modelParam,
            });
            if (nodeParamProps.visible !== false) {
              this._paramsVisible.push(nodeParamProps.id);
            }
          } else {
            this.addParameter(modelParam);
          }
        } else {
          this.addParameter(modelParam);
        }
      });
    } else if (paramsProps) {
      paramsProps.forEach((param: INodeParamProps) => this.addParameter(param));
    }
  }

  /**
   * Observer for node changes.
   *
   * @remarks
   * It emits network changes.
   */
  changes(): void {
    this.logger.trace("changes");

    this.update();
    this.nodes.network.changes();
  }

  /**
   * Clean node component.
   */
  clean(): void {
    const nodes = this.nodes.all as TNode[];
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
   * Create activity for the recorder.
   */
  createActivity(activityProps?: IActivityProps): void {
    this.logger.trace("init activity");
    if (!this.model.isRecorder) {
      return;
    }

    if (this.model.isSpikeRecorder) {
      this._activity = new SpikeActivity(this, activityProps);
    } else if (this.model.isAnalogRecorder) {
      this._activity = new AnalogSignalActivity(this, activityProps);
    }
  }

  /**
   * Get model.
   */
  getModel(modelId: string): TModel {
    this.logger.trace("get model:", modelId);
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
  hasParameters(node: INodeProps): boolean {
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
  init(): void {
    this.logger.trace("init");

    this.reset();
    this.update();
  }

  /**
   * Observer for model changes.
   *
   * @remarks
   * It emits node changes.
   */
  modelChanges(): void {
    this.logger.trace("model change");

    this.init();
    this.nodes.network.changes();
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
   * Remove record.
   */
  removeRecord(recordId: string): void {
    const recordIds = this._records.map((record: NodeRecord) => record.id);
    const recordIdx = recordIds.indexOf(recordId);
    this._records.splice(recordIdx, 1);
    this._records = [...this._records];
  }

  /**
   * Reset node.
   */
  reset(): void {
    this.logger.trace("reset");
    this.resetParams();
  }

  /**
   * Reset value in parameter components.
   *
   * @remarks
   * It emits node changes.
   */
  resetParams(): void {
    this.logger.trace("reset parameters");
    this.paramsAll.forEach((param: NodeParameter) => param.reset());
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
  toJSON(): INodeProps {
    const nodeProps: INodeProps = {
      model: this._modelId,
      view: this._view.toJSON(),
    };

    if (this._size > 1) {
      nodeProps.size = this._size;
    }

    if (this.filteredParams.length > 0) {
      nodeProps.params = this.filteredParams.map((param: NodeParameter) =>
        param.toJSON()
      );
    }

    // Add annotations if provided.
    if (this._annotations.length > 0) {
      nodeProps.annotations = this._annotations;
    }

    // Add records if this model is multimeter.
    if (this.model.isMultimeter) {
      nodeProps.records = this._records.map((nodeRecord: NodeRecord) =>
        nodeRecord.toJSON()
      );
    }

    return nodeProps;
  }

  /**
   * Update node.
   */
  update(): void {
    this.clean();
    this.updateRecords();
    this.updateRecordsColor();
    this.updateHash();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      idx: this._idx,
      model: this._modelId,
      params: this.paramsAll.map((param: NodeParameter) => param.toJSON()),
      size: this._size,
    });
  }

  /**
   * Update records.
   *
   * @remarks
   * It should be called after connections are created.
   */
  updateRecords(): void {
    this.logger.trace("update records");
    let recordables: any[] = [];
    // Initialize recordables.
    if (this.connections.length > 0) {
      if (this.model.isMultimeter) {
        const recordablesNodes = this.targetNodes.map((target: TNode) => {
          return [...target.model.recordables];
        });
        if (recordablesNodes.length > 0) {
          const recordablesPooled: any[] = recordablesNodes.flat();
          recordables = [...new Set(recordablesPooled)];
          recordables.sort((a: any, b: any) => a.id - b.id);
        }
      } else if (this._modelId === "voltmeter") {
        recordables.push(
          this.model.config?.localStorage.recordables.find(
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
