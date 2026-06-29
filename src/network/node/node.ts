// node.ts

// import type { CodeNodeInterface } from "@babsey/code-graph";

import type { BaseModel, IModelRecordState, TNodeElementType } from "@/model";
import type { Class, TModel, TNetwork, TNode } from "@/types";
import type { IActivityState } from "@/activity";
import type { ModelParameters } from "@/model";
import { CodeNodeMask, type ICodeMaskParamState } from "@/codeGraph";
import { NodeAnalogSignalActivity, NodeSpikeActivity, type NodeActivity } from "@/activity";
import { notifyInfo, type IBaseState } from "@/core";
import { onlyUnique, sortString } from "@/utils";

import { BaseNodes } from "./nodes";
import { NodeParameters } from "./nodeParameters";
import { NodeRecord, type INodeRecordState } from "./nodeRecord";
import { NodeView, type INodeViewState } from "./nodeView";
import { BaseConnection } from "../connection";

export interface INodeState extends IBaseState {
  activity?: IActivityState;
  annotations?: string[];
  model?: string;
  params?: Record<string, ICodeMaskParamState>;
  records?: INodeRecordState[];
  size?: number;
  view?: INodeViewState;
}
// export class BaseNode<TModel extends BaseModel = BaseModel> extends BaseObj {
export class BaseNode<
  TNodes extends BaseNodes = BaseNodes,
  TState extends INodeState = INodeState,
  TConnection extends BaseConnection = BaseConnection,
> extends CodeNodeMask<TState> {
  private _activity?: NodeSpikeActivity | NodeAnalogSignalActivity | NodeActivity | undefined;
  private _annotations: string[] = [];
  private _nodes: TNodes; // parent
  private _params: NodeParameters;
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = [];
  private _size: number = 1;
  private _view: NodeView;

  public _model: TModel | undefined;
  public _modelId: string = "";

  constructor(nodes: TNodes) {
    super({ config: { name: "Node" } });
    this._nodes = nodes;

    this._params = new this.NodeParameters(this);
    this._view = new NodeView(this);
  }

  get NodeParameters(): Class<NodeParameters> {
    return NodeParameters;
  }

  get activity(): NodeSpikeActivity | NodeAnalogSignalActivity | NodeActivity | undefined {
    return this._activity;
  }

  set activity(value: NodeSpikeActivity | NodeAnalogSignalActivity | NodeActivity) {
    this._activity = value;
  }

  get annotations(): string[] {
    return this._annotations;
  }

  get connectedNodes(): TNode[] {
    if (this.model.isSpikeRecorder) return this.sourceNodes;
    if (this.model.isAnalogRecorder) return this.targetNodes;
    return [...this.sourceNodes, ...this.targetNodes];
  }

  get connectedRecorders(): TNode[] {
    return this.connectedNodes.filter((node: TNode) => node.model.isRecorder);
  }

  get connections(): TConnection[] {
    return this.network.connections.all.filter((connection: TConnection) => connection.source?.idx === this.idx);
  }

  get connectionsNeurons(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        (connection.source?.idx === this.idx && connection.targetNode.model.isNeuron) ||
        (connection.target?.idx === this.idx && connection.sourceNode.model.isNeuron),
    );
  }

  get connectionsNeuronSources(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) => connection.target?.idx === this.idx && connection.sourceNode.model.isNeuron,
    );
  }

  get connectionsNeuronTargets(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) => connection.source?.idx === this.idx && connection.targetNode.model.isNeuron,
    );
  }

  get connectionsStimulatorSources(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) => connection.target?.idx === this.idx && connection.sourceNode.model.isStimulator,
    );
  }

  get elementType(): TNodeElementType {
    return this.model?.elementType;
  }

  get firstTargetNodeSize(): number {
    return this.targetNodes.length > 0 ? this.targetNodes[0].size : 0;
  }

  get idx(): number {
    return this.nodes.all.indexOf(this);
  }

  /**
   * Check if it is an excitatory neuron.
   */
  get isExcitatoryNeuron(): boolean {
    return this.model?.isNeuron && this.view.synWeights === "excitatory";
  }

  get isRecorded(): boolean {
    return this.connectedNodes.some((node: TNode) => node.model.isRecorder);
  }

  get isGroup(): boolean {
    return false;
  }

  /**
   * Check if it is an inhibitory neuron.
   */
  get isInhibitoryNeuron(): boolean {
    return this.model?.isNeuron && this.view.synWeights === "inhibitory";
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

  get isSpatial(): boolean {
    return false;
  }

  get label(): string {
    return this.view.label;
  }

  get model(): BaseModel {
    if (this._model?.id !== this.modelId) this._model = this.getModel(this.modelId);
    return this._model as BaseModel;
  }

  get modelDBStore() {
    return this.nodes.network.project.modelDBStore;
  }

  get modelId(): string {
    return this._modelId;
  }

  set modelId(value: string) {
    this.loadModel(value);
    this.modelChanges();
  }

  get modelParams(): ModelParameters {
    return this.model.params as ModelParameters;
  }

  get modelStates(): IModelRecordState[] {
    return this.model.states;
  }

  get models(): TModel[] {
    // Get models of the same element type.
    return this.modelDBStore.getModelsByElementType(this.elementType);
  }

  get network(): TNetwork {
    return this.nodes.network;
  }

  get nodes(): TNodes {
    return this._nodes;
  }

  // get nodeGroups(): TNodeGroup[] {
  //   return this._nodes.nodeGroups.filter((nodeGroup: TNodeGroup) => nodeGroup.nodeItemsDeep.includes(this));
  // }

  get nodeIdx(): number {
    return this._nodes.all.indexOf(this);
  }

  get params(): NodeParameters {
    return this._params;
  }

  get parent(): TNodes {
    return this.nodes;
  }

  get recordables(): NodeRecord[] {
    return this._recordables;
  }

  set recordables(value: NodeRecord[]) {
    this._recordables = value;
    // this.changes({ preventSimulation: true });
  }

  get records(): NodeRecord[] {
    return this._records;
  }

  set records(value: NodeRecord[]) {
    this._records = value;
  }

  get recordsFixed(): string {
    return "[" + this.records.map((record: NodeRecord) => '"' + record.id + '"').join(",") + "]";
  }

  get recordSpikes(): boolean {
    return this.connections.filter((connection: TConnection) => connection.view.connectSpikeRecorder()).length > 0;
  }

  get show(): boolean {
    return this.nodes.showNode(this);
  }

  get size(): number {
    return Number(this.intf?.size?.value) ?? this._size;
  }

  set size(value: number) {
    this._size = value;
    if (this.intf?.size) this.intf.size.value = value;
  }

  get sizeVisible(): boolean {
    return this.view.state.showSize;
  }

  get sourceNodes(): TNode[] {
    return this.network.connections.all
      .filter((connection: TConnection) => connection.target?.idx === this.idx)
      .map((connection: TConnection) => connection.sourceNode);
  }

  get targetNodes(): TNode[] {
    return this.network.connections.all
      .filter((connection: TConnection) => connection.source?.idx === this.idx)
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
    if (this.annotations.indexOf(text) !== -1) return;
    this.annotations.push(text);
  }

  // /**
  //  * Clean node component.
  //  */
  // clean(): void {
  //   this.update();
  // }

  /**
   * Clone this node component.
   * @return cloned node component.
   */
  clone(): TNode {
    this.logger.trace("clone");

    const nodeState = this.save();

    if (nodeState.view) {
      const position = { ...nodeState.view.position };
      position.y += 72;
      nodeState.view.position = position;
      nodeState.view.color = undefined;
    }

    // Create node.
    const node = this.nodes.newNode({ ...nodeState });

    // Initialize node.
    node.init();

    return node;
  }

  /**
   * Correct connections to/from recorder.
   */
  correctRecorderConnections(): void {
    if (!this.model.isRecorder) return;

    // Correct connection direction to spike recorder.
    this.connections
      .filter((connection: TConnection) => connection.sourceNode?.model.isSpikeRecorder)
      .forEach((connection: TConnection) => {
        connection.reverse();
        notifyInfo("The connection from spike recorder was corrected.");
      });

    // Correct connection direction from analog recorder.
    this.sourceNodes.forEach((recorder: TNode) =>
      recorder.connections
        .filter((connection: TConnection) => connection.targetNode?.model.isAnalogRecorder)
        .forEach((connection: TConnection) => {
          connection.reverse();
          notifyInfo(`The connection to ${connection.recorder?.model.label} recorder was corrected.`);
        }),
    );
  }

  /**
   * Create activity for the recorder.
   * @param activityState activity state
   */
  createActivity(activityState?: IActivityState): void {
    this.logger.trace("create activity");

    if (!this.model.isRecorder) return;

    if (this.model.isSpikeRecorder) {
      this._activity = new NodeSpikeActivity(this);
    } else if (this.model.isAnalogRecorder) {
      this._activity = new NodeAnalogSignalActivity(this);
    }

    if (this.activity && activityState) this.activity.load(activityState);
  }

  /**
   * Get model.
   * @param modelId model ID
   */
  getModel(modelId: string): TModel | undefined {
    this.logger.trace("get model:", modelId);

    return this.modelDBStore.findModel(modelId);
  }

  /**
   * Get node record.
   * @param groupId string
   * @returns node record instance
   */
  getNodeRecord(groupId: string): NodeRecord | undefined {
    return this.records.find((record: NodeRecord) => record.groupId === groupId);
  }

  /**
   * Initialize node.
   * @remarks Do not call it in the constructor.
   */
  init(): void {
    this.logger.trace("init", this.modelId);

    this.view.init();
    this.params.init();

    this.update();
  }

  /**
   * Load node from state.
   * @param nodeState node state
   */
  load(nodeState: INodeState): void {
    this.logger.trace("load", nodeState);

    if (nodeState.model) this.loadModel(nodeState.model);
    if (nodeState.params) this.params.load(nodeState.params);
    if (nodeState.view) this.view.load(nodeState.view);
  }

  /**
   * Load model.
   * @param modelId model ID
   */
  loadModel(modelId: string): void {
    this.logger.trace("load model:", modelId);

    this._modelId = modelId;
    this._model = this.getModel(modelId);

    if (this.codeNode) {
      if (!this.model) {
        this.params.load();
        this.codeNode.variableName = "n";
        return;
      }

      if (this.model.variableName.length > 0) this.codeNode.variableName = this.model.variableName;
    }

    // Load model params
    const modelParamState = this.model.params.save();
    this.params.load(modelParamState);
  }

  /**
   * Observer for model changes.
   * @remarks It corrects connection direction to the recorder.
   * @remarks It updates as analog recorder or other connected analog recorders.
   */
  modelChanges(): void {
    this.logger.trace("model change");
    // let recorderModelChanged = false;

    if (this.model.isRecorder) {
      // this.correctRecorderConnections(); // Correct connection from/to recorder.
      // recorderModelChanged = true;
    } else {
      // Updates records of nodes connected to analog recorder.
      this.sourceNodes
        .filter((node: TNode) => node.model.isAnalogRecorder)
        .forEach((recorder: TNode) => recorder.updateAnalogRecorder());
    }

    this.update();
  }

  /**
   * Delete node.
   * @remarks It removes node component of the network.
   */
  remove(): void {
    this.network.deleteNode(this);
  }

  /**
   * Remove annotation from the list.
   * @param text string
   */
  removeAnnotation(text: string): void {
    if (this.annotations.indexOf(text) === -1) return;
    this.annotations.splice(this.annotations.indexOf(text), 1);
  }

  /**
   * Remove record.
   * @param recordId string
   */
  removeRecord(recordId: string): void {
    const recordIds = this.records.map((record: NodeRecord) => record.id);
    const recordIdx = recordIds.indexOf(recordId);
    this.records.splice(recordIdx, 1);
    this.records = [...this.records];
  }

  /**
   * Reset node.
   */
  reset(): void {
    this.logger.trace("reset");

    // this.params.reset();
  }

  /**
   * Save node to state.
   * @return node state
   */
  override save(): INodeState {
    const nodeState: INodeState = {
      model: this.modelId,
      view: this.view.save(),
    };

    if (this.size?.value > 1) nodeState.size = this.size.value;

    if (this.params.hasSomeVisibleParams) nodeState.params = this.params.save();

    // Add annotations if provided.
    // if (this.annotations.length > 0) nodeState.annotations = this.annotations;

    // Add records if this model is multimeter.
    // if (this.model.isMultimeter) nodeState.records = this.records.map((nodeRecord: NodeRecord) => nodeRecord.save());

    return nodeState;
  }

  /**
   * Select this node.
   */
  select(): void {
    this.nodes.selectNode(this);
  }

  /**
   * Select this node as source for connection.
   */
  selectForConnection(): void {
    this.nodes.network.connections.state.selectedNode = this;
  }

  showAllParams(): void {
    this.params.showAll();
  }

  /**
   * Toggle the selection of this node group.
   */
  toggleSelection(): void {
    this.nodes.toggleNodeSelection(this);
  }

  /**
   * Unselect this node.
   */
  unselect(): void {
    this.nodes.unselectNode(this);
  }

  /**
   * Update node.
   */
  update(): void {
    this.logger.trace("update");

    // this.view.updateStyle();
    if (this.model?.isRecorder) this.updateRecorder();
  }

  /**
   * Update as analog recorder.
   */
  updateAnalogRecorder(): void {
    this.logger.trace("update analog recorder");

    if (!this.model || !this.model.isAnalogRecorder) return;

    this.updateRecordables();
    this.updateRecords();
  }

  /**
   * Update recordables.
   * @remarks Convert model states to node records.
   */
  updateRecordables(): void {
    this.logger.trace("update recordables");

    let modelRecordStates: IModelRecordState[] = [];
    if (!this.model || !this.model.isAnalogRecorder || this.connections.length == 0) return;

    // Get model states from target nodes.
    const targetsModelStates = this.targetNodes.map((node: TNode) => [...node.modelStates].flat());
    if (targetsModelStates.length > 0) {
      const modelStatesPooled: IModelRecordState[] = targetsModelStates.flat();
      modelRecordStates = modelStatesPooled
        .filter((modelRecordState: IModelRecordState) => modelRecordState)
        .filter(onlyUnique);
      modelRecordStates.sort((a: { id: string }, b: { id: string }) => sortString(a.id, b.id));
    }

    // Convert model states to node records.
    this._recordables = modelRecordStates.map(
      (modelRecordState: IModelRecordState) => new NodeRecord(this, modelRecordState),
    );

    this.updateRecordsColor();
  }

  /**
   * Update as recorder.
   */
  updateRecorder(): void {
    this.logger.trace("update recorder");

    if (!this.model || !this.model.isRecorder) return;

    // Create activity.
    if (!this.activity) this.createActivity();

    // Update analog recorder.
    if (this.model.isAnalogRecorder) this.updateAnalogRecorder();
  }

  /**
   * Update records.
   * @remarks It should be called after connections are created.
   */
  updateRecords(): void {
    this.logger.trace("update records");

    // Initialize selected records.
    if (this.props?.value && this.props?.value.records != null) {
      // Load record from stored nodes.
      const recordIds = this.props.value.records.map((recordState: INodeRecordState) => recordState.id);
      this.records = [...this.recordables.filter((record: NodeRecord) => recordIds.includes(record.id))];
    } else if (this.records.length > 0) {
      const recordIds = this.recordables.map((record: NodeRecord) => record.id);
      this.records = [...this.records.filter((record: NodeRecord) => recordIds.includes(record.id))];
      this.records.forEach((record: NodeRecord) => (record.node = this));
    } else {
      this.records = [...this.recordables];
    }
  }

  /**
   * Update record colors.
   */
  updateRecordsColor(): void {
    const color = this.view.color;
    this.recordables.forEach((record: NodeRecord) => (record.state.color = color));
  }
}
