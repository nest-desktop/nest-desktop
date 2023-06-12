// copyModels.ts
import { reactive, UnwrapRef } from "vue";
import { sha1 } from "object-hash";

import { CopyModel, CopyModelProps } from "./copyModel";
import { Network } from "../network/network";

interface CopyModelsState {
  hash: string;
}

export interface CopyModelProps extends CopyModelProps {}

export class CopyModels {
  private _models: CopyModel[] = [];
  private _network: Network; // parent
  private _state: UnwrapRef<CopyModelsState>; // reactive state

  constructor(network: Network, copyModels: CopyModelProps[] = []) {
    this._network = network;

    this._state = reactive({
      hash: "",
    });

    this.init(copyModels);
  }

  get all(): CopyModel[] {
    return this._models;
  }

  get filter() {
    return this._models.filter;
  }

  /**
   * Check if the network has any node models.
   */
  get hasNodeModels(): boolean {
    return this._models.some((model: CopyModel) => !model.model.isSynapse);
  }

  /**
   * Check if the network has any synapse models.
   */
  get hasSynapseModels(): boolean {
    return this._models.some((model: CopyModel) => model.model.isSynapse);
  }

  get length(): number {
    return this._models.length;
  }

  get modelsRecordedByWeightRecorder(): CopyModel[] {
    return this._models.filter(
      (model: CopyModel) => model.hasWeightRecorderParam
    );
  }

  get nodeModels(): CopyModel[] {
    return this._models.filter((model: CopyModel) => !model.model.isSynapse);
  }

  get some() {
    return this._models.some;
  }

  get state(): UnwrapRef<CopyModelsState> {
    return this._state;
  }

  get synapseModels(): CopyModel[] {
    return this._models.filter((model: CopyModel) => model.model.isSynapse);
  }

  /**
   * Copy and add a model component to the network based on given model data.
   * @data Data of the model which should be copied and added
   */
  add(data: CopyModelProps): CopyModel {
    // console.log("Add model");
    const model = new CopyModel(this._network, data);
    this._models.push(model);
    return model;
  }

  /**
   * Copy and add a model component to the network based on a given model ID.
   * @param modelId ID of the model which should be copied adn added
   */
  copy(modelId: string): CopyModel {
    // console.log("Copy model");
    const model: CopyModelProps = {
      existing: modelId,
      new: modelId + "_copied" + (this._models.length + 1),
    };
    return this.add(model);
  }

  /**
   * Clean model components.
   */
  clean(): void {
    this._models.forEach((model: CopyModel) => model.clean());
    this.updateHash();
  }

  /**
   * Empty model list.
   *
   */
  empty(): void {
    this.resetState();
    this._models = [];
  }

  /**
   * Filter models by element type.
   */
  filterByElementType(elementType: string = ""): CopyModel[] {
    if (elementType) {
      return this._models;
    }
    return this._models.filter(
      (model: CopyModel) => model.model.elementType === elementType
    );
  }

  findBySynapseModelId(modelId: string): CopyModel | undefined {
    return this._models.find((model: CopyModel) => model.id === modelId);
  }

  /**
   * Get a model from the model list by ID.
   * @param modelId ID of the model
   */
  getModelById(modelId: string): CopyModel {
    return (
      this._models.find((model: CopyModel) => model.id === modelId) ||
      new CopyModel(this._network, {
        existing: modelId,
        new: modelId + "_copied" + (this._models.length + 1),
        params: [],
      })
    );
  }

  /**
   * Initialize
   */
  init(models: CopyModelProps[] = []): void {
    this.empty();
    this.update(models);
  }

  /**
   * Remove model from the list.
   *
   */
  remove(model: CopyModel): void {
    // console.log("Delete model");

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
  toJSON(): CopyModelProps[] {
    return this._models.map((model: CopyModel) => model.toJSON());
  }

  /**
   * Update network component.
   *
   * @param network - network object
   */
  update(models: CopyModelProps[] = []): void {
    models.forEach((model: CopyModelProps) => this.add(model));
    this.clean();
  }

  /**
   * Update hash.
   */
  updateHash(): void {
    // console.log('Update Hash');
    this._state.hash = sha1({
      models: this._models.map(
        (model: CopyModel) => model.toJSON() //TODO node.state.hash
      ),
    });
  }
}
