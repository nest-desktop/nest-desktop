// copyModels.ts

import { BaseObj } from "@/helpers/common/base";

import { NESTNetwork } from "../network/network";
import { INESTCopyModelProps, NESTCopyModel } from "./copyModel";

export class NESTCopyModels extends BaseObj {
  private _models: NESTCopyModel[] = [];
  private _network: NESTNetwork; // parent

  constructor(network: NESTNetwork, copyModelsProps: INESTCopyModelProps[] = []) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._network = network;
    this.update(copyModelsProps);
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
  add(modelProps: INESTCopyModelProps): NESTCopyModel {
    this.logger.trace("Add model");

    const model = new NESTCopyModel(this, modelProps);
    this._models.push(model);
    return model;
  }

  /**
   * Copy and add a model component to the network based on a given model ID.
   * @param modelId ID of the model which should be copied adn added
   */
  copy(modelId: string): NESTCopyModel {
    this.logger.trace("Copy model");

    const modelProps: INESTCopyModelProps = {
      existing: modelId,
      new: modelId + "_copied" + (this._models.length + 1),
    };
    return this.add(modelProps);
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
    this.updateHash();
  }

  /**
   * Filter models by element type.
   */
  filterByElementType(elementType: string = ""): NESTCopyModel[] {
    if (elementType) return this._models;
    return this._models.filter((model: NESTCopyModel) => model.elementType === elementType);
  }

  /**
   * Filter models by general element type.
   */
  filterByGeneralElementType(elementType: string = ""): NESTCopyModel[] {
    if (elementType) return this._models;
    return this._models.filter((model: NESTCopyModel) => model.elementTypeGeneral === elementType);
  }

  findByModelId(modelId: string): NESTCopyModel | undefined {
    return this._models.find((model: NESTCopyModel) => model.id === modelId);
  }

  /**
   * Get a model from the model list by ID.
   * @param modelId ID of the model
   */
  getModel(modelId: string): NESTCopyModel {
    return (
      this._models.find((model: NESTCopyModel) => model.id === modelId) ||
      new NESTCopyModel(this, {
        existing: modelId,
        new: modelId + "_copied" + (this._models.length + 1),
        params: [],
      })
    );
  }

  /**
   * Check if the network has some node models.
   */
  hasModel(modelId: string): boolean {
    return this._models.some((model: NESTCopyModel) => model.id === modelId);
  }

  /**
   * Initialize copy models.
   * @remarks Do not use it in the constructor.
   */
  init(): void {
    this._models.forEach((model: NESTCopyModel) => model.init());

    this.clean();
    this.updateHash();
  }

  /**
   * Remove model from the list.
   *
   */
  remove(model: NESTCopyModel): void {
    this.logger.trace("Delete model");

    // Remove model from the model list.
    this._models.splice(model.idx, 1);
  }

  /**
   * Show model in list.
   */
  showModel(model: NESTCopyModel): boolean {
    const elementTypeIdx = this._network.state.elementTypeIdx;

    // if (this._network.nodes.state.selectedNodes.length > 0) {
    //   // selected view
    //   const models = this._network.nodes.selectedNodeItems.map(
    //     (node: TNode) => node.model as NESTCopyModel
    //   );
    //   return models.includes(model);
    // } else
    if (elementTypeIdx > 0) {
      // element type view
      return this._network.elementTypes[elementTypeIdx].id === model.elementType;
    } else if (this._network.state.state.displayIdx.nodes.length > 0) {
      // custom view
      return this._network.state.state.displayIdx.nodes.includes(model.idx);
    } else {
      // all view
      return true;
    }
  }

  /**
   * Serialize for JSON.
   * @return network props
   */
  toJSON(): INESTCopyModelProps[] {
    return this._models.map((model: NESTCopyModel) => model.toJSON());
  }

  /**
   * Update copied model component.
   * @param model props
   */
  update(modelsProps: INESTCopyModelProps[] = []): void {
    modelsProps.forEach((modelProps: INESTCopyModelProps) => this.add(modelProps));
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      models: this._models.map(
        (model: NESTCopyModel) => model.toJSON(), //TODO node.hash
      ),
    });
  }
}
