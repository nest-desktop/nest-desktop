// copyModels.ts

import { BaseObj } from "@/core";
import type { IParamState } from "@/parameter";

import { type INESTCopyModelState, NESTCopyModel } from "./copyModel";
import { NESTNetwork } from "../network";

export class NESTCopyModels extends BaseObj {
  private _models: NESTCopyModel[] = [];
  private _network: NESTNetwork; // parent

  constructor(network: NESTNetwork) {
    super();

    this._network = network;
  }

  get all(): NESTCopyModel[] {
    return this._models;
  }

  get filter() {
    return this._models.filter;
  }

  /**
   * Check if the network has some node models.
   */
  get hasNodeModels(): boolean {
    return this._models.some((model: NESTCopyModel) => model.isNode);
  }

  /**
   * Check if the network has some synapse models.
   */
  get hasSynapseModels(): boolean {
    return this._models.some((model: NESTCopyModel) => model.isSynapse);
  }

  get length(): number {
    return this._models.length;
  }

  get models(): NESTCopyModel[] {
    return this._models;
  }

  get modelsRecordedByWeightRecorder(): NESTCopyModel[] {
    return this._models.filter((model: NESTCopyModel) => model.hasWeightRecorderParam);
  }

  get network(): NESTNetwork {
    return this._network;
  }

  get nodeModels(): NESTCopyModel[] {
    return this._models.filter((model: NESTCopyModel) => model.isNode);
  }

  get synapseModels(): NESTCopyModel[] {
    return this._models.filter((model: NESTCopyModel) => model.isSynapse);
  }

  /**
   * Copy and add a model component to the network based on given model data.
   * @data Data of the model which should be copied and added
   */
  add(modelState: INESTCopyModelState): NESTCopyModel {
    this.logger.trace("Add model");

    const model = new NESTCopyModel(this);
    model.load(modelState);
    this.models.push(model);
    return model;
  }

  /**
   * Copy and add a model component to the network based on a given model ID.
   * @param modelId ID of the model which should be copied adn added
   */
  copy(modelId: string, paramState?: IParamState[]): NESTCopyModel {
    this.logger.trace("Copy model");

    const modelState: INESTCopyModelState = {
      existing: modelId,
      new: modelId + "_copied" + (this._models.length + 1),
      params: paramState,
    };
    const copyModel = this.add(modelState);
    copyModel.init();
    return copyModel;
  }

  /**
   * Clean model components.
   */
  clean(): void {
    this._models.forEach((model: NESTCopyModel) => model.clean());
  }

  /**
   * Clear model list.
   *
   */
  clear(): void {
    this._models = [];
    // this.updateHash();
  }

  /**
   * Filter models by element type.
   */
  filterByElementType(elementType: string = ""): NESTCopyModel[] {
    if (elementType) return this.models;
    return this.models.filter((model: NESTCopyModel) => model.elementType === elementType);
  }

  /**
   * Filter models by general element type.
   */
  filterByGeneralElementType(elementType: string = ""): NESTCopyModel[] {
    if (elementType) return this.models;
    return this.models.filter((model: NESTCopyModel) => model.elementTypeGeneral === elementType);
  }

  findByModelId(modelId: string): NESTCopyModel | undefined {
    return this.models.find((model: NESTCopyModel) => model.id === modelId);
  }

  /**
   * Get a model from the model list by ID.
   * @param modelId ID of the model
   */
  getModel(modelId: string): NESTCopyModel {
    return this.findByModelId(modelId) || this.copy(modelId);
  }

  /**
   * Check if the network has some node models.
   */
  hasModel(modelId: string): boolean {
    return this.models.some((model: NESTCopyModel) => model.id === modelId);
  }

  /**
   * Initialize copy models.
   * @remarks Do not use it in the constructor.
   */
  init(): void {
    this.models.forEach((model: NESTCopyModel) => model.init());

    this.clean();
    // this.updateHash();
  }

  /**
   * Load copied model from state.
   * @param modelStates model states
   */
  load(modelStates: INESTCopyModelState[]): void {
    modelStates.forEach((modelState: INESTCopyModelState) => this.add(modelState));
  }

  /**
   * Remove model from the list.
   *
   */
  remove(model: NESTCopyModel): void {
    this.logger.trace("Delete model");

    // Remove model from the model list.
    this.models.splice(model.idx, 1);
  }

  /**
   * save copy models to states.
   * @return copy model states
   */
  override save(): INESTCopyModelState[] {
    return this.models.map((model: NESTCopyModel) => model.save());
  }

  /**
   * Show model in list.
   */
  showModel(model: NESTCopyModel): boolean {
    const elementTypeIdx = this.network.state.elementTypeIdx;

    // if (this._network.nodes.state.selectedNodes.length > 0) {
    //   // selected view
    //   const models = this._network.nodes.selectedNodeItems.map(
    //     (node: TNode) => node.model as NESTCopyModel
    //   );
    //   return models.includes(model);
    // } else
    if (elementTypeIdx > 0 && this.network.elementTypes[elementTypeIdx]) {
      // element type view
      return this.network.elementTypes[elementTypeIdx].id === model.elementType;
    } else if (this.network.state.state.displayIdx.nodes.length > 0) {
      // custom view
      return this.network.state.state.displayIdx.nodes.includes(model.idx);
    } else {
      // all view
      return true;
    }
  }
}
