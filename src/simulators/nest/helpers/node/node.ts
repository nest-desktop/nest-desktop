// node.ts

import { Parameter } from '@/helpers/common/parameter';
import { TElementType } from '@/helpers/model/model';
import { ModelParameter } from '@/helpers/model/modelParameter';
import { BaseNode, INodeProps } from '@/helpers/node/node';
import { INodeParamProps, NodeParameter } from '@/helpers/node/nodeParameter';
import { INodeRecordProps, NodeRecord } from '@/helpers/node/nodeRecord';
import { onlyUnique, sortString } from '@/utils/array';

import { NESTConnection } from '../connection/connection';
import { NESTCopyModel } from '../model/copyModel';
import { NESTModel } from '../model/model';
import { NESTNetwork } from '../network/network';
import { INESTNodeCompartmentProps, NESTNodeCompartment } from './nodeCompartment/nodeCompartment';
import { INESTNodeReceptorProps, NESTNodeReceptor } from './nodeReceptor/nodeReceptor';
import { INESTNodeSpatialProps, NESTNodeSpatial } from './nodeSpatial/nodeSpatial';
import { NESTNodes } from './nodes';

export interface INESTNodeProps extends INodeProps {
  compartments?: INESTNodeCompartmentProps[];
  receptors?: INESTNodeReceptorProps[];
  records?: INodeRecordProps[];
  spatial?: INESTNodeSpatialProps;
}

// export class NESTNode extends BaseNode<NESTModel> {
export class NESTNode extends BaseNode {
  private _compartments: NESTNodeCompartment[] = [];
  private _modelCopied: NESTCopyModel | undefined;
  private _positions: number[][] = [];
  private _receptors: NESTNodeReceptor[] = [];
  private _spatial: NESTNodeSpatial;

  constructor(nodes: NESTNodes, nodeProps: INESTNodeProps = {}) {
    super(nodes, nodeProps);

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

    return this.network.modelsCopied.filter((model: NESTCopyModel) =>
      Object.values(model.params).some(
        (param: Parameter) => param.value === this.view.label
      )
    );
  }

  get compartmentIndices(): number[] {
    return this._compartments.map(
      (compartment: NESTNodeCompartment) => compartment.idx
    );
  }

  get compartmentRecordables(): INodeRecordProps[] {
    const recordables = [
      ...this._compartments.map(
        (comp: NESTNodeCompartment) => comp.recordables
      ),
    ];
    return recordables.flat();
  }

  get compartments(): NESTNodeCompartment[] {
    return this._compartments;
  }

  override get connections(): NESTConnection[] {
    return this.network.connections.all.filter(
      (connection: NESTConnection) => connection.sourceIdx === this.idx
    );
  }

  override get connectionsNeuronTargets(): NESTConnection[] {
    return this.network.connections.all.filter(
      (connection: NESTConnection) =>
        connection.sourceIdx === this.idx &&
        connection.targetNode.model.isNeuron
    );
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

  override get model(): NESTModel {
    if (!this._model) {
      this._model = this.getModel(this._modelId);
    } else if (this._modelCopied) {
      // TODO: find better condition.
      this._model = this.getModel(this._modelCopied.existingModelId);
    } else if (this._model.id !== this._modelId) {
      this._model = this.getModel(this._modelId);
    }

    return this._model as NESTModel;
  }

  get modelCopied(): NESTCopyModel | undefined {
    return this._modelCopied;
  }

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
  //   this.modelChanges();
  // }

  override get modelParams(): Record<string, ModelParameter> {
    return this.model.params;
  }

  override get models(): NESTModel[] {
    // Get models of the same element type.
    const elementType: string = this.model?.elementType;

    const models: NESTModel[] = this.modelDBStore.getModelsByElementType(
      elementType
    ) as NESTModel[];

    return models;
  }

  get modelsCopied(): NESTCopyModel[] {
    // Get copied models.
    return this.network.modelsCopied.all as NESTCopyModel[];
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
    const recordables = [
      ...this._receptors.map(
        (receptor: NESTNodeReceptor) => receptor.recordables
      ),
    ];
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
    return this.network.connections.all
      .filter((connection: NESTConnection) => connection.sourceIdx === this.idx)
      .map((connection: NESTConnection) => connection.targetNode);
  }

  /**
   * Add compartment component.
   * @param compartmentProps - node compartment props
   */
  addCompartment(compartmentProps: INESTNodeCompartmentProps): void {
    const compartment = new NESTNodeCompartment(this, compartmentProps);
    this._compartments.push(compartment);
    compartment.clean();
  }

  /**
   * Add compartments for the node.
   * @param compartmentsProps - list of node compartment props
   */
  addCompartments(compartmentsProps: INESTNodeCompartmentProps[]): void {
    this.logger.trace("add compartments");

    this._compartments = [];
    compartmentsProps.forEach((compartmentProps: INESTNodeCompartmentProps) =>
      this.addCompartment(compartmentProps)
    );
  }

  /**
   * Add receptor component.
   * @param receptorProps - receptor props
   */
  addReceptor(receptorProps: INESTNodeReceptorProps): void {
    this._receptors.push(new NESTNodeReceptor(this, receptorProps));
  }

  /**
   * Add receptors for the node.
   * @param receptorsProps - list of receptor props
   */
  addReceptors(receptorsProps: INESTNodeReceptorProps[]): void {
    this.logger.trace("add receptors");

    this._receptors = [];
    receptorsProps.forEach((receptorProps: INESTNodeReceptorProps) =>
      this.addReceptor(receptorProps)
    );
  }

  /**
   * Get NEST or copied NEST model.
   */
  override getModel(modelId: string): NESTModel {
    this.logger.trace("get model:", modelId);
    return this.modelDBStore.findModel(modelId) as NESTModel;
  }

  /**
   * Sets all params to invisible.
   */
  override hideAllParams(): void {
    this.paramsVisible = [];

    if (this.modelId === "cm_default") {
      this.compartments.forEach((comp: NESTNodeCompartment) =>
        comp.hideAllParams()
      );
      this.receptors.forEach((receptor: NESTNodeReceptor) =>
        receptor.hideAllParams()
      );
    }
  }

  /**
   * Load model.
   */
  override loadModel(paramsProps?: INodeParamProps[]): void {
    this.logger.trace("load model:", this._modelId, paramsProps);

    if (
      this.network.modelsCopied &&
      this.network.modelsCopied.findByModelId(this._modelId)
    ) {
      this._modelCopied = this.network.modelsCopied.getModel(this._modelId);
      this._model = this.getModel(this._modelCopied.existingModelId);
    } else {
      this._modelCopied = undefined;
      this._model = this.getModel(this._modelId);
    }

    this.addParameters(paramsProps);
  }

  /**
   * Remove compartment from the node.
   */
  removeCompartment(compartment: NESTNodeCompartment): void {
    // Remove all receptors linking to this compartment.
    compartment.receptors.forEach((receptor: NESTNodeReceptor) =>
      receptor.remove()
    );

    // Remove compartment from the list.
    this._compartments.splice(this._compartments.indexOf(compartment), 1);
    this._compartments = [...this._compartments];
  }

  /**
   * Remove receptor from the node.
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
   *
   * @remarks
   * It emits node changes.
   */
  override resetParams(): void {
    this.logger.trace("reset parameters");

    this.paramsAll.forEach((param: NodeParameter) => param.reset());

    if (this.modelId === "cm_default") {
      this.compartments.forEach((comp: NESTNodeCompartment) =>
        comp.resetParameters()
      );
      this.receptors.forEach((receptor: NESTNodeReceptor) =>
        receptor.resetParameters()
      );
    }

    this.changes();
  }

  /**
   * Sets all params to visible.
   */
  override showAllParams(): void {
    this.paramsVisible = Object.keys(this.params);

    if (this.modelId === "cm_default") {
      this.compartments.forEach((comp: NESTNodeCompartment) =>
        comp.showAllParams()
      );
      this.receptors.forEach((receptor: NESTNodeReceptor) =>
        receptor.showAllParams()
      );
    }
  }

  /**
   * Toggle spatial mode.
   */
  toggleSpatial(): void {
    const term: string = this.size === 1 ? "grid" : "free";
    this._spatial.init({
      positions: this.spatial.hasPositions ? undefined : term,
    });
    this.changes();
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

    if (this.size > 1) {
      nodeProps.size = this.size;
    }

    if (this.filteredParams.length > 0) {
      nodeProps.params = this.filteredParams.map((param: NodeParameter) =>
        param.toJSON()
      );
    }

    // Add annotations if provided.
    if (this.annotations.length > 0) {
      nodeProps.annotations = this.annotations;
    }

    // Add records if this model is multimeter.
    if (this.model.isMultimeter) {
      nodeProps.records = this.records.map((record: NodeRecord) =>
        record.toJSON()
      );
    }

    // Add positions if this node is spatial.
    if (this._spatial.hasPositions) {
      nodeProps.spatial = this._spatial.toJSON();
    }

    if (this._compartments.length > 0) {
      nodeProps.compartments = this._compartments.map(
        (compartment: NESTNodeCompartment) => compartment.toJSON()
      );
    }

    if (this._receptors.length > 0) {
      nodeProps.receptors = this._receptors.map((receptor: NESTNodeReceptor) =>
        receptor.toJSON()
      );
    }

    return nodeProps;
  }

  /**
   * Update recordables.
   */
  override updateRecordables(): void {
    this.logger.trace("update recordables");

    let recordables: INodeRecordProps[] = [];

    // Initialize recordables.
    if (this.connections.length > 0) {
      if (this.model.isAnalogRecorder) {
        const recordablesNodes = this.targetNodes.map((target: NESTNode) => {
          return (
            target.modelId === "cm_default"
              ? [
                  ...target.compartmentRecordables,
                  ...target.receptorRecordables,
                ]
              : [...target.model.recordables]
          ).flat();
        });

        if (recordablesNodes.length > 0) {
          const recordablesPooled: INodeRecordProps[] = recordablesNodes.flat();
          recordables = recordablesPooled.filter(onlyUnique);

          if (this.modelId === "voltmeter") {
            recordables = recordables.filter((recordProps: INodeRecordProps) =>
              ["V_m", "v"].includes(recordProps.id)
            );
          }

          recordables.sort((a: { id: string }, b: { id: string }) =>
            sortString(a.id, b.id)
          );
        }
      }
    } else if (this.modelId === "weight_recorder") {
      recordables.push(
        this.model.config?.localStorage.recordables.find(
          (recordProps: INodeRecordProps) => recordProps.id === "weights"
        )
      );
    }

    // if (recordables.length != this.recordables.length) {
    this.recordables = recordables.map(
      (recordProps: INodeRecordProps) => new NodeRecord(this, recordProps)
    );
    // }

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
