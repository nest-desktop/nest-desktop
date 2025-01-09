// node.ts

import { TConnection, TModel, TNetwork, TNode, TNodes, TSimulation } from "@/types";

import { BaseModel, IModelStateProps, TElementType } from "../model/model";
import { BaseNodes } from "./nodes";
import { BaseObj } from "../common/base";
import { IActivityProps } from "../activity/activity";
import { INodeRecordProps, NodeRecord } from "./nodeRecord";
import { INodeViewProps, NodeView } from "./nodeView";
import { IParamProps } from "../common/parameter";
import { ModelParameter } from "../model/modelParameter";
import { NodeGroup } from "./nodeGroup";
import { NodeParameter } from "./nodeParameter";
import { NodeActivity } from "../nodeActivity/nodeActivity";
import { NodeAnalogSignalActivity } from "../nodeActivity/nodeAnalogSignalActivity";
import { NodeSpikeActivity } from "../nodeActivity/nodeSpikeActivity";
import { notifyInfo } from "../common/notification";
import { onlyUnique, sortString } from "../../utils/array";

export interface INodeProps {
  activity?: IActivityProps;
  annotations?: string[];
  model?: string;
  params?: IParamProps[];
  records?: INodeRecordProps[];
  size?: number;
  view?: INodeViewProps;
}
// export class BaseNode<TModel extends BaseModel = BaseModel> extends BaseObj {
export class BaseNode extends BaseObj {
  private _activity?: NodeSpikeActivity | NodeAnalogSignalActivity | NodeActivity | undefined;
  private _annotations: string[] = [];
  private _props: INodeProps; // raw data of props
  private _params: Record<string, NodeParameter> = {};
  private _paramsVisible: string[] = [];
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = [];
  private _size: number;
  private _view: NodeView;
  public _model: TModel | undefined;
  public _modelId: string;
  public _nodes: BaseNodes; // parent

  constructor(nodes: TNodes, nodeProps: INodeProps = {}) {
    super({ config: { name: "Node" }, logger: { settings: { minLevel: 3 } } });

    this._nodes = nodes;
    this._modelId = nodeProps.model || "";

    this._size = nodeProps.size || 1;
    this._annotations = nodeProps.annotations || [];
    this._props = nodeProps;

    this._view = new NodeView(this, nodeProps.view);
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
    if (this.model.isSpikeRecorder) {
      return this.sourceNodes;
    }
    if (this.model.isAnalogRecorder) {
      return this.targetNodes;
    }
    return [];
  }

  get connections(): TConnection[] {
    return this.network.connections.all.filter((connection: TConnection) => connection.sourceIdx === this.idx);
  }

  get connectionsNeurons(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) =>
        (connection.sourceIdx === this.idx && connection.targetNode.model.isNeuron) ||
        (connection.targetIdx === this.idx && connection.sourceNode.model.isNeuron),
    );
  }

  get connectionsNeuronSources(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) => connection.targetIdx === this.idx && connection.sourceNode.model.isNeuron,
    );
  }

  get connectionsNeuronTargets(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) => connection.sourceIdx === this.idx && connection.targetNode.model.isNeuron,
    );
  }

  get connectionsStimulatorSources(): TConnection[] {
    return this.network.connections.all.filter(
      (connection: TConnection) => connection.targetIdx === this.idx && connection.sourceNode.model.isStimulator,
    );
  }

  get props(): INodeProps {
    return this._props;
  }

  get elementType(): TElementType {
    return this.model?.elementType;
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

  get idx(): number {
    return this._nodes.all.indexOf(this);
  }

  /**
   * Check if it is an excitatory neuron.
   */
  get isExcitatoryNeuron(): boolean {
    return this.model?.isNeuron && this._view.synWeights === "excitatory";
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
    if (this._model?.id !== this._modelId) {
      this._model = this.getModel(this._modelId);
    }
    return this._model as BaseModel;
  }

  get modelDBStore() {
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

  get modelStates(): IModelStateProps[] {
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

  get nodeGroups(): NodeGroup[] {
    return this._nodes.nodeGroups.filter((nodeGroup: NodeGroup) => nodeGroup.nodeItemsDeep.includes(this));
  }

  get nodeIdx(): number {
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
  }

  get parentNodes(): TNodes {
    return this._nodes;
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
    return "[" + this._records.map((record: NodeRecord) => '"' + record.id + '"').join(",") + "]";
  }

  get recordSpikes(): boolean {
    return this.connections.filter((connection: TConnection) => connection.view.connectSpikeRecorder()).length > 0;
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
   * @param emitChanges boolean
   */
  addAnnotation(text: string, emitChanges: boolean = true): void {
    if (this._annotations.indexOf(text) !== -1) return;
    this._annotations.push(text);

    if (emitChanges) this.changes();
  }

  /**
   * Add parameter component.
   * @param paramProps parameter props
   * @param visible boolean
   */
  addParameter(paramProps: IParamProps, visible: boolean = false): void {
    this.logger.trace("add parameter", paramProps.id);

    this._params[paramProps.id] = new NodeParameter(this, paramProps);
    if (visible) this._paramsVisible.push(paramProps.id);
  }

  /**
   * Add parameters to the node.
   * @param paramsProps list of parameter props
   */
  addParameters(paramsProps?: IParamProps[]): void {
    this.logger.trace("add parameters");

    this.emptyParams();
    if (this._model) {
      this._model.paramsAll.forEach((modelParam: ModelParameter) => {
        if (paramsProps && paramsProps.length > 0) {
          const nodeParamProps = paramsProps.find((paramProps: IParamProps) => paramProps.id === modelParam.id);
          if (nodeParamProps) {
            this.addParameter(
              {
                ...nodeParamProps,
                ...modelParam,
              },
              true,
            );
          } else {
            this.addParameter(modelParam);
          }
        } else {
          this.addParameter(modelParam);
        }
      });
    } else if (paramsProps) {
      paramsProps.forEach((param: IParamProps) => this.addParameter(param, true));
    }
  }

  /**
   * Observer for node changes.
   * @remarks It emits network changes.
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
      const position = { ...nodeProps.view.position };
      position.y += 72;
      nodeProps.view.position = position;
      nodeProps.view.color = undefined;
    }

    return this.nodes.addNode({ ...nodeProps });
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
   * @param activityProps activity props
   */
  createActivity(activityProps?: IActivityProps): void {
    this.logger.trace("create activity");

    if (!this.model.isRecorder) return;

    if (this.model.isSpikeRecorder) {
      this._activity = new NodeSpikeActivity(this, activityProps);
    } else if (this.model.isAnalogRecorder) {
      this._activity = new NodeAnalogSignalActivity(this, activityProps);
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
   * @param modelId model ID
   */
  getModel(modelId: string): TModel | undefined {
    // this.logger.trace("get model:", modelId);

    return this.modelDBStore.findModel(modelId);
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
   * Get node record.
   * @param groupId string
   * @returns node record object
   */
  getNodeRecord(groupId: string): NodeRecord | undefined {
    return this._records.find((record: NodeRecord) => record.groupId === groupId);
  }

  /**
   * Check if node has parameter component.
   * @param paramId parameter ID
   */
  hasParameter(paramId: string): boolean {
    return Object.keys(this._params).some((paramKey: string) => paramKey === paramId);
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
  hideAllParams(emitChanges: boolean = true): void {
    this.paramsVisible = [];
    if (emitChanges) this.changes();
  }

  /**
   * Initialize node.
   * @remarks Do not call it in the constructor.
   */
  init(): void {
    this.logger.trace("init");

    this.loadModel(this._props.params);
    if (this.model.isRecorder) this.updateRecorder();
    this.update();
  }

  /**
   * Load model.
   */
  loadModel(paramsProps?: IParamProps[]): void {
    this.logger.trace("load model:", this._modelId);

    this._model = this.getModel(this._modelId);
    this.addParameters(paramsProps);
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
    this.nodes.network.changes(recorderModelChanged);
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

    // this.resetParams();
  }

  /**
   * Reset value in parameter components.
   * @remarks It emits node changes.
   */
  resetParams(): void {
    this.logger.trace("reset parameters");

    this.paramsAll.forEach((param: NodeParameter) => param.reset());
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

  /**
   * Sets all params to visible.
   * @param emitChanges option to emit changes.
   */
  showAllParams(emitChanges: boolean = true): void {
    this.paramsVisible = Object.keys(this._params);
    if (emitChanges) this.changes();
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

    if (this._size > 1) nodeProps.size = this._size;

    if (this.filteredParams.length > 0)
      nodeProps.params = this.filteredParams.map((param: NodeParameter) => param.toJSON());

    // Add annotations if provided.
    if (this._annotations.length > 0) nodeProps.annotations = this._annotations;

    // Add records if this model is multimeter.
    if (this.model.isMultimeter) nodeProps.records = this._records.map((nodeRecord: NodeRecord) => nodeRecord.toJSON());

    return nodeProps;
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
      recordables: this._recordables.map((recordable: NodeRecord) => recordable.uuid),
      size: this._size,
    });
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

    let modelStatesProps: IModelStateProps[] = [];
    if (!this.model.isAnalogRecorder || this.connections.length == 0) return;

    // Get model states from target nodes.
    const targetsModelStates = this.targetNodes.map((node: TNode) => [...node.modelStates].flat());
    if (targetsModelStates.length > 0) {
      const modelStatesPooled: IModelStateProps[] = targetsModelStates.flat();
      modelStatesProps = modelStatesPooled
        .filter((modelStateProps: IModelStateProps) => modelStateProps)
        .filter(onlyUnique);
      modelStatesProps.sort((a: { id: string }, b: { id: string }) => sortString(a.id, b.id));
    }

    // Convert model states to node records.
    this.recordables = modelStatesProps.map(
      (modelStateProps: IModelStateProps) => new NodeRecord(this, modelStateProps),
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
    this.createActivity();

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
    if (this._props.records != null) {
      // Load record from stored nodes.
      const recordIds = this._props.records.map((recordProps: INodeRecordProps) => recordProps.id);
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
