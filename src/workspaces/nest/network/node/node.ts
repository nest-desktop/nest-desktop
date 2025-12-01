// node.ts

import type { AbstractCodeNode } from "@babsey/code-graph";

import type { Class } from "@/types";
import type { IModelRecordState } from "@/model";
import { BaseNode, NodeRecord, type INodeState, type INodeRecordState } from "@/network";
import { BaseParameter } from "@/parameter";
import { onlyUnique, sortString } from "@/utils";

import { getNESTCreateNode, updateNESTCreateNode } from "../../codeNodeTypes/nest";

import type { NESTConnection } from "../connection";
import type { NESTCopyModel } from "../copyModel";
import type { NESTModel } from "../../model";
import type { NESTNetwork } from "../network";
import type { NESTNodes } from "./nodes";
import { NESTNodeParameters } from "./nodeParameters";
import { type INESTNodeCompartmentState, NESTNodeCompartment } from "./helpers";
import { type INESTNodeReceptorState, NESTNodeReceptor } from "./helpers";
import { type INESTNodeSpatialState, NESTNodeSpatial } from "./nodeSpatial";

export interface INESTNodeState extends INodeState {
  compartments?: INESTNodeCompartmentState[];
  receptors?: INESTNodeReceptorState[];
  records?: INodeRecordState[];
  spatial?: INESTNodeSpatialState;
}

export class NESTNode extends BaseNode<NESTNodes, INESTNodeState, NESTConnection> {
  private _compartments: NESTNodeCompartment[] = [];
  private _copyModel: NESTCopyModel | undefined;
  private _positions: number[][] = [];
  private _receptors: NESTNodeReceptor[] = [];
  private _spatial: NESTNodeSpatial;

  constructor(nodes: NESTNodes) {
    super(nodes);

    this._spatial = new NESTNodeSpatial(this);
  }

  override get NodeParameters(): Class<NESTNodeParameters> {
    return NESTNodeParameters;
  }

  get assignedModels(): NESTCopyModel[] {
    if (this.modelId !== "weight_recorder") {
      return [];
    }

    return this.network.copyModels.filter((model: NESTCopyModel) =>
      model.params.values.some((param: BaseParameter) => param.value === this.view.label),
    );
  }

  get compartmentIndices(): number[] {
    return this.compartments.map((compartment: NESTNodeCompartment) => compartment.idx);
  }

  get compartmentRecordables(): INodeRecordState[] {
    const recordables = [...this.compartments.map((comp: NESTNodeCompartment) => comp.recordables)];
    return recordables.flat();
  }

  get compartments(): NESTNodeCompartment[] {
    return this._compartments;
  }

  get copyModel(): NESTCopyModel | undefined {
    return this._copyModel;
  }

  // Get all copied node models.
  get copyModels(): NESTCopyModel[] {
    return this.network.copyModels.nodeModels as NESTCopyModel[];
  }

  get hasCompartments(): boolean {
    return this.compartments.length > 0;
  }

  get hasReceptors(): boolean {
    return this.receptors.length > 0;
  }

  override get isSpatial(): boolean {
    return this.spatial.hasPositions;
  }

  override get model(): NESTModel {
    if (this._copyModel) {
      if (!this._model || this._model.id !== this._copyModel.existingModelId)
        this._model = this.getModel(this._copyModel.existingModelId);
    } else {
      if (!this._model || this._model.id !== this.modelId) this._model = this.getModel(this.modelId);
    }

    return this._model as NESTModel;
  }

  // Get models of the same element type.
  override get models(): NESTModel[] {
    const elementType: string = this.model?.elementType;
    const models: NESTModel[] = this.modelDBStore.getModelsByElementType(elementType) as NESTModel[];
    return models;
  }

  override get network(): NESTNetwork {
    return this.nodes.network;
  }

  get positions(): number[][] {
    return this._positions;
  }

  get receptorRecordables(): INodeRecordState[] {
    const recordables = [...this._receptors.map((receptor: NESTNodeReceptor) => receptor.recordables)];
    return recordables.flat();
  }

  get receptors(): NESTNodeReceptor[] {
    return this._receptors;
  }

  override get sizeVisible(): boolean {
    return this.view.state.showSize && !this._spatial.hasGridPositions;
  }

  get spatial(): NESTNodeSpatial {
    return this._spatial;
  }

  /**
   * Add compartment component.
   * @param compartmentState node compartment state
   */
  addCompartment(compartmentState: INESTNodeCompartmentState): void {
    const compartment = new NESTNodeCompartment(this);
    compartment.load(compartmentState);
    this._compartments.push(compartment);
    compartment.clean();
  }

  /**
   * Add compartments for the node.
   * @param compartmentStates list of node compartment state
   */
  addCompartments(compartmentStates: INESTNodeCompartmentState[]): void {
    this.logger.trace("add compartments");

    this._compartments = [];
    compartmentStates.forEach((compartmentState: INESTNodeCompartmentState) => this.addCompartment(compartmentState));
  }

  /**
   * Add receptor component.
   * @param receptorState receptor state
   */
  addReceptor(receptorState: INESTNodeReceptorState): void {
    const receptor = new NESTNodeReceptor(this);
    receptor.load(receptorState);
    this._receptors.push(receptor);
  }

  /**
   * Add receptors for the node.
   * @param receptorStates list of receptor state
   */
  addReceptors(receptorStates: INESTNodeReceptorState[]): void {
    this.logger.trace("add receptors");

    this._receptors = [];
    receptorStates.forEach((receptorState: INESTNodeReceptorState) => this.addReceptor(receptorState));
  }

  /**
   * Get NEST or copied NEST model.
   * @param modelId model ID
   */
  override getModel(modelId: string): NESTModel {
    // this.logger.trace("get model:", modelId);

    return this.modelDBStore.findModel(modelId) as NESTModel;
  }

  /**
   * Sets all params to invisible.
   * @param emitChanges trigger emit changes.
   */
  hideAllParams(emitChanges: boolean = true): void {
    this.params.hideAll();

    if (this.modelId === "cm_default") {
      this.compartments.forEach((comp: NESTNodeCompartment) => comp.params.hideAll());
      this.receptors.forEach((receptor: NESTNodeReceptor) => receptor.params.hideAll());
    }

    if (emitChanges) this.changes();
  }

  /**
   * Load NEST node from state.
   * @param nodeState node state
   */
  override load(nodeState: INESTNodeState): void {
    this.logger.trace("load");
    super.load(nodeState);

    if (nodeState.spatial) this.spatial.load(nodeState.spatial);
    if (nodeState.compartments) this.addCompartments(nodeState.compartments);
    if (nodeState.receptors) this.addReceptors(nodeState.receptors);
  }

  /**
   * Load model.
   * @param modelId model ID
   */
  override loadModel(modelId: string): void {
    this.logger.trace("load nest model:", modelId);

    this._modelId = modelId;

    if (this.network.copyModels && this.network.copyModels.findByModelId(modelId)) {
      const copyModel = this.network.copyModels.getModel(modelId);
      this._copyModel = copyModel;
      this._model = this.getModel(copyModel.existingModelId);
    } else {
      this._copyModel = undefined;
      this._model = this.getModel(modelId);
    }

    const modelParamState = this.model.params.save();
    this.params.load(modelParamState);
  }

  /**
   * Observer for model changes.
   * @remarks It emits node changes.
   * @remarks It corrects connection direction to the recorder.
   * @remarks It updates as analog recorder or other connected analog recorders.
   */
  override modelChanges(): void {
    this.logger.trace("model change");
    let recorderModelChanged = false;

    if (this.codeNode) {
      const engine = this.codeNode.code.engine;
      engine.pause();
      //
      updateNESTCreateNode(this.codeNode, this.save());
      engine.resume();
      engine.runOnce();
    }

    if (this.model.isRecorder) {
      this.correctRecorderConnections(); // Correct connection from/to recorder.
      this.updateRecorder(); // Update records of this analog recorder.
      recorderModelChanged = true;
    } else if (!this.model.isSpikeRecorder) {
      // Updates records of the connected analog recorder.
      this.sourceNodes
        .filter((node: NESTNode) => node.model.isAnalogRecorder)
        .forEach((recorder: NESTNode) => recorder.updateAnalogRecorder());
    }

    this.update();
    this.nodes.network.changes({ preventSimulation: true, cleanPanels: recorderModelChanged });
  }

  /**
   * Register code node.
   * @param codeNode code node
   */
  override registerCodeNode(codeNode?: AbstractCodeNode): void {
    if (!codeNode) codeNode = getNESTCreateNode(this.network.project.code.graph, this.idx);

    this.codeNode = codeNode;
    this.codeNode.mask = this;
  }

  /**
   * Remove compartment from the node.
   * @param compartment NEST node compartment
   */
  removeCompartment(compartment: NESTNodeCompartment): void {
    // Remove all receptors linking to this compartment.
    compartment.receptors.forEach((receptor: NESTNodeReceptor) => receptor.remove());

    // Remove compartment from the list.
    this._compartments.splice(this._compartments.indexOf(compartment), 1);
    this._compartments = [...this._compartments];
  }

  /**
   * Remove receptor from the node.
   * @param receptor NEST node receptor
   */
  removeReceptor(receptor: NESTNodeReceptor): void {
    this._receptors.splice(this._receptors.indexOf(receptor), 1);
    this._receptors = [...this._receptors];
  }

  /**
   * Reset compartments and receptors.
   */
  override reset(): void {
    this._compartments = [];
    this._receptors = [];
  }

  /**
   * Reset value in parameter components.
   * @remarks It emits node changes.
   */
  resetAllParams(emitChanges: boolean = true): void {
    this.logger.trace("reset parameters");

    this.params.reset();

    if (this.modelId === "cm_default") {
      this.compartments.forEach((comp: NESTNodeCompartment) => comp.params.reset());
      this.receptors.forEach((receptor: NESTNodeReceptor) => receptor.params.reset());
    }

    if (emitChanges) this.changes();
  }

  /**
   * Save nest node to state.
   * @return nest node state
   */
  override save(): INESTNodeState {
    const nodeState: INESTNodeState = {
      model: this.modelId,
      view: this.view.save(),
    };

    if (this.size > 1) nodeState.size = this.size;

    if (this.params.hasSomeVisibleParams) nodeState.params = this.params.save();

    // Add annotations if provided.
    if (this.annotations.length > 0) nodeState.annotations = this.annotations;

    // Add records if this model is multimeter.
    if (this.model.isMultimeter) nodeState.records = this.records.map((record: NodeRecord) => record.save());

    // Add positions if this node is spatial.
    if (this._spatial.hasPositions) nodeState.spatial = this._spatial.save();

    if (this._compartments.length > 0)
      nodeState.compartments = this._compartments.map((compartment: NESTNodeCompartment) => compartment.save());

    if (this._receptors.length > 0)
      nodeState.receptors = this._receptors.map((receptor: NESTNodeReceptor) => receptor.save());

    return nodeState;
  }

  /**
   * Sets all params to visible.
   */
  override showAllParams(emitChanges: boolean = true): void {
    this.params.showAll(false);

    if (this.modelId === "cm_default") {
      this.compartments.forEach((comp: NESTNodeCompartment) => comp.params.showAll(false));
      this.receptors.forEach((receptor: NESTNodeReceptor) => receptor.params.showAll(false));
    }

    if (emitChanges) this.changes();
  }

  /**
   * Toggle spatial mode.
   */
  toggleSpatial(emitChanges: boolean = true): void {
    const term: string = this.size === 1 ? "grid" : "free";
    this._spatial.load({
      positions: this.spatial.hasPositions ? undefined : term,
    });

    if (emitChanges) this.changes();
  }

  /**
   * Update recordables.
   */
  override updateRecordables(): void {
    this.logger.trace("update recordables");
    let modelRecordStates: IModelRecordState[] = [];
    if (!this.model.isAnalogRecorder) return;

    // Get model states from target nodes.
    if (this.connections.length > 0) {
      const targetsModelStates = this.targetNodes.map((node: NESTNode) => {
        return (
          node.modelId === "cm_default"
            ? [...node.compartmentRecordables, ...node.receptorRecordables]
            : [...node.modelStates]
        ).flat();
      });

      if (targetsModelStates.length > 0) {
        const modelStatesPooled: IModelRecordState[] = targetsModelStates.flat();
        modelRecordStates = modelStatesPooled
          .filter((modelRecordState: IModelRecordState) => modelRecordState)
          .filter(onlyUnique);

        if (this.modelId === "voltmeter") {
          modelRecordStates = modelRecordStates.filter((recordState: INodeRecordState) =>
            ["V_m", "v"].includes(recordState.id),
          );
        }

        modelRecordStates.sort((a: { id: string }, b: { id: string }) => sortString(a.id, b.id));
      }
    } else if (this.modelId === "weight_recorder") {
      const modelRecordState = this.model.config?.localStorage.states.find(
        (modelRecordState: IModelRecordState) => modelRecordState.id === "weights",
      );

      modelRecordStates.push(modelRecordState);
    }

    // Convert model states to node records.
    this.recordables = modelRecordStates.map((modelRecordState: IModelRecordState) => {
      const nodeRecord = new NodeRecord<this>(this);
      nodeRecord.load(modelRecordState);
      return nodeRecord;
    });

    this.updateRecordsColor();
  }

  // /**
  //  * Update receptor component.
  //  * @param receptorOld - node receptor instance
  //  * @param receptorNew - receptor instance
  //  */
  // updateReceptor(receptorOld: NodeReceptor, receptorNew: INodeReceptorState): void {
  //   receptorNew.compIdx = receptorOld.compartment.idx;
  //   const receptorIdx = this._receptors.indexOf(receptorOld);
  //   this._receptors[receptorIdx] = new NodeReceptor(this, receptorNew);
  //   this._receptors = [...this._receptors];
  // }
}
