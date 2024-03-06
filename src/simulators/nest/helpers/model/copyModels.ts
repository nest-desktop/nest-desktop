// copyModels.ts

import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { logger as mainLogger } from "@/helpers/common/logger";

import { NESTNetwork } from "../network/network";

import { NESTCopyModel, NESTCopyModelProps } from "./copyModel";

const logger = mainLogger.getSubLogger({ minLevel: 3, name: "copy model" });

interface NESTCopyModelsState {
  hash: string;
}

export class NESTCopyModels {
  private _models: NESTCopyModel[] = [];
  private _network: NESTNetwork; // parent
  private _state: UnwrapRef<NESTCopyModelsState>; // reactive state

  constructor(network: NESTNetwork, copyModels: NESTCopyModelProps[] = []) {
    this._network = network;

    this._state = reactive({
      hash: "",
    });

    this.init(copyModels);
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

  get state(): UnwrapRef<NESTCopyModelsState> {
    return this._state;
  }

  get synapseModels(): NESTCopyModel[] {
    return this._models.filter((model: NESTCopyModel) => model.model.isSynapse);
  }

  /**
   * Copy and add a model component to the network based on given model data.
   * @data Data of the model which should be copied and added
   */
  add(data: NESTCopyModelProps): NESTCopyModel {
    logger.trace("Add model");
    const model = new NESTCopyModel(this._network, data);
    this._models.push(model);
    return model;
  }

  /**
   * Copy and add a model component to the network based on a given model ID.
   * @param modelId ID of the model which should be copied adn added
   */
  copy(modelId: string): NESTCopyModel {
    logger.trace("Copy model");
    const model: NESTCopyModelProps = {
      existing: modelId,
      new: modelId + "_copied" + (this._models.length + 1),
    };
    return this.add(model);
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
    this.resetState();
    this._models = [];
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
  init(models: NESTCopyModelProps[] = []): void {
    this.clear();
    this.update(models);
  }

  /**
   * Remove model from the list.
   *
   */
  remove(model: NESTCopyModel): void {
    logger.trace("Delete model");
    this.resetState();

    // Remove model from the model list.
    this._models.splice(model.idx, 1);
  }

  /*
   * Reset all states.
   */
  resetState(): void {
    this._state.hash = "";
  }

  /**
   * Serialize for JSON.
   * @return network object
   */
  toJSON(): NESTCopyModelProps[] {
    return this._models.map((model: NESTCopyModel) => model.toJSON());
  }

  /**
   * Update network component.
   *
   * @param network - network object
   */
  update(models: NESTCopyModelProps[] = []): void {
    models.forEach((model: NESTCopyModelProps) => this.add(model));
    this.clean();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    logger.trace("Update Hash");
    this._state.hash = sha1({
      models: this._models.map(
        (model: NESTCopyModel) => model.toJSON() //TODO node.state.hash
      ),
    });
  }
}
