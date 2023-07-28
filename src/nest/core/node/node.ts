// node.ts - 26 anys

import { ILogObj, Logger } from "tslog";

import { Config } from "@/helpers/config";
import { Parameter } from "@/helpers/parameter";
import { logger as mainLogger } from "@/utils/logger";

import { Activity, ActivityProps } from "../activity/activity";
import { AnalogSignalActivity } from "../activity/analogSignalActivity";
import { Connection } from "../connection/connection";
import { CopyModel } from "../model/copyModel";
import { Model } from "../model/model";
import { ModelParameter } from "../model/modelParameter";
import { Network } from "../network/network";
import {
  NodeCompartment,
  NodeCompartmentProps,
} from "./nodeCompartment/nodeCompartment";
import { NodeParameter, NodeParameterProps } from "./nodeParameter";
import { NodeReceptor, NodeReceptorProps } from "./nodeReceptor/nodeReceptor";
import { NodeRecord, NodeRecordProps } from "./nodeRecord";
import { NodeSpatial, NodeSpatialProps } from "./nodeSpatial/nodeSpatial";
import { NodeState } from "./nodeState";
import { NodeView, NodeViewProps } from "./nodeView";
import { Nodes } from "./nodes";
import { SpikeActivity } from "../activity/spikeActivity";

export interface NodeProps {
  model?: string;
  size?: number;
  params?: NodeParameterProps[];
  view?: NodeViewProps;
  annotations?: string[];
  spatial?: NodeSpatialProps;
  records?: NodeRecordProps[];
  receptors?: NodeReceptorProps[];
  compartments?: NodeCompartmentProps[];
  activity?: ActivityProps;
}

export class Node extends Config {
  private readonly _name = "Node";

  private _activity?: SpikeActivity | AnalogSignalActivity | Activity;
  private _annotations: string[] = [];
  private _compartments: NodeCompartment[] = [];
  private _doc: NodeProps;
  private _idx: number; // generative
  private _logger: Logger<ILogObj>;
  private _model: Model | CopyModel;
  private _modelId: string;
  private _nodes: Nodes; // parent
  private _params: { [key: string]: NodeParameter } = {};
  private _paramsVisible: string[] = [];
  private _positions: number[][] = [];
  private _receptors: NodeReceptor[] = [];
  private _recordables: NodeRecord[] = [];
  private _records: NodeRecord[] = []; // only for multimeter
  private _size: number;
  private _spatial: NodeSpatial;
  private _state: NodeState;
  private _view: NodeView;

  constructor(nodes: Nodes, node: NodeProps = {}) {
    super("Node");

    this._nodes = nodes;
    this._idx = this._nodes.all.length;

    this._logger = mainLogger.getSubLogger({
      name: `[${this._nodes.network.project.shortId}] node`,
    });

    this._modelId = node.model || "iaf_psc_alpha";
    this._size = node.size || 1;
    this._annotations = node.annotations || [];
    this._doc = node;

    this._model = this.getModel(this._modelId);
    this._spatial = new NodeSpatial(this, node.spatial);
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

  get assignedModels(): CopyModel[] {
    if (this._modelId !== "weight_recorder") {
      return [];
    }

    return this.network.models.filter((model: CopyModel) =>
      Object.values(model.params).some(
        (param: Parameter) => param.value === this.view.label
      )
    );
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
        connection.sourceIdx === this._idx && connection.target.model.isNeuron
    );
  }

  get compartments(): NodeCompartment[] {
    return this._compartments;
  }

  get compartmentIndices(): number[] {
    return this._compartments.map(
      (compartment: NodeCompartment) => compartment.idx
    );
  }

  get compartmentRecordables(): any[] {
    return [
      ...this._compartments.map((comp: NodeCompartment) => comp.recordables),
    ];
  }

  get elementType(): string {
    return this.model.elementType;
  }

  get filteredParams(): NodeParameter[] {
    return this._paramsVisible.map((paramId) => this._params[paramId]);
  }

  get hasCompartments(): boolean {
    return this._compartments.length > 0;
  }

  get hasReceptors(): boolean {
    return this._receptors.length > 0;
  }

  get hash(): string {
    return this._state.hash;
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

  get model(): CopyModel | Model {
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
  set model(model: CopyModel | Model) {
    this._modelId = model.id;
    this._model = model;
    this.modelChanges();
  }

  get models(): (CopyModel | Model)[] {
    // Get models of the same element type.
    const elementType: string = this.model.elementType;
    const models: Model[] =
      this.network.project.modelStore.getModelsByElementType(elementType);

    // Get copied models.
    const modelsCopied: CopyModel[] =
      this.network.models.filterByElementType(elementType);

    const filteredModels = [...models, ...modelsCopied];
    filteredModels.sort();

    return filteredModels;
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

  get n(): number {
    return this._size;
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this._nodes.network;
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
    return Object.values(this._params)
  }

  get paramsVisible(): string[] {
    return this._paramsVisible;
  }

  set paramsVisible(values: string[]) {
    this._paramsVisible = values;
    this.changes();
  }

  get positions(): number[][] {
    return this._positions;
  }

  get receptors(): NodeReceptor[] {
    return this._receptors;
  }

  get receptorRecordables(): any[] {
    return [
      ...this._receptors.map((receptor: NodeReceptor) => receptor.recordables),
    ];
  }

  get recordables(): NodeRecord[] {
    return this._recordables;
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

  get hasSomeVisibleParams(): boolean {
    return (
      this._paramsVisible.length > 0 ||
      this._modelId === "multimeter" ||
      this.network.project.simulation.code.runSimulationInsite
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
    return this._view.state.showSize && !this._spatial.hasGridPositions;
  }

  get sourceNodes(): Node[] {
    const nodes: Node[] = this.network.connections
      .filter((connection: Connection) => connection.targetIdx === this._idx)
      .map((connection: Connection) => connection.source);
    return nodes;
  }

  get spatial(): NodeSpatial {
    return this._spatial;
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
   * Add compartment component.
   * @param comp - compartment object
   */
  addCompartment(comp: any = {}): void {
    const compartment = new NodeCompartment(this, comp);
    this._compartments.push(compartment);
    compartment.clean();
  }

  /**
   * Add parameter component.
   * @param param - parameter object
   */
  addParameter(param: NodeParameterProps): void {
    this._params[param.id] = new NodeParameter(this, param);
  }

  /**
   * Add receptor component.
   * @param receptor - receptor object
   */
  addReceptor(receptor: any): void {
    this._receptors.push(new NodeReceptor(this, receptor));
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
    this._nodes.network.changes();
  }

  /**
   * Clean node component.
   */
  clean(): void {
    this._idx = this._nodes.all.indexOf(this);
    this.view.clean();
  }

  /**
   * Clone this node component.
   * @return cloned node component
   */
  clone(): Node {
    return new Node(this._nodes, { ...this.toJSON() });
  }

  /**
   * Get model.
   */
  getModel(modelId: string): CopyModel | Model {
    this._logger.trace("get model:", modelId);
    if (this.network.models.some((model: CopyModel) => model.id === modelId)) {
      return this.network.models.getModelById(modelId);
    } else {
      return this.network.project.modelStore.getModel(modelId);
    }
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
   * Check if node has params.
   */
  hasParameters(node: NodeProps): boolean {
    return "params" in node;
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
   * Sets all params to invisible.
   */
  hideAllParams(): void {
    this.paramsVisible = [];

    if (this._modelId === "cm_default") {
      this.compartments.forEach((comp: NodeCompartment) =>
        comp.hideAllParams()
      );
      this.receptors.forEach((receptor: NodeReceptor) =>
        receptor.hideAllParams()
      );
    }
  }

  /**
   * Initialize node.
   */
  init(node?: NodeProps): void {
    this._logger.trace("init");

    this.initParameters(node);
    this.initCompartments(node);
    this.initReceptors(node);

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
    } else {
      this._activity = new Activity(this, activity);
    }
  }

  /**
   * Initialize compartments for the node.
   * @param node - node object
   */
  initCompartments(node?: NodeProps): void {
    this._logger.trace("init compartments");
    this._compartments = [];
    if (node && node.compartments) {
      node.compartments.forEach((compartment: any) =>
        this.addCompartment(compartment)
      );
    }
  }

  /**
   * Initialize receptors for the node.
   * @param node - node object
   */
  initReceptors(node?: NodeProps): void {
    this._logger.trace("init receptors");
    this._receptors = [];
    if (node && node.receptors) {
      node.receptors.forEach((receptor: any) => this.addReceptor(receptor));
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
   * Remove compartment from the node.
   */
  removeCompartment(compartment: NodeCompartment): void {
    // Remove all receptors linking to this compartment.
    compartment.receptors.forEach((receptor: NodeReceptor) =>
      receptor.remove()
    );

    // Remove compartment from the list.
    this._compartments.splice(this._compartments.indexOf(compartment), 1);
    this._compartments = [...this._compartments];
  }

  /**
   * Remove receptor from the node.
   */
  removeReceptor(receptor: NodeReceptor): void {
    this._receptors.splice(this._receptors.indexOf(receptor), 1);
    this._receptors = [...this._receptors];
  }

  /**
   * Remove record from the state.
   */
  removeRecord(record: any): void {
    this._records.splice(this._records.indexOf(record), 1);
    this._records = [...this._records];
  }

  reset(): void {
    this._compartments = [];
    this._receptors = [];
  }

  /**
   * Reset value in parameter components.
   *
   * @remarks
   * It emits node changes.
   */
  resetParameters(): void {
    this._logger.trace("reset parameters");
    this.paramsAll.forEach((param: NodeParameter) =>
      param.reset()
    );

    if (this._modelId === "cm_default") {
      this.compartments.forEach((comp: NodeCompartment) =>
        comp.resetParameters()
      );
      this.receptors.forEach((receptor: NodeReceptor) =>
        receptor.resetParameters()
      );
    }

    this.changes();
  }

  /**
   * Sets all params to visible.
   */
  showAllParams(): void {
    this.paramsVisible = Object.keys(this._params);

    if (this._modelId === "cm_default") {
      this.compartments.forEach((comp: NodeCompartment) =>
        comp.showAllParams()
      );
      this.receptors.forEach((receptor: NodeReceptor) =>
        receptor.showAllParams()
      );
    }
  }

  /**
   * Toggle spatial mode.
   */
  toggleSpatial(): void {
    const term: string = this._size === 1 ? "grid" : "free";
    this._spatial.init({
      positions: this.spatial.hasPositions ? undefined : term,
    });
    this.changes();
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

    // Add positions if this node is spatial.
    if (this._spatial.hasPositions) {
      node.spatial = this._spatial.toJSON();
    }

    if (this._compartments.length > 0) {
      node.compartments = this._compartments.map(
        (compartment: NodeCompartment) => compartment.toJSON()
      );
    }

    if (this._receptors.length > 0) {
      node.receptors = this._receptors.map((receptor: NodeReceptor) =>
        receptor.toJSON()
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
          return target.modelId === "cm_default"
            ? [
                ...target.compartmentRecordables,
                ...target.receptorRecordables,
              ].flat()
            : [...target.model.recordables];
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
    } else if (this._modelId === "weight_recorder") {
      recordables.push(
        this.model.config.recordables.find(
          (record: any) => record.id === "weights"
        )
      );
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
