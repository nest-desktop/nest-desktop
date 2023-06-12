// modelStore.ts

import axios from "axios";
import combineURLs from "@/helpers/combineURLs";
import { reactive, UnwrapRef } from "vue";

import { download } from "@/helpers/download";

import { App } from "../app";
import { Model } from "./model";
import { ModelDB } from "./modelDB";
import { ModelView } from "./modelView";

export class ModelStore {
  private _app: App;
  private _db: ModelDB;
  private _state: UnwrapRef<any>;
  private _view: ModelView;

  constructor(app: App) {
    this._app = app;
    this._db = new ModelDB();
    this._state = reactive({
      filesGithub: [],
      filterTags: ["installed"],
      models: [],
      modelsNEST: [],
      searchTerm: "",
    });
    this._view = new ModelView(this._app);
  }

  get model(): Model {
    return this._view.state.model;
  }

  set model(value: Model) {
    this._view.state.modelId = value.id;
    this._view.state.model = value;
  }

  get recentModelId(): string | undefined {
    return this._state.models.length > 0 ? this._state.models[0].id : undefined;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get view(): ModelView {
    return this._view;
  }

  /**
   * Clear search term.
   */
  clearSearch(): void {
    this._state.searchTerm = "";
  }

  /**
   * Delete models.
   * @param models List of model objects.
   */
  deleteModels(models: Model[]): void {
    console.debug("Delete models");
    if (models.length === 0) return;
    const modelDocIds: string[] = models.map((model: Model) => model.doc._id);
    this._db.deleteBulk(modelDocIds).then(() => this.initModelList());
  }

  /**
   * Export models.
   */
  exportModels(models: Model[]): void {
    console.debug("Export models");
    const modelsJSON: any[] = models.map((model: Model) => model.toJSON());
    download(
      JSON.stringify(modelsJSON),
      modelsJSON.length === 1 ? "model" : "models"
    );
  }

  /**
   * Fetch models from NEST Simulator.
   */
  fetchModelsNEST(): void {
    if (!this._app.backends.nestSimulator.state.ready) {
      return;
    }

    this._app.backends.nestSimulator.instance
      .post("api/GetKernelStatus", { keys: ["node_models", "synapse_models"] })
      .then((response: any) => {
        const models = [...response.data[0], ...response.data[1]];
        models.sort();
        this._state.modelsNEST = models;
      });
  }

  /**
   * Fetch model files hosted on GitHub.
   */
  fetchModelFilesGithub(): void {
    const url =
      "https://api.github.com/repos/nest-desktop/nest-desktop-models/git/trees/main?recursive=true";
    axios.get(url).then((response: any) => {
      this._state.filesGithub = response.data.tree
        .filter((tree: any) => tree.path.endsWith(".json"))
        .map((tree: any) => tree.path);
    });
  }

  /**
   * Check if file exists on GitHub.
   * @param model Model name
   */
  fileExistGithub(model: string): boolean {
    return this._state.filesGithub.some((file: string) => {
      const modelGroup = file.split(".json")[0].split("/")[1];
      return model.startsWith(modelGroup);
    });
  }

  /**
   * Filter models by element type.
   */
  filterModels(elementType?: string): Model[] {
    if (elementType) {
      return this._state.models.filter(
        (model: Model) => model.elementType === elementType
      );
    } else {
      return this._state.models;
    }
  }

  /**
   * Get model from the model list.
   */
  getModel(modelId: string): Model {
    return (
      this._state.models.find((model: Model) => model.id === modelId) ||
      new Model({ id: modelId })
    );
  }

  /**
   * Import models.
   */
  importModels(models: any[]): void {
    console.debug("Import models");
    this._db.addModels(models).then(() => {
      this.initModelList();
    });
  }

  /**
   * Import model from GitHub.
   */
  async importModelFromGithub(modelId: string = ""): Promise<any> {
    console.debug("Import model from GitHub");
    const url =
      "https://raw.githubusercontent.com/nest-desktop/nest-desktop-models/main/";
    const path: string = this._state.filesGithub.find((file: string) =>
      file.includes("/" + (modelId || this._state.modelId))
    );
    if (path == null) {
      return;
    }
    return axios.get(combineURLs(url, path)).then((response: any) => {
      if (response.status === 200) {
        const data = response.data;
        this._db.importModel(data).then(() => {
          this.initModelList().then(() => {
            if (modelId === this._view.state.modelId) {
              this._view.initModel(modelId);
            }
          });
        });
      }
    });
  }

  /**
   * Reset states of all model.
   */
  resetModelStates(): void {
    this._state.models.forEach((model: Model) => model.resetState());
  }

  /**
   * Save model object to the database.
   */
  async saveModel(model: Model): Promise<any> {
    return this._db.importModel(model);
  }
}
