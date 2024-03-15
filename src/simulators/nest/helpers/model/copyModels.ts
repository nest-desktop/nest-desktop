// copyModels.ts

import { BaseObj } from "@/helpers/common/base";

import { NESTNetwork } from "../network/network";
import { INESTCopyModelProps, NESTCopyModel } from "./copyModel";

export class NESTCopyModels extends BaseObj {
  private _models: NESTCopyModel[] = [];
  private _network: NESTNetwork; // parent

  constructor(
    network: NESTNetwork,
    copyModelsProps: INESTCopyModelProps[] = []
  ) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._network = network;

    this.init(copyModelsProps);
  }

  get all(): NESTCopyModel[] {
    return this._models;
  }

  get filter() {
    return this._models.filter;
  }

  /**
   * Check if the network has any node models.
   */
  get hasNodeModels(): boolean {
    return this._models.some((model: NESTCopyModel) => !model.model.isSynapse);
  }

  /**
   * Check if the network has any synapse models.
   */
  get hasSynapseModels(): boolean {
    return this._models.some((model: NESTCopyModel) => model.model.isSynapse);
  }

  get length(): number {
    return this._models.length;
  }

  get modelsRecordedByWeightRecorder(): NESTCopyModel[] {
    return this._models.filter(
      (model: NESTCopyModel) => model.hasWeightRecorderParam
    );
  }

  get nodeModels(): NESTCopyModel[] {
    return this._models.filter(
      (model: NESTCopyModel) => !model.model.isSynapse
    );
  }

  get some() {
    return this._models.some;
  }

  get synapseModels(): NESTCopyModel[] {
    return this._models.filter((model: NESTCopyModel) => model.model.isSynapse);
  }

  /**
   * Copy and add a model component to the network based on given model data.
   * @data Data of the model which should be copied and added
   */
  add(modelProps: INESTCopyModelProps): NESTCopyModel {
    this.logger.trace("Add model");
    const model = new NESTCopyModel(this._network, modelProps);
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
    if (elementType) {
      return this._models;
    }
    return this._models.filter(
      (model: NESTCopyModel) => model.model.elementType === elementType
    );
  }

  findBySynapseModelId(modelId: string): NESTCopyModel | undefined {
    return this._models.find((model: NESTCopyModel) => model.id === modelId);
  }

  /**
   * Get a model from the model list by ID.
   * @param modelId ID of the model
   */
  getModelById(modelId: string): NESTCopyModel {
    return (
      this._models.find((model: NESTCopyModel) => model.id === modelId) ||
      new NESTCopyModel(this._network, {
        existing: modelId,
        new: modelId + "_copied" + (this._models.length + 1),
        params: [],
      })
    );
  }

  /**
   * Initialize
   */
  init(modelsProps: INESTCopyModelProps[] = []): void {
    this.clear();
    this.update(modelsProps);
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
   * Serialize for JSON.
   * @return network props
   */
  toJSON(): INESTCopyModelProps[] {
    return this._models.map((model: NESTCopyModel) => model.toJSON());
  }

  /**
   * Update copied model component.
   *
   * @param model props
   */
  update(modelsProps: INESTCopyModelProps[] = []): void {
    modelsProps.forEach((modelProps: INESTCopyModelProps) =>
      this.add(modelProps)
    );
    this.clean();
    this.updateHash();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    this._updateHash({
      models: this._models.map(
        (model: NESTCopyModel) => model.toJSON() //TODO node.state.hash
      ),
    });
  }
}
