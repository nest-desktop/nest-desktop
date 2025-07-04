// node.ts

import { BaseParameter, IParamProps } from "@/helpers/common/parameter";
import { IModelStateProps, TElementType } from "@/helpers/model/model";
import { ModelParameter } from "@/helpers/model/modelParameter";
import { BaseNode, INodeProps } from "@/helpers/node/node";
import { NodeParameter } from "@/helpers/node/nodeParameter";
import { INodeRecordProps, NodeRecord } from "@/helpers/node/nodeRecord";
import { onlyUnique, sortString } from "@/utils/array";

import { INESTNodeCompartmentProps, NESTNodeCompartment } from "./nodeCompartment/nodeCompartment";
import { INESTNodeReceptorProps, NESTNodeReceptor } from "./nodeReceptor/nodeReceptor";
import { INESTNodeSpatialProps, NESTNodeSpatial } from "./nodeSpatial/nodeSpatial";
import { NESTConnection } from "../connection/connection";
import { NESTCopyModel } from "../model/copyModel";
import { NESTModel } from "../model/model";
import { NESTNetwork } from "../network/network";
import { NESTNodes } from "./nodes";
import { IntegerInterface, TextInputInterface } from "baklavajs";

export interface INESTNodeProps extends INodeProps {
  compartments?: INESTNodeCompartmentProps[];
  receptors?: INESTNodeReceptorProps[];
  records?: INodeRecordProps[];
  spatial?: INESTNodeSpatialProps;
}

// export class NESTNode extends BaseNode<NESTModel> {
export class NESTNode extends BaseNode {
  private _compartments: NESTNodeCompartment[] = [];
  private _copyModel: NESTCopyModel | undefined;
  private _positions: number[][] = [];
  private _receptors: NESTNodeReceptor[] = [];
  private _spatial: NESTNodeSpatial;

  constructor(nodes: NESTNodes, nodeProps: INESTNodeProps = {}) {
    super(nodes, nodeProps);
    // this.logger.settings.minLevel = 1;

    this._spatial = new NESTNodeSpatial(this, nodeProps.spatial);

    this.reset();

    if (nodeProps.compartments) {
      this.addCompartments(nodeProps.compartments);
    }

    if (nodeProps.receptors) {
      this.addReceptors(nodeProps.receptors);
    }
  }

  get assignedModels(): NESTCopyModel[] {
    if (this.modelId !== "weight_recorder") {
      return [];
    }

    return this.network.copyModels.filter((model: NESTCopyModel) =>
      Object.values(model.params).some((param: BaseParameter) => param.value === this.view.label),
    );
  }

  get compartmentIndices(): number[] {
    return this._compartments.map((compartment: NESTNodeCompartment) => compartment.idx);
  }

  get compartmentRecordables(): INodeRecordProps[] {
    const recordables = [...this._compartments.map((comp: NESTNodeCompartment) => comp.recordables)];
    return recordables.flat();
  }

  get compartments(): NESTNodeCompartment[] {
    return this._compartments;
  }

  override get connections(): NESTConnection[] {
    return this.network.connections.allConnections.filter(
      (connection: NESTConnection) => connection.sourceIdx === this.idx,
    );
  }

  override get connectionsNeuronTargets(): NESTConnection[] {
    return this.network.connections.allConnections.filter(
      (connection: NESTConnection) => connection.sourceIdx === this.idx && connection.targetNode.model.isNeuron,
    );
  }

  get copyModel(): NESTCopyModel | undefined {
    return this._copyModel;
  }

  override get elementType(): TElementType {
    return this.model?.elementType;
  }

  get hasCompartments(): boolean {
    return this._compartments.length > 0;
  }

  get hasReceptors(): boolean {
    return this._receptors.length > 0;
  }

  override get hasSomeVisibleParams(): boolean {
    return this.paramsVisible.length > 0 || this.modelId === "multimeter";
  }

  override get idx(): number {
    return this._nodes.allNodes.indexOf(this);
  }

  override get isSpatial(): boolean {
    return this._spatial.hasPositions;
  }

  override get model(): NESTModel {
    if (this._copyModel) {
      if (!this._model || this._model.id !== this._copyModel.existingModelId)
        this._model = this.getModel(this._copyModel.existingModelId);
    } else {
      if (!this._model || this._model.id !== this._modelId) this._model = this.getModel(this._modelId);
    }

    return this._model as NESTModel;
  }

  // override get modelId(): string {
  //   return this._modelId;
  // }

  // override set modelId(value: string) {
  //   this._modelId = value;

  //   this.loadModel();
  //   this.modelOnUpdate();

  //   if (this.codeNodes.node && this.codeNodes.node.inputs.model.value !== value)
  //     this.codeNodes.node.inputs.model.value = value;
  // }

  // override get modelId(): string {
  //   return this._modelId;
  // }

  // /**
  //  * Set model ID.
  //  */
  // override set modelId(value: string) {
  //   this._modelId = value;

  //   this.loadModel();

  //   this.updateRecordables();
  //   this.modelOnUpdate();
  // }

  override get modelParams(): Record<string, ModelParameter> {
    return this.model.params;
  }

  // Get models of the same element type.
  override get models(): NESTModel[] {
    const elementType: string = this.model?.elementType;
    const models: NESTModel[] = this.modelDBStore.getModelsByElementType(elementType) as NESTModel[];
    return models;
  }

  // Get all copied node models.
  get copyModels(): NESTCopyModel[] {
    return this.network.copyModels.nodeModels as NESTCopyModel[];
  }

  override get network(): NESTNetwork {
    return this.nodes.network as NESTNetwork;
  }

  override get nodes(): NESTNodes {
    return this._nodes as NESTNodes;
  }

  get positions(): number[][] {
    return this._positions;
  }

  get receptorRecordables(): INodeRecordProps[] {
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

  override get targetNodes(): NESTNode[] {
    return this.network.connections.allConnections
      .filter((connection: NESTConnection) => connection.sourceIdx === this.idx)
      .map((connection: NESTConnection) => connection.targetNode);
  }

  /**
   * Add compartment component.
   * @param compartmentProps node compartment props
   */
  addCompartment(compartmentProps: INESTNodeCompartmentProps): void {
    const compartment = new NESTNodeCompartment(this, compartmentProps);
    this._compartments.push(compartment);
    compartment.clean();
  }

  /**
   * Add compartments for the node.
   * @param compartmentsProps list of node compartment props
   */
  addCompartments(compartmentsProps: INESTNodeCompartmentProps[]): void {
    this.logger.trace("add compartments");

    this._compartments = [];
    compartmentsProps.forEach((compartmentProps: INESTNodeCompartmentProps) => this.addCompartment(compartmentProps));
  }

  /**
   * Add receptor component.
   * @param receptorProps receptor props
   */
  addReceptor(receptorProps: INESTNodeReceptorProps): void {
    this._receptors.push(new NESTNodeReceptor(this, receptorProps));
  }

  /**
   * Add receptors for the node.
   * @param receptorsProps list of receptor props
   */
  addReceptors(receptorsProps: INESTNodeReceptorProps[]): void {
    this.logger.trace("add receptors");

    this._receptors = [];
    receptorsProps.forEach((receptorProps: INESTNodeReceptorProps) => this.addReceptor(receptorProps));
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
   * @param emitOnUpdate emit event on update.
   */
  override hideAllParams(emitOnUpdate: boolean = true): void {
    this.paramsVisible = [];

    if (this.modelId === "cm_default") {
      this.compartments.forEach((comp: NESTNodeCompartment) => comp.hideAllParams());
      this.receptors.forEach((receptor: NESTNodeReceptor) => receptor.hideAllParams());
    }

    if (emitOnUpdate) this.onUpdate();
  }

  /**
   * Load model.
   * @param paramsProps list of param props
   * @remarks It adds parameters.
   */
  override loadModel(paramsProps?: IParamProps[]): void {
    this.logger.trace("load model:", this.modelId);

    if (this.network.copyModels && this.network.copyModels.findByModelId(this._modelId)) {
      this._copyModel = this.network.copyModels.getModel(this._modelId);
      this._model = this.getModel(this._copyModel.existingModelId);
    } else {
      this._copyModel = undefined;
      this._model = this.getModel(this._modelId);
    }

    this.initParameters(paramsProps);
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
   * @remarks It emit events on node update.
   */
  override resetParams(emitOnUpdate: boolean = true): void {
    this.logger.trace("reset parameters");

    this.paramsAll.forEach((param: NodeParameter) => param.reset());

    if (this.modelId === "cm_default") {
      this.compartments.forEach((comp: NESTNodeCompartment) => comp.resetParameters());
      this.receptors.forEach((receptor: NESTNodeReceptor) => receptor.resetParameters());
    }

    if (emitOnUpdate) this.onUpdate();
  }

  /**
   * Sets all params to visible.
   */
  override showAllParams(emitOnUpdate: boolean = true): void {
    this.paramsVisible = Object.keys(this.params);

    if (this.modelId === "cm_default") {
      this.compartments.forEach((comp: NESTNodeCompartment) => comp.showAllParams());
      this.receptors.forEach((receptor: NESTNodeReceptor) => receptor.showAllParams());
    }

    if (emitOnUpdate) this.onUpdate();
  }

  /**
   * Toggle spatial mode.
   */
  toggleSpatial(emitOnUpdate: boolean = true): void {
    const term: string = this.size === 1 ? "grid" : "free";
    this._spatial.init({
      positions: this.spatial.hasPositions ? undefined : term,
    });

    if (emitOnUpdate) this.onUpdate();
  }

  /**
   * Serialize for JSON.
   * @return node props
   */
  override toJSON(): INESTNodeProps {
    const nodeProps: INESTNodeProps = {
      model: this.modelId,
      view: this.view.toJSON(),
    };

    if (this.size > 1) nodeProps.size = this.size;

    if (this.filteredParams.length > 0)
      nodeProps.params = this.filteredParams.map((param: NodeParameter) => param.toJSON());

    // Add annotations if provided.
    if (this.annotations.length > 0) nodeProps.annotations = this.annotations;

    // Add records if this model is multimeter.
    if (this.model?.isMultimeter) nodeProps.records = this.records.map((record: NodeRecord) => record.toJSON());

    // Add positions if this node is spatial.
    if (this._spatial.hasPositions) nodeProps.spatial = this._spatial.toJSON();

    if (this._compartments.length > 0)
      nodeProps.compartments = this._compartments.map((compartment: NESTNodeCompartment) => compartment.toJSON());

    if (this._receptors.length > 0)
      nodeProps.receptors = this._receptors.map((receptor: NESTNodeReceptor) => receptor.toJSON());

    return nodeProps;
  }

  /**
   * Update code nodes.
   */
  override updateCodeNodes(): void {
    if (!this.codeNodes.node) this.nodes.addCodeNodes(this);
    const codeNode = this.codeNodes.node;

    codeNode.inputs.model.value = this.modelId;
    codeNode.inputs.size.value = this.size;

    if (!this.codeNodes.params) return;
    const paramsNode = this.codeNodes.params;

    this.paramsAll.forEach((param: NodeParameter) => {
      if (!this.paramsVisible.includes(param.id) && param.id in paramsNode.inputs) {
        paramsNode.removeInput(param.id);
      } else if (this.paramsVisible.includes(param.id) && !(param.id in paramsNode.inputs)) {
        let inputInterface;
        if (typeof param.value == "number") {
          inputInterface = new IntegerInterface(param.id, param.value as number);
        } else {
          inputInterface = new TextInputInterface(param.id, JSON.stringify(param.value));
        }
        paramsNode.addInput(param.id, inputInterface);
      } else if (this.paramsVisible.includes(param.id)) {
        paramsNode.inputs[param.id].value = param.value;
      }
    });
  }

  /**
   * Update recordables.
   */
  override updateRecordables(): void {
    this.logger.trace("update recordables");
    let modelStatesProps: IModelStateProps[] = [];
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
        const modelStatesPooled: IModelStateProps[] = targetsModelStates.flat();
        modelStatesProps = modelStatesPooled
          .filter((modelStateProps: IModelStateProps) => modelStateProps)
          .filter(onlyUnique);

        if (this.modelId === "voltmeter") {
          modelStatesProps = modelStatesProps.filter((recordProps: INodeRecordProps) =>
            ["V_m", "v"].includes(recordProps.id),
          );
        }

        modelStatesProps.sort((a: { id: string }, b: { id: string }) => sortString(a.id, b.id));
      }
    } else if (this.modelId === "weight_recorder") {
      const modelStateProps = this.model.config?.localStorage.states.find(
        (modelStateProps: IModelStateProps) => modelStateProps.id === "weights",
      );

      modelStatesProps.push(modelStateProps);
    }

    // Convert model states to node records.
    this.recordables = modelStatesProps.map(
      (modelStateProps: IModelStateProps) => new NodeRecord(this, modelStateProps),
    );

    this.updateRecordsColor();
  }

  // /**
  //  * Update receptor component.
  //  * @param receptorOld - node receptor object
  //  * @param receptorNew - receptor object
  //  */
  // updateReceptor(receptorOld: NodeReceptor, receptorNew: INodeReceptorProps): void {
  //   receptorNew.compIdx = receptorOld.compartment.idx;
  //   const receptorIdx = this._receptors.indexOf(receptorOld);
  //   this._receptors[receptorIdx] = new NodeReceptor(this, receptorNew);
  //   this._receptors = [...this._receptors];
  // }
}
