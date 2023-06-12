// modelView.ts

import { reactive, UnwrapRef } from "vue";
// import VueRouter from 'vue-router';

import { App } from "../app";
import { Config } from "@/helpers/config";
import { Model } from "../model/model";
import { Node } from "../node/node";
import { Project } from "../project/project";

export class ModelView extends Config {
  private _app: App;
  // Keywords taken from https://github.com/nest/nest-simulator/blob/master/extras/help_generator/generate_help.py#L73
  private _state: UnwrapRef<any>;
  private _tools: any[] = [
    {
      disabled: false,
      icon: "mdi-format-list-numbered-rtl",
      // icon: 'mdi-eye-outline',
      minWidth: 440,
      name: "modelParameterDefaults",
      title: "Defaults",
      width: "440",
    },
    {
      disabled: false,
      icon: "mdi-tune-variant",
      minWidth: 440,
      name: "modelParameterInput",
      title: "Model",
      width: "440",
    },
    {
      disabled: false,
      icon: "mdi-xml",
      minWidth: 575,
      name: "modelSimulationCode",
      title: "Code",
      width: "575",
    },
  ];

  constructor(app: App) {
    super("ModelView");
    this._app = app;
    this._state = reactive({
      defaults: {},
      doc: {
        blocks: [],
        helptext: "",
        subtitle: "",
        title: "",
      },
      fileExistedGithub: false,
      modeIdx: 0,
      model: undefined as Model | undefined,
      modelId: "ac_generator",
      projectFilename: "current-input",
      project: new Project(this._app),
      tool: undefined,
      toolOpened: false,
    });
  }

  get app(): App {
    return this._app;
  }

  /**
   * Check if the model is implemented.
   */
  get hasModel(): boolean {
    return this._app.model.hasModel(this._state.modelId);
  }

  get isNeuron(): boolean {
    if (this._state.model && this._state.model.elementType != null) {
      return this._state.model.isNeuron;
    } else if (
      this._state.defaults &&
      this._state.defaults.element_type != null
    ) {
      return this._state.defaults.element_type === "neuron";
    } else {
      return false;
    }
  }

  get modeIdx(): number {
    return this._state.modeIdx;
  }

  set modeIdx(value: number) {
    if (this._state.model == undefined) {
      this._state.modeIdx = value;
    } else {
      this._state.modeIdx = !this.isNeuron && value === 1 ? 0 : value;
      if (
        this.isNeuron &&
        this._state.modeIdx === 1 &&
        this._state.project &&
        this._state.project.simulation.code.hash !==
          this._state.project.activityGraph.codeHash &&
        this._app.project.view.config.simulateAfterLoad
      ) {
        this._state.project.runSimulation();
      }
    }
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get tools(): any[] {
    return this._tools;
  }

  /**
   * Check if file exists on Github
   */
  checkFileExistedGithub(): void {
    this._state.fileExistedGithub = this._app.model.state.filesGithub.some(
      (file: string) => file.includes("/" + this._state.modelId)
    );
  }

  /**
   * Get default values of parameters from NEST Simulator.
   */
  async getParamDefaults(): Promise<any> {
    return this._state.model
      .fetchDefaults()
      .then((resp: any) => {
        if (typeof resp.data === "string") {
          const data = resp.data.replace(/(NaN|-?Infinity)/g, '"$1"');
          this._state.defaults = JSON.parse(data);
        } else {
          this._state.defaults = resp.data || {};
        }
        this._state.params = Object.keys(this._state.defaults).map(
          (key: string) => {
            return { id: key, value: this._state.defaults[key] };
          }
        );
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  /**
   * Initialize model from the list.
   */
  initModel(id: string | undefined = undefined): void {
    console.debug("Initialize model: " + id);
    this._state.modelId = id || this._state.modelId;
    this._state.model = this._app.model.getModel(this._state.modelId);
    this.checkFileExistedGithub();

    // Returns if the NEST backend is not ready.
    if (!this._app.backends.nestSimulator.state.ready) {
      this.updateToolView();
      return;
    }

    this.getParamDefaults().then(() => {
      if (this._state.defaults["element_type"] === "neuron") {
        this.initProject();
        this._state.project.activityGraph.emptyActivityGraph();
        this.modeIdx = this.modeIdx;
      }
      this.updateToolView();
    });
  }

  /**
   * Initialize project.
   * It gets a project from the assets.
   */
  initProject(): void {
    const data: any = require(`@/assets/projects/${this._state.projectFilename}.json`);
    data.name = this._state.projectFilename;
    this._state.project = new Project(data);
    this.updateProject();
  }

  /**
   * Create a new model and add it to the list but not to the database.
   */
  newModel(): void {
    console.debug("New model");
    this._state.model = new Model();
  }

  /**
   * Redirects the page content to the model. If
   * no one was chosen before, the first one is selected.
   * Please beware: The route IDs used in this class are the ones in the
   * array, which might not contain every route from the Vue router!
   */
  redirect(): void {
    let modelId: string = "";
    if (
      this._app.model.state.models.find(
        (model: Model) => model.id === this._state.modelId
      )
    ) {
      modelId = this._state.modelId;
    }

    if (modelId == undefined || modelId.length <= 0) {
      modelId = this._app.model.recentModelId;
    }

    // const router: VueRouter = this._app.vueSetupContext.root.$router;
    // if (modelId == undefined) {
    //   router.push({
    //     name: 'model',
    //   });
    // } else if (router.currentRoute.params.id !== modelId) {
    //   // Check if the page is already loaded to avoid "Avoided redundant
    //   // navigation" error.
    //   router.push({
    //     name: 'modelId',
    //     params: { id: modelId },
    //   });
    // }
  }

  /**
   * Reload model from the list.
   */
  reloadModel(): void {
    console.debug("Reload model");
    this._state.model = undefined;
    setTimeout(() => {
      this._state.model = this._app.model.getModel(this._state.modelId);
      if (this._state.defaults["element_type"] === "neuron") {
        this.initProject();
        this.modeIdx = this.modeIdx;
      }
      this.updateToolView();
    }, 100);
  }

  /**
   * Reset model documentation.
   */
  resetDoc(): void {
    this._state.doc = {
      blocks: [],
      helptext: "",
      subtitle: "",
      title: "",
    };
  }

  /**
   * Reset tool.
   */
  resetTool(): void {
    this._state.toolOpened = false;
    this._state.tool = this._tools[0];
  }

  /**
   * Initialize project.
   * It gets a project from the assets.
   */
  selectProject(id: string): void {
    this._state.projectFilename = id;
    const elementType: string = this._state.defaults["element_type"];
    if (elementType === "neuron") {
      this.initProject();
      this.modeIdx = 1;
    }
  }

  /**
   * Select tool for this project.
   */
  selectTool(tool: any): void {
    this._state.toolOpened = this._state.toolOpened
      ? this._state.tool !== tool
      : true;
    this._state.tool = tool;
  }

  /**
   * Update project view.
   */
  update(): void {
    this._state.project.network.networkChanges();
    this._state.project.activityGraph.update();
  }

  /**
   * Update project.
   */
  updateProject(): void {
    const elementType: string = this._state.defaults["element_type"];
    if (elementType !== "neuron") {
      return;
    }
    this._state.project.network.neurons.forEach((neuron: Node) => {
      neuron.modelId = this._state.modelId;
      neuron.params = this._state.model.params;
      Object.values(neuron.params).forEach(
        (param: any) => (param.state.visible = true)
      );
    });
    this._state.project.simulation.code.generate();
  }

  /**
   * Update tool when a model is initialized.
   */
  updateToolView(): void {
    if (
      (!this.isNeuron && this._state.tool.title === "code") ||
      (this._state.model.params.length === 0 &&
        this._state.tool.title === "input")
    ) {
      this.selectTool(this._tools[0]);
    }
    this._tools[1].disabled = this._state.model.params.length === 0;
    this._tools[2].disabled = !this.isNeuron;
  }
}
