// node.ts

import type { AbstractCodeNode, CodeNodeInterface } from "@babsey/code-graph";

import type { Class, TConnection, TModel, TNetwork, TNode, TNodeGroup, TNodes, TProject } from "@/types";
import { CodeNodeMask } from "@/codeGraph";

import type { BaseModel, IModelRecordState, TElementType } from "@/helpers/model";
import type { IActivityState } from "@/helpers/activity";
import type { ModelParameters } from "@/helpers/model/modelParameters";
import { NodeAnalogSignalActivity, NodeSpikeActivity, type NodeActivity } from "@/helpers/nodeActivity";
import { notifyInfo, type IBaseState, type IParamState } from "@/helpers/common";
import { onlyUnique, sortString } from "@/utils/array";

import { BaseNodes } from "./nodes";
import { NodeParameters } from "./nodeParameters";
import { NodeRecord, type INodeRecordState } from "./nodeRecord";
import { NodeView, type INodeViewState } from "./nodeView";
import { loadNESTCreateNode, updateNESTCreateNode } from "@/codeGraph/codeNodeTypes/nest/nestCreate";

export interface INodeState extends IBaseState {
  activity?: IActivityState;
  annotations?: string[];
  model?: string;
  params?: Record<string, IParamState>;
  records?: INodeRecordState[];
  size?: number;
  view?: INodeViewState;
}
// export class BaseNode<TModel extends BaseModel = BaseModel> extends BaseObj {
export class BaseNode<T extends INodeState = INodeState> extends CodeNodeMask<T> {
  private _activity?: NodeSpikeActivity | NodeAnalogSignalActivity | NodeActivity | undefined;
  private _annotations: string[] = [];
  private _params: NodeParameters;
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = [];
  private _size: number = 1;
  private _view: NodeView;
  public _model: TModel | undefined;
  public _modelId: string = "";
  public _nodes: BaseNodes; // parent

  constructor(nodes: BaseNodes) {
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

  get elementType(): TElementType {
    return this.model?.elementType;
  }

  get firstTargetNodeSize(): number {
    return this.targetNodes.length > 0 ? this.targetNodes[0].size : 0;
  }

  override get hashObject(): IBaseState {
    return {
      idx: this.idx,
      model: this._modelId,
      params: this.params.hash,
      recordables: this._recordables.map((recordable: NodeRecord) => recordable.uuid),
      size: this._size,
    };
  }

  get idx(): number {
    return this._nodes.all.indexOf(this);
  }

  /**
   * Check if it is an excitatory neuron.
   */
  get isExcitatoryNeuron(): boolean {
    return this.model?.isNeuron && this._view.synWeights === "excitatory";
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
    return this.model?.isNeuron && this._view.synWeights === "inhibitory";
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
    return this._view.label;
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

  get n(): number {
    return this._size;
  }

  get network(): TNetwork {
    return this.nodes.network;
  }

  get nodes(): TNodes {
    return this._nodes;
  }

  get nodeGroups(): TNodeGroup[] {
    return this._nodes.nodeGroups.filter((nodeGroup: TNodeGroup) => nodeGroup.nodeItemsDeep.includes(this));
  }

  get nodeIdx(): number {
    return this._nodes.all.indexOf(this);
  }

  get params(): NodeParameters {
    return this._params;
  }

  get parentNodes(): TNodes {
    return this._nodes;
  }

  get project(): TProject {
    return this._nodes.network.project as TProject;
  }

  get recordables(): NodeRecord[] {
    return this._recordables;
  }

  set recordables(value: NodeRecord[]) {
    this._recordables = value;
    this.changes({ preventSimulation: true });
  }

  get records(): NodeRecord[] {
    return this._records;
  }

  set records(value: NodeRecord[]) {
    this._records = value;
  }

  get recordsFixed(): string {
    return "[" + this._records.map((record: NodeRecord) => '"' + record.id + '"').join(",") + "]";
  }

  get recordSpikes(): boolean {
    return this.connections.filter((connection: TConnection) => connection.view.connectSpikeRecorder()).length > 0;
  }

  get show(): boolean {
    return this._nodes.showNode(this);
  }

  get size(): CodeNodeInterface | undefined {
    return this.intf?.size;
  }

  // /**
  //  * Set network size.
  //  */
  // set size(value: number) {
  //   this._size = value;
  //   this.changes();
  // }

  get sizeVisible(): boolean {
    return this._view.state.showSize;
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
   * @param emitChanges boolean
   */
  addAnnotation(text: string, emitChanges: boolean = true): void {
    if (this._annotations.indexOf(text) !== -1) return;
    this._annotations.push(text);

    if (emitChanges) this.changes();
  }

  /**
   * Observer for node changes.
   * @remarks It emits network changes.
   */
  changes(props = {}): void {
    this.logger.trace("changes");

    this.update();
    this.nodes.network.changes(props);
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

    const nodeState = this.save();

    if (nodeState.view) {
      const position = { ...nodeState.view.position };
      position.y += 72;
      nodeState.view.position = position;
      nodeState.view.color = undefined;
    }

    // Add node.
    const node = this.nodes.addNode({ ...nodeState });

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
      .filter((connection: TConnection) => connection.sourceNode.model.isSpikeRecorder)
      .forEach((connection: TConnection) => {
        connection.reverse();
        notifyInfo("The connection from spike recorder was corrected.");
      });

    // Correct connection direction from analog recorder.
    this.sourceNodes.forEach((recorder: TNode) =>
      recorder.connections
        .filter((connection: TConnection) => connection.targetNode.model.isAnalogRecorder)
        .forEach((connection: TConnection) => {
          connection.reverse();
          notifyInfo(`The connection to ${connection.recorder.model.label} recorder was corrected.`);
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
      this._activity = new NodeSpikeActivity(this, activityState);
    } else if (this.model.isAnalogRecorder) {
      this._activity = new NodeAnalogSignalActivity(this, activityState);
    }
  }

  /**
   * Get model.
   * @param modelId model ID
   */
  getModel(modelId: string): TModel | undefined {
    // this.logger.trace("get model:", modelId);

    return this.modelDBStore.findModel(modelId);
  }

  /**
   * Get node record.
   * @param groupId string
   * @returns node record instance
   */
  getNodeRecord(groupId: string): NodeRecord | undefined {
    return this._records.find((record: NodeRecord) => record.groupId === groupId);
  }

  /**
   * Initialize node.
   * @remarks Do not call it in the constructor.
   */
  init(): void {
    this.logger.trace("init", this.modelId);

    this.view.init();
    this.params.init();

    // if (this.model.isRecorder) this.updateRecorder();
    this.update();
  }

  /**
   * Load node from state.
   * @param nodeState node state
   */
  load(nodeState: INodeState): void {
    this.logger.trace("load", nodeState);

    if (nodeState.model) this.loadModel(nodeState.model);
    this.params.load(nodeState.params);
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
    this.params.load(this.model.params.save());
  }

  /**
   * Observer for model changes.
   * @remarks It emits node changes.
   * @remarks It corrects connection direction to the recorder.
   * @remarks It updates as analog recorder or other connected analog recorders.
   */
  modelChanges(): void {
    this.logger.trace("model change");
    let recorderModelChanged = false;

    const engine = this.network.project.code.engine;
    engine.pause();
    updateNESTCreateNode(this.codeNode, this.save());
    engine.resume();
    engine.runOnce();

    if (this.model.isRecorder) {
      this.correctRecorderConnections(); // Correct connection from/to recorder.
      this.updateRecorder(); // Update records of this analog recorder.
      recorderModelChanged = true;
    } else if (!this.model.isSpikeRecorder) {
      // Updates records of the connected analog recorder.
      this.sourceNodes
        .filter((node: TNode) => node.model.isAnalogRecorder)
        .forEach((recorder: TNode) => recorder.updateAnalogRecorder());
    }

    this.update();
    this.nodes.network.changes({ preventSimulation: true, cleanPanels: recorderModelChanged });
  }

  /**
   * Register code node.
   * @param codeNode code node
   */
  registerCodeNode(codeNode?: AbstractCodeNode): void {
    this.logger.trace("register code node");

    this.codeNode = codeNode;
    this.codeNode.mask = this;
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
  removeAnnotation(text: string, emitChanges: boolean = true): void {
    if (this._annotations.indexOf(text) === -1) return;
    this._annotations.splice(this._annotations.indexOf(text), 1);
    if (emitChanges) this.changes();
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

    // this.params.reset();
  }

  /**
   * Save node to state.
   * @return node state
   */
  override save(): INodeState {
    const nodeState: INodeState = {
      model: this._modelId,
      view: this._view.save(),
    };

    if (this.size?.value > 1) nodeState.size = this.size.value;

    if (this.params.hasSomeVisibleParams) nodeState.params = this.params.save();

    // Add annotations if provided.
    // if (this._annotations.length > 0) nodeState.annotations = this._annotations;

    // Add records if this model is multimeter.
    // if (this.model.isMultimeter) nodeState.records = this._records.map((nodeRecord: NodeRecord) => nodeRecord.save());

    return nodeState;
  }

  /**
   * Select this node.
   */
  select(): void {
    this._nodes.selectNode(this);
  }

  /**
   * Select this node as source for connection.
   */
  selectForConnection(): void {
    this._nodes.network.connections.state.selectedNode = this;
  }

  showAllParams(emitChanges: boolean = true): void {
    this.params.showAll(false);

    if (emitChanges) this.changes();
  }

  /**
   * Toggle the selection of this node group.
   */
  toggleSelection(): void {
    this._nodes.toggleNodeSelection(this);
  }

  /**
   * Unselect this node.
   */
  unselect(): void {
    this._nodes.unselectNode(this);
  }

  /**
   * Update node.
   */
  update(): void {
    this.clean();

    this.view.updateStyle();
    this.updateHash();
  }

  /**
   * Update as analog recorder.
   */
  updateAnalogRecorder(): void {
    this.logger.trace("update analog recorder");

    if (!this.model.isAnalogRecorder) return;

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
    if (!this.model.isAnalogRecorder || this.connections.length == 0) return;

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
    this.recordables = modelRecordStates.map(
      (modelRecordState: IModelRecordState) => new NodeRecord(this, modelRecordState),
    );

    this.updateRecordsColor();
  }

  /**
   * Update as recorder.
   */
  updateRecorder(): void {
    this.logger.trace("update analog recorder");

    if (!this.model.isRecorder) return;

    // Create activity.
    this.createActivity(this.props.activity);

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
    if (this.props.value && this.props.value.records != null) {
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
    const color = this._view.color;
    this._recordables.forEach((record: NodeRecord) => (record.state.color = color));
  }
}
