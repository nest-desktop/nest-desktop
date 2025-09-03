// node.ts

import {
  TConnection,
  TModel,
  TNetwork,
  TNetworkProject,
  TNode,
  TNodeGroup,
  TNodes,
  TParameter,
  TSimulation,
} from "@/types";

import { BaseModel, IModelStateProps, TElementType } from "../model/model";
import { BaseNodes } from "./nodes";
import { BaseObj } from "../common/base";
import { IActivityProps } from "../activity/activity";
import { INodeRecordProps, NodeRecord } from "./nodeRecord";
import { INodeViewProps, NodeViewState } from "./nodeViewState";
import { IParamProps } from "../common/parameter";
import { ModelParameter } from "../model/modelParameter";
import { NodeActivity } from "../nodeActivity/nodeActivity";
import { NodeAnalogSignalActivity } from "../nodeActivity/nodeAnalogSignalActivity";
import { NodeParameter } from "./nodeParameter";
import { NodeSpikeActivity } from "../nodeActivity/nodeSpikeActivity";
import { notifyInfo } from "../common/notification";
import { onlyUnique, sortString } from "../../utils/array";
import { nextTick } from "vue";

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
  private _params: Record<string, NodeParameter> = {};
  private _paramsVisible: string[] = [];
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = [];
  private _view: NodeViewState;
  public _model: TModel | undefined;
  public _modelId: string;
  public _nodes: BaseNodes; // parent

  constructor(nodes: TNodes, nodeProps: INodeProps = {}) {
    super({ config: { name: "Node" } });

    this._nodes = nodes;
    this.props = nodeProps;

    this._modelId = nodeProps.model || "";
    // this._size = nodeProps.size || 1;

    this._annotations = nodeProps.annotations || [];

    this._view = new NodeViewState(this, nodeProps.view);
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

  get color(): string {
    return this.state.color;
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
    return this.network.connections.allConnections.filter(
      (connection: TConnection) => connection.sourceIdx === this.idx,
    );
  }

  get connectionsAll(): TConnection[] {
    return this.network.connections.allConnections.filter(
      (connection: TConnection) => connection.sourceIdx === this.idx || connection.targetIdx === this.idx,
    );
  }

  get connectionsNeurons(): TConnection[] {
    return this.network.connections.allConnections.filter(
      (connection: TConnection) =>
        (connection.sourceIdx === this.idx && connection.targetNode.model.isNeuron) ||
        (connection.targetIdx === this.idx && connection.sourceNode.model.isNeuron),
    );
  }

  get connectionsNeuronSources(): TConnection[] {
    return this.network.connections.allConnections.filter(
      (connection: TConnection) => connection.targetIdx === this.idx && connection.sourceNode.model.isNeuron,
    );
  }

  get connectionsNeuronTargets(): TConnection[] {
    return this.network.connections.allConnections.filter(
      (connection: TConnection) => connection.sourceIdx === this.idx && connection.targetNode.model.isNeuron,
    );
  }

  get connectionsStimulatorSources(): TConnection[] {
    return this.network.connections.allConnections.filter(
      (connection: TConnection) => connection.targetIdx === this.idx && connection.sourceNode.model.isStimulator,
    );
  }

  get elementType(): TElementType {
    return this.model?.elementType;
  }

  get filteredParams(): NodeParameter[] {
    return this.paramsVisible.map((paramId) => this.params[paramId]);
  }

  get firstTargetNodeSize(): number {
    return this.targetNodes.length > 0 ? this.targetNodes[0].size : 0;
  }

  get hasSomeVisibleParams(): boolean {
    return this.paramsVisible.length > 0;
  }

  get idx(): number {
    return this.nodes.nodeUuids.indexOf(this.uuid);
  }

  get idxByElementType(): number {
    let nodes: TNode[];
    let idx: number;

    switch (this.elementType) {
      case "neuron":
        nodes = this.nodes.neurons;
        idx = nodes.indexOf(this);
        break;
      case undefined:
        nodes = this.nodes.nodeItems;
        idx = nodes.indexOf(this);
        break;
      default:
        nodes = this.nodes.filterByModelId(this.modelId);
        idx = nodes.indexOf(this);
    }

    return idx + 1;
  }

  get idxByVariableNames(): number {
    return this.codeNode?.idxByVariableNames ?? -1;
  }

  /**
   * Check if it is an excitatory neuron.
   */
  get isExcitatoryNeuron(): boolean {
    return this.model?.isNeuron && this.state.synWeights === "excitatory";
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
    return this.model?.isNeuron && this.state.synWeights === "inhibitory";
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
    return this.codeNode?.label ?? "n";
  }

  get model(): BaseModel {}

  get modelDBStore() {
    return this.nodes.network.project.modelDBStore;
  }

  get modelId(): string {
    return this.intf?.model ? this.intf.model.value : this._modelId;
  }

  set modelId(value: string) {
    if (this.intf?.model) {
      this.intf.model.value = value;
    } else {
      this._modelId = value;
    }

    this.loadModel();
  }

  get modelParams(): Record<string, ModelParameter> {
    return this.model.params;
  }

  get modelStates(): IModelStateProps[] {
    return this.model ? this.model.states : [];
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

  get nodeGroups(): TNodeGroup[] {
    return this.nodes.nodeGroups.filter((nodeGroup: TNodeGroup) => nodeGroup.nodeItemsDeep.includes(this));
  }

  get nodeIdx(): number {
    return this.nodes.allNodes.indexOf(this);
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
    return Object.values(this.params);
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = this.paramsAll
      .filter((param: TParameter) => values.includes(param.id))
      .map((param: TParameter) => param.id);

    this.updateParamsCodeNodeHidden();
  }

  get parentNodes(): TNodes {
    return this._nodes;
  }

  get project(): TNetworkProject {
    return this.nodes.network.project as TNetworkProject;
  }

  get recordables(): NodeRecord[] {
    return this._recordables;
  }

  set recordables(value: NodeRecord[]) {
    this._recordables = value;
    this.onUpdate({ preventSimulation: true });
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
    return this.project.simulation;
  }

  get size(): number {
    return this.intf?.size.value;
  }

  get sizeVisible(): boolean {
    return !this.intf?.size.hidden;
  }

  set sizeVisible(value: boolean) {
    if (this.intf?.size.hidden === value) this.intf.size.setHidden(!value);
  }

  get sourceNodes(): TNode[] {
    return this.network.connections.allConnections
      .filter((connection: TConnection) => connection.targetIdx === this.idx)
      .map((connection: TConnection) => connection.sourceNode);
  }

  get state(): NodeViewState {
    return this._view;
  }

  get targetNodes(): TNode[] {
    return this.network.connections.allConnections
      .filter((connection: TConnection) => connection.sourceIdx === this.idx)
      .map((connection: TConnection) => connection.targetNode);
  }

  get variableName(): string {
    let value: string = "n";

    switch (this.elementType) {
      case "neuron":
        value = "n";
        break;
      case undefined:
        value = "n";
        break;
      default:
        value =
          this.model.abbreviation ||
          this.modelId
            .split("_")
            .map((d: string) => d[0])
            .join("");
    }

    return value;
  }

  get view(): NodeViewState {
    return this._view;
  }

  /**
   * Add annotation to the list.
   * @param text string
   * @param emitChanges boolean
   */
  addAnnotation(text: string, emitChanges: boolean = true): void {
    if (this.annotations.indexOf(text) !== -1) return;
    this.annotations.push(text);

    if (emitChanges) this.onUpdate();
  }

  /**
   * Add parameter component.
   * @param paramProps parameter props
   * @param visible boolean
   */
  addParameter(paramProps: IParamProps, visible: boolean = false): void {
    this.logger.trace("add parameter", paramProps.id);

    this.params[paramProps.id] = new NodeParameter(this, paramProps);
    if (visible) this.paramsVisible.push(paramProps.id);
  }

  /**
   * Clean node component.
   */
  clean(): void {
    this.state.clean();
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

    // Add node.
    const node = this.nodes.addNode({ ...nodeProps });

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
    if (emitChanges) this.onUpdate();
  }

  /**
   * Initialize node.
   * @remarks Do not call it in the constructor.
   */
  init(): void {
    this.logger.trace("init");

    this.loadModel(this.props.params);
    if (this.model?.isRecorder) this.updateRecorder();

    this.update();
  }

  /**
   * Init parameter components.
   * @param paramsProps list of parameter props
   */
  initParameters(paramsProps?: IParamProps[]): void {
    this.logger.trace("init parameters");

    this.emptyParams();

    if (this.model) {
      this.model.paramsAll.forEach((modelParam: ModelParameter) => {
        if (paramsProps && paramsProps.length > 0) {
          const nodeParamProps = paramsProps.find((paramProps: IParamProps) => paramProps.id === modelParam.id);
          if (nodeParamProps) {
            this.addParameter(
              {
                ...nodeParamProps,
                ...modelParam.props,
              },
              true,
            );
          } else {
            this.addParameter(modelParam.props);
          }
        } else {
          this.addParameter(modelParam.props);
        }
      });
    } else if (paramsProps) {
      paramsProps.forEach((param: IParamProps) => this.addParameter(param, true));
    }
  }

  /**
   * Load model.
   */
  loadModel(paramsProps?: IParamProps[]): void {
    this.logger.trace("load model:", this.modelId);

    this._model = this.getModel(this.modelId);
    this.initParameters(paramsProps);
    this.onModelUpdate();
  }

  /**
   * Observer for model changes.
   * @remarks It emits node changes.
   * @remarks It corrects connection direction to the recorder.
   * @remarks It updates as analog recorder or other connected analog recorders.
   */
  onModelUpdate(): void {
    this.logger.trace("on model update");
    // let recorderModelChanged = false;

    if (this.model.isRecorder) {
      this.correctRecorderConnections(); // Correct connection from/to recorder.
      this.updateRecorder(); // Update records of this analog recorder.
      // recorderModelChanged = true;
    } else if (!this.model.isSpikeRecorder) {
      // Updates records of the connected analog recorder.
      this.sourceNodes
        .filter((node: TNode) => node.model.isAnalogRecorder)
        .forEach((recorder: TNode) => recorder.updateAnalogRecorder());
    }

    this.update();
    nextTick(() => this.codeNode?.onModelUpdate());
  }

  /**
   * Observer for node changes.
   * @remarks It emits network changes.
   */
  onUpdate(props = {}): void {
    this.logger.trace("on update");

    this.update();
    this.nodes.network.onUpdate(props);
  }

  /**
   * Delete node.
   * @remarks It removes node component of the network.
   */
  remove(): void {
    this.nodes.removeNode(this);
  }

  /**
   * Remove annotation from the list.
   * @param text string
   */
  removeAnnotation(text: string, emitChanges: boolean = true): void {
    if (this.annotations.indexOf(text) === -1) return;
    this.annotations.splice(this._annotations.indexOf(text), 1);
    if (emitChanges) this.onUpdate();
  }

  /**
   * Remove connections.
   */
  removeConnections(): void {
    this.connectionsAll.forEach((connection: TConnection) => connection.removeCodeNodes());

    // Update source and target idx in connections
    this.connectionsAll.forEach((connection: TConnection) => {
      if (connection.sourceIdx > this.idx) connection.sourceIdx -= 1;
      if (connection.targetIdx > this.idx) connection.targetIdx -= 1;
    });

    // this.network.clean();
  }

  /**
   * Remove record.
   * @param recordId string
   */
  removeRecord(recordId: string): void {
    const recordIds = this.records.map((record: NodeRecord) => record.id);
    const recordIdx = recordIds.indexOf(recordId);
    this.records.splice(recordIdx, 1);
    this.records = [...this._records];
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
    this.nodes.selectNode(this);
  }

  /**
   * Select this node as source for connection.
   */
  selectForConnection(): void {
    this.nodes.network.connections.state.selectedNode = this;
  }

  /**
   * Sets all params to visible.
   * @param emitChanges option to emit changes.
   */
  showAllParams(emitChanges: boolean = true): void {
    this.paramsVisible = Object.keys(this._params);
    if (emitChanges) this.onUpdate();
  }

  /**
   * Serialize for JSON.
   * @return node props
   */
  toJSON(): INodeProps {
    const nodeProps: INodeProps = {
      model: this.modelId,
      view: this.state.toJSON(),
    };

    if (this.size > 1) nodeProps.size = this.size;

    if (this.filteredParams.length > 0)
      nodeProps.params = this.filteredParams.map((param: NodeParameter) => param.toJSON());

    // Add annotations if provided.
    if (this.annotations.length > 0) nodeProps.annotations = this.annotations;

    // Add records if this model is multimeter.
    if (this.model.isMultimeter) nodeProps.records = this.records.map((nodeRecord: NodeRecord) => nodeRecord.toJSON());

    return nodeProps;
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
    this.logger.trace("update node", this.modelId);

    this.clean();
    // if (this.codeNode) this.codeNode.variableName = this.variableName;

    nextTick(() => {
      this.state.updateStyle();
      this.updateHash();
      this.updateParamsVisibility();
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
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      idx: this.idx,
      model: this.modelId,
      params: this.paramsAll.map((param: NodeParameter) => param.toJSON()),
      recordables: this.recordables.map((recordable: NodeRecord) => recordable.uuid),
      size: this.size,
    });
  }

  updateParamsVisibility(): void {
    if (!this.codeNode) return;

    this.paramsAll.forEach((param: NodeParameter) => {
      if (param.intf && param.intf[param.id]) param.visible = !param.intf[param.id].hidden;
    });
  }

  updateParamsCodeNodeHidden(): void {
    this.paramsAll.forEach((param: TParameter) => {
      if (!param.intf) return;
      param.intf[param.id].setHidden(!this._paramsVisible.includes(param.id));
    });

    this.codeNode?.code?.onUpdate();
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
    if (this.props.records != null) {
      // Load record from stored nodes.
      const recordIds = this.props.records.map((recordProps: INodeRecordProps) => recordProps.id);
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
    const color = this.state.color;
    this.recordables.forEach((record: NodeRecord) => (record.state.color = color));
  }
}
