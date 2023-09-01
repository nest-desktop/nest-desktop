// nestNode.ts

import { Parameter } from "@/helpers/parameter";

import { CopyModel } from "../model/copyModel";
import { Model } from "../model/model";
import {
  NodeCompartment,
  NodeCompartmentProps,
} from "./nodeCompartment/nodeCompartment";
import { NodeParameter } from "./nodeParameter";
import { NodeReceptor, NodeReceptorProps } from "./nodeReceptor/nodeReceptor";
import { NodeRecord, NodeRecordProps } from "./nodeRecord";
import { NodeSpatial, NodeSpatialProps } from "./nodeSpatial/nodeSpatial";
import { Nodes } from "./nodes";
import { BaseNode } from "@/common/node/baseNode";
import { NodeProps } from "./node";

export interface NESTNodeProps extends NodeProps {
  compartments?: NodeCompartmentProps[];
  receptors?: NodeReceptorProps[];
  records?: NodeRecordProps[];
  spatial?: NodeSpatialProps;
}

export class NESTNode extends BaseNode {
  private _compartments: NodeCompartment[] = [];
  private _model: Model | CopyModel;
  private _positions: number[][] = [];
  private _receptors: NodeReceptor[] = [];
  private _spatial: NodeSpatial;

  constructor(nodes: Nodes, node: NESTNodeProps = {}) {
    super(nodes, node, "NESTNode");
    this.init(node);
  }

  get assignedModels(): CopyModel[] {
    if (this.modelId !== "weight_recorder") {
      return [];
    }

    return this.network.models.filter((model: CopyModel) =>
      Object.values(model.params).some(
        (param: Parameter) => param.value === this.view.label
      )
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

  get hasCompartments(): boolean {
    return this._compartments.length > 0;
  }

  get hasReceptors(): boolean {
    return this._receptors.length > 0;
  }

  override get hasSomeVisibleParams(): boolean {
    return (
      this.paramsVisible.length > 0 || this.modelId === "multimeter" // ||
      // this.network.project.simulation.code.runSimulationInsite
    );
  }

  override get model(): CopyModel | Model {
    if (this._model?.id !== this.modelId) {
      this._model = this.getModel(this.modelId);
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
  override set model(model: CopyModel | Model) {
    this.modelId = model.id;
    this._model = model;
    this.modelChanges();
  }

  override get models(): (CopyModel | Model)[] {
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

  override get sizeVisible(): boolean {
    return this.view.state.showSize && !this._spatial.hasGridPositions;
  }

  get spatial(): NodeSpatial {
    return this._spatial;
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
   * Add receptor component.
   * @param receptor - receptor object
   */
  addReceptor(receptor: any): void {
    this._receptors.push(new NodeReceptor(this, receptor));
  }

  /**
   * Clone this node component.
   * @return cloned node component
   */
  override clone(): NESTNode {
    return new NESTNode(this.nodes, { ...this.toJSON() });
  }

  /**
   * Get model.
   */
  override getModel(modelId: string): CopyModel | Model {
    this.logger.trace("get model:", modelId);
    if (this.network.models.some((model: CopyModel) => model.id === modelId)) {
      return this.network.models.getModelById(modelId);
    } else {
      return this.network.project.modelStore.getModel(modelId);
    }
  }

  /**
   * Sets all params to invisible.
   */
  override hideAllParams(): void {
    this.paramsVisible = [];

    if (this.modelId === "cm_default") {
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
  override init(node?: NESTNodeProps): void {
    this.logger.trace("init");

    this.initParameters(node);
    this.initCompartments(node);
    this.initReceptors(node);

    if (this.model.isRecorder) {
      this.initActivity(node?.activity);
    }

    this.state.updateHash();
  }

  /**
   * Initialize compartments for the node.
   * @param node - node object
   */
  initCompartments(node?: NESTNodeProps): void {
    this.logger.trace("init compartments");
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
  initReceptors(node?: NESTNodeProps): void {
    this.logger.trace("init receptors");
    this._receptors = [];
    if (node && node.receptors) {
      node.receptors.forEach((receptor: any) => this.addReceptor(receptor));
    }
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
  override resetParameters(): void {
    this.logger.trace("reset parameters");
    this.paramsAll.forEach((param: NodeParameter) => param.reset());

    if (this.modelId === "cm_default") {
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
  override showAllParams(): void {
    this.paramsVisible = Object.keys(this.params);

    if (this.modelId === "cm_default") {
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
    const term: string = this.size === 1 ? "grid" : "free";
    this._spatial.init({
      positions: this.spatial.hasPositions ? undefined : term,
    });
    this.changes();
  }

  /**
   * Serialize for JSON.
   * @return node object
   */
  override toJSON(): NESTNodeProps {
    const node: NESTNodeProps = {
      model: this.modelId,
      view: this.view.toJSON(),
    };

    if (this.size > 1) {
      node.size = this.size;
    }

    if (this.filteredParams.length > 0) {
      node.params = this.filteredParams.map((param: NodeParameter) =>
        param.toJSON()
      );
    }

    // Add annotations if provided.
    if (this.annotations.length > 0) {
      node.annotations = this.annotations;
    }

    // Add records if this model is multimeter.
    if (this.model.isMultimeter) {
      node.records = this.records.map((nodeRecord: NodeRecord) =>
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
  override updateRecords(): void {
    this.logger.trace("update records");
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
      } else if (this.modelId === "voltmeter") {
        recordables.push(
          this.model.config.recordables.find(
            (record: any) => record.id === "V_m"
          )
        );
      }
    } else if (this.modelId === "weight_recorder") {
      recordables.push(
        this.model.config.recordables.find(
          (record: any) => record.id === "weights"
        )
      );
    }

    let recordableIds: string[];
    recordableIds = recordables.map((record: any) => record.id);
    this.recordables = [
      ...this.recordables.filter((record: NodeRecord) =>
        recordableIds.includes(record.id)
      ),
    ];

    recordableIds = this.recordables.map((record: any) => record.id);
    recordables
      .filter((record: any) => !recordableIds.includes(record.id))
      .forEach((record: any) => {
        this.recordables.push(new NodeRecord(this, record));
      });

    // Initialize selected records.
    if (this.doc.records != null) {
      // Load record from stored nodes.
      const recordIds = this.doc.records.map((record: any) => record.id);
      this.records = [
        ...this.recordables.filter((record: NodeRecord) =>
          recordIds.includes(record.id)
        ),
      ];
    } else if (this.records.length > 0) {
      // In case when user select other model.
      const recordIds = this.records.map((record: NodeRecord) => record.id);
      this.records = [
        ...this.recordables.filter((record: NodeRecord) =>
          recordIds.includes(record.id)
        ),
      ];
      this.records.forEach((record: NodeRecord) => record.updateGroupID());
    } else {
      this.records = [...this.recordables];
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
}
