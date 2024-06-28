// node.ts

import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import {
  TConnection,
  TModel,
  TNetwork,
  TNode,
  TNodes,
  TSimulation,
} from "@/types";

import { Activity, IActivityProps } from "../activity/activity";
import { AnalogSignalActivity } from "../activity/analogSignalActivity";
import { SpikeActivity } from "../activity/spikeActivity";
import { onlyUnique } from "../common/array";
import { BaseObj } from "../common/base";
import { BaseModel } from "../model/model";
import { ModelParameter } from "../model/modelParameter";
import { NodeGroup } from "./nodeGroup";
import { INodeParamProps, NodeParameter } from "./nodeParameter";
import { INodeRecordProps, NodeRecord } from "./nodeRecord";
import { INodeViewProps, NodeView } from "./nodeView";

export interface INodeProps {
  activity?: IActivityProps;
  annotations?: string[];
  model?: string;
  params?: INodeParamProps[];
  records?: INodeRecordProps[];
  size?: number;
  view?: INodeViewProps;
}
// export class BaseNode<TModel extends BaseModel = BaseModel> extends BaseObj {
export class BaseNode extends BaseObj {
  private _activity?: SpikeActivity | AnalogSignalActivity | Activity =
    undefined;
  private _annotations: string[] = [];
  private _doc: INodeProps;
  private _params: Record<string, NodeParameter> = {};
  private _paramsVisible: string[] = [];
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = [];
  private _size: number;
  private _view: NodeView;
  public _model: TModel | undefined;
  public _modelId: string;
  public _nodes: TNodes; // parent

  constructor(nodes: TNodes, nodeProps: INodeProps = {}) {
    super({ config: { name: "Node" }, logger: { settings: { minLevel: 3 } } });

    this._nodes = nodes;
    this._modelId = nodeProps.model || "";
    this.loadModel(nodeProps.params);

    this._size = nodeProps.size || 1;
    this._annotations = nodeProps.annotations || [];
    this._doc = nodeProps;

    this._view = new NodeView(this, nodeProps.view);

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
      (connection: TConnection) => connection.sourceIdx === this.idx
    );
  }

  get connectionsNeurons(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        (connection.sourceIdx === this.idx &&
          connection.targetNode.model.isNeuron) ||
        (connection.targetIdx === this.idx &&
          connection.sourceNode.model.isNeuron)
    );
  }

  get connectionsNeuronSources(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        connection.targetIdx === this.idx &&
        connection.sourceNode.model.isNeuron
    );
  }

  get connectionsNeuronTargets(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        connection.sourceIdx === this.idx &&
        connection.targetNode.model.isNeuron
    );
  }

  get connectionsStimulatorSources(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        connection.targetIdx === this.idx &&
        connection.sourceNode.model.isStimulator
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

  get isGroup(): boolean {
    return false;
  }

  /**
   * Check if it is an inhibitory neuron.
   */
  get isInhibitoryNeuron(): boolean {
    return this.model.isNeuron && this._view.synWeights === "inhibitory";
  }

  get isNode(): boolean {
    return true;
  }

  /**
   * Check if this node is selected.
   */
  get isSelected(): boolean {
    return this.nodes.state.selectedNodes.includes(this);
  }

  /**
   * Check if this node is selected for connection.
   */
  get isSelectedForConnection(): boolean {
    return this.nodes.network.connections.state.selectedNode === this;
  }

  get idx(): number {
    return this._nodes.all.indexOf(this);
  }

  get label(): string {
    return this._view.label;
  }

  get model(): BaseModel {
    if (this._model?.id !== this._modelId) {
      this._model = this.getModel(this._modelId);
    }
    return this._model as BaseModel;
  }

  get modelDBStore(): TModelDBStore {
    return this.nodes.network.project.modelDBStore;
  }

  get modelId(): string {
    return this._modelId;
  }

  /**
   * Set model ID.
   */
  set modelId(value: string) {
    this._modelId = value;

    this.loadModel();
    this.modelChanges();
  }

  get modelParams(): Record<string, ModelParameter> {
    return this.model.params;
  }

  get models(): (TModel | any)[] {
    // Get models of the same element type.
    return this.modelDBStore.getModelsByElementType(this.elementType);
  }

  get n(): number {
    return this._size;
  }

  get network(): TNetwork {
    return this.nodes.network;
  }

  get nodes(): TNodes {
    return this._nodes;
  }

  get nodeGroups(): NodeGroup[] {
    return this._nodes.nodeGroups.filter((nodeGroup: NodeGroup) =>
      nodeGroup.nodeItemsDeep.includes(this)
    );
  }

  get nodeIdx(): number {
    // @ts-ignore - Argument of type 'this' is not assignable to parameter of type '(TNode & NESTNode) & NorseNode'.
    return this._nodes.nodes.indexOf(this);
  }

  get params(): Record<string, NodeParameter> {
    return this._params;
  }

  set params(values: Record<string, NodeParameter>) {
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

  get show(): boolean {
    return this._nodes.showNode(this);
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
      .filter((connection: TConnection) => connection.targetIdx === this.idx)
      .map((connection: TConnection) => connection.sourceNode);
  }

  get targetNodes(): TNode[] {
    return this.network.connections.all
      .filter((connection: TConnection) => connection.sourceIdx === this.idx)
      .map((connection: TConnection) => connection.targetNode);
  }

  get view(): NodeView {
    return this._view;
  }

  /**
   * Add annotation to the list.
   * @param text string
   */
  addAnnotation(text: string): void {
    if (this._annotations.indexOf(text) !== -1) return;
    this._annotations.push(text);
    this.changes();
  }

  /**
   * Add parameter component.
   * @param paramProps parameter props
   * @param visible boolean
   */
  addParameter(paramProps: INodeParamProps, visible: boolean = false): void {
    this.logger.trace("add parameter", paramProps.id, visible);
    this._params[paramProps.id] = new NodeParameter(this, paramProps);

    if (visible) {
      this._paramsVisible.push(paramProps.id);
    }
  }

  /**
   * Add parameters to the node.
   * @param paramsProps - list of parameter props
   */
  addParameters(paramsProps?: INodeParamProps[]): void {
    this.logger.trace("add parameters", paramsProps);

    this.emptyParams();

    if (this._model) {
      this._model.paramsAll.forEach((modelParam: ModelParameter) => {
        if (paramsProps && paramsProps.length > 0) {
          const nodeParamProps = paramsProps.find(
            (paramProps: INodeParamProps) => paramProps.id === modelParam.id
          );
          if (nodeParamProps) {
            this.addParameter(
              {
                ...nodeParamProps,
                ...modelParam,
              },
              true
            );
          } else {
            this.addParameter(modelParam);
          }
        } else {
          this.addParameter(modelParam);
        }
      });
    } else if (paramsProps) {
      paramsProps.forEach((param: INodeParamProps) =>
        this.addParameter(param, true)
      );
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
    this.view.clean();
  }

  /**
   * Clone this node component.
   * @return cloned node component.
   */
  clone(): TNode {
    this.logger.trace("clone");

    const nodeProps = this.toJSON();
    if (nodeProps.view) {
      nodeProps.view.position.y += 50;
      nodeProps.view.color = undefined;
    }
    return this.nodes.addNode({ ...nodeProps });
  }

  /**
   * Create activity for the recorder.
   * @param activityProps activity props
   */
  createActivity(activityProps?: IActivityProps): void {
    this.logger.trace("init activity");

    if (!this.model.isRecorder) return;

    if (this.model.isSpikeRecorder) {
      this._activity = new SpikeActivity(this, activityProps);
    } else if (this.model.isAnalogRecorder) {
      this._activity = new AnalogSignalActivity(this, activityProps);
    }
  }

  /**
   * Empty parameters
   */
  emptyParams(): void {
    this._params = {};
    this._paramsVisible = [];
  }

  /**
   * Get model.
   */
  getModel(modelId: string): TModel | undefined {
    this.logger.trace("get model:", modelId);

    return this.modelDBStore.getModel(modelId);
  }

  /**
   * Get parameter component.
   * @param paramId parameter ID
   * @return parameter component
   */
  getParameter(paramId: string): NodeParameter {
    return this._params[paramId];
  }

  /**
   * Check if node has parameter component.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return Object.keys(this._params).some(
      (paramKey: string) => paramKey === paramId
    );
  }

  /**
   * Check if node has params.
   * @param nodeProps node props
   */
  hasParameters(nodeProps: INodeProps): boolean {
    return "params" in nodeProps;
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

    // this.loadModel();
    this.update();
  }

  /**
   * Load model.
   */
  loadModel(paramsProps?: INodeParamProps[]): void {
    this.logger.trace("load model:", this._modelId, paramsProps);

    this._model = this.getModel(this._modelId);
    this.addParameters(paramsProps);
  }

  /**
   * Observer for model changes.
   *
   * @remarks
   * It emits node changes.
   */
  modelChanges(): void {
    this.logger.trace("model change");

    // this.init();
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
   * @param text string
   */
  removeAnnotation(text: string): void {
    if (this._annotations.indexOf(text) === -1) return;
    this._annotations.splice(this._annotations.indexOf(text), 1);
    this.changes();
  }

  /**
   * Remove record.
   * @param recordId string
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

    // this.resetParams();
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
   * Select this node.
   */
  select(): void {
    this._nodes.toggleNodeSelection(this);
  }

  /**
   * Select this node as source for connection.
   */
  selectForConnection(): void {
    this._nodes.network.connections.state.selectedNode = this;
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.paramsVisible = Object.keys(this._params);
  }

  /**
   * Serialize for JSON.
   * @return node props
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
      idx: this.idx,
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

    let recordables: INodeRecordProps[] = [];
    // Initialize recordables.
    if (this.connections.length > 0) {
      if (this.model.isMultimeter) {
        const recordablesNodes = this.targetNodes.map((target: TNode) => {
          return [...target.model.recordables];
        });
        if (recordablesNodes.length > 0) {
          const recordablesPooled: INodeRecordProps[] = recordablesNodes.flat();
          recordables = recordablesPooled.filter(onlyUnique);
          recordables.sort();
        }
      } else if (this._modelId === "voltmeter") {
        recordables.push(
          this.model.config?.localStorage.recordables.find(
            (record: INodeRecordProps) => record.id === "V_m"
          )
        );
      }
    }

    let recordableIds: string[];
    recordableIds = recordables.map((record: INodeRecordProps) => record.id);
    this._recordables = [
      ...this._recordables.filter((record: NodeRecord) =>
        recordableIds.includes(record.id)
      ),
    ];

    recordableIds = this._recordables.map(
      (record: INodeRecordProps) => record.id
    );
    recordables
      .filter((record: INodeRecordProps) => !recordableIds.includes(record.id))
      .forEach((record: INodeRecordProps) => {
        this._recordables.push(new NodeRecord(this, record));
      });

    // Initialize selected records.
    if (this._doc.records != null) {
      // Load record from stored nodes.
      const recordIds = this._doc.records.map(
        (record: INodeRecordProps) => record.id
      );
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
