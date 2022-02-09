import { reactive, UnwrapRef } from '@vue/composition-api';

import { consoleLog } from '../common/logger';

import { App } from '../app';
import { Model } from '../model/model';
import { Node } from '../node/node';
import { Project } from '../project/project';

export class ModelView {
  private _app: App;
  // Keywords taken from https://github.com/nest/nest-simulator/blob/master/extras/help_generator/generate_help.py#L73
  private _docKeywords = [
    'Synopsis',
    'Examples',
    'Description',
    'Parameters',
    'Options',
    'Requires',
    'Require',
    'Receives',
    'Transmits',
    'Sends',
    'Variants',
    'Bugs',
    'Diagnostics',
    'Remarks',
    'Availability',
    'References',
    'See also',
    'Author',
    'Authors',
    'FirstVersion',
    'Source',
    'EndUserDocs */',
  ];
  private _state: UnwrapRef<any>;
  private _tools: any[] = [
    {
      disabled: false,
      icon: 'mdi-format-list-numbered-rtl',
      // icon: 'mdi-eye-outline',
      minWidth: 440,
      name: 'modelParameterDefaults',
      title: 'Defaults',
      width: '440',
    },
    {
      disabled: false,
      icon: 'mdi-tune-variant',
      minWidth: 440,
      name: 'modelParameterInput',
      title: 'Model',
      width: '440',
    },
    {
      disabled: false,
      icon: 'mdi-xml',
      minWidth: 575,
      name: 'modelSimulationCode',
      title: 'Code',
      width: '575',
    },
  ];

  constructor(app: App) {
    this._app = app;
    this._state = reactive({
      defaults: {},
      doc: {
        blocks: [],
        helptext: '',
        subtitle: '',
        title: '',
      },
      fileExistedGithub: false,
      modeIdx: 0,
      model: undefined as Model | undefined,
      modelId: '',
      projectFilename: 'current-input',
      project: new Project(this._app),
      tool: undefined,
      toolOpened: false,
    });
  }

  get app(): App {
    return this._app;
  }

  get modeIdx(): number {
    return this._state.modeIdx;
  }

  set modeIdx(value: number) {
    if (this._state.model == undefined) {
      this._state.modeIdx = value;
    } else {
      this._state.modeIdx = !this.isNeuron() && value === 1 ? 0 : value;
      if (
        this.isNeuron() &&
        this._state.modeIdx === 1 &&
        this._state.project &&
        this._state.project.code.hash !==
          this._state.project.activityGraph.codeHash &&
        this._app.project.view.config.simulateAfterLoad
      ) {
        this._state.project.runSimulation();
      }
    }

    if (this.modeIdx === 0 && this._state.doc.title !== this._state.modelId) {
      this.updateModelDoc();
    }
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  get tools(): any[] {
    return this._tools;
  }

  consoleLog(text: string): void {
    consoleLog(this, text, 3);
  }

  /**
   * Initialize model from the list.
   */
  initModel(id: string = undefined): void {
    this.consoleLog('Initialize model: ' + id);
    this._state.modelId = id || this._state.modelId;
    this._state.model = this._app.model.getModel(this._state.modelId);
    this.checkFileExistedGithub();
    this.getParamDefaults().then(() => {
      this.updateProject();
      this._state.project.activityGraph.emptyActivityGraph();
      this.modeIdx = this.modeIdx;
      this.updateToolView();
    });
  }

  /**
   * Reload model from the list.
   */
  reloadModel(): void {
    this.consoleLog('Reload model');
    this._state.model = undefined;
    setTimeout(() => {
      this._state.model = this._app.model.getModel(this._state.modelId);
      this.initProject();
      this.updateToolView();
      this.modeIdx = this.modeIdx;
    }, 100);
  }

  /**
   * Create a new model and add it to the list but not to the database.
   */
  newModel(): void {
    this.consoleLog('New model');
    this._state.model = new Model(this._app);
  }

  /**
   * Check if the model is implemented.
   */
  hasModel(): boolean {
    return this._app.model.hasModel(this._state.modelId);
  }

  /**
   * Initialize project.
   * It gets a project from the assets.
   */
  initProject(): void {
    const data: any = require(`@/assets/projects/${this._state.projectFilename}.json`);
    data.name = this._state.projectFilename;
    this._state.project = new Project(this._app, data);
    this.updateProject();
  }

  /**
   * Update project.
   */
  updateProject(): void {
    if (this._state.projectFilename !== this._state.project.name) {
      this.initProject();
    }
    const elementType: string = this._state.defaults['element_type'];
    if (elementType !== 'neuron') {
      return;
    }
    const neuron: Node = this._state.project.network.neurons[0];
    neuron.modelId = this._state.modelId;
    neuron.params = this._state.model.params;
    neuron.params.forEach((param: any) => (param.state.visible = true));
    this._state.project.code.generate();
  }

  /**
   * Initialize project.
   * It gets a project from the assets.
   */
  selectProject(id: string): void {
    this._state.projectFilename = id;
    this.initProject();
    this.modeIdx = 1;
  }

  /**
   * Get paramter defaults from NEST Simulator.
   */
  async getParamDefaults(): Promise<any> {
    return this._state.model
      .fetchDefaults()
      .then((resp: any) => {
        if (typeof resp.data === 'string') {
          const data = resp.data.replace(/(NaN|-?Infinity)/g, '"$1"');
          this._state.defaults = JSON.parse(data);
        } else {
          this._state.defaults = resp.data;
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
   * Select tool for this project.
   */
  selectTool(tool: any): void {
    this._state.toolOpened = this._state.toolOpened
      ? this._state.tool !== tool
      : true;
    this._state.tool = tool;
  }

  /**
   * Update tool when a model is initialized.
   */
  updateToolView(): void {
    if (
      (!this.isNeuron() && this._state.tool.title === 'code') ||
      (this._state.model.params.length === 0 &&
        this._state.tool.title === 'input')
    ) {
      this.selectTool(this._tools[0]);
    }
    this._tools[1].disabled = this._state.model.params.length === 0;
    this._tools[2].disabled = !this.isNeuron();
  }

  /**
   * Reset tool.
   */
  resetTool(): void {
    this._state.toolOpened = false;
    this._state.tool = this._tools[0];
  }

  /**
   * Reset model documentation.
   */
  resetDoc(): void {
    this._state.doc = {
      blocks: [],
      helptext: '',
      subtitle: '',
      title: '',
    };
  }

  isNeuron(): boolean {
    if (this._state.model && this._state.model.elementType != null) {
      return this._state.model.isNeuron();
    } else if (
      this._state.defaults &&
      this._state.defaults.element_type != null
    ) {
      return this._state.defaults.element_type === 'neuron';
    } else {
      return false;
    }
  }

  /**
   * Update model documentation.
   */
  updateModelDoc(): void {
    this.resetDoc();
    if (!this._state.modelId) {
      return;
    }
    const path = 'api/help?return_text=true&obj=' + this._state.modelId;
    this._app.backends.nestSimulator.instance
      .get(path)
      .then((resp: any) => {
        if (resp.status !== 200) {
          return;
        }
        this._state.doc.helptext = resp.data;
        this._state.doc.title = this._state.modelId;
        const lines: string[] = this._state.doc.helptext.split('\n');
        this._state.doc.subtitle = lines[0].split(' – ')[1] || '';
        let blocks: any[] = this._docKeywords.map((keyword: string) => [
          lines.indexOf(keyword),
          keyword,
        ]);
        blocks = blocks.sort((a: any[], b: any[]) => a[0] - b[0]);
        blocks = blocks.filter(block => block[0] !== -1);
        const content: any = {};
        blocks.map((block: any, i: number) => {
          const start: number = parseInt(block[0], 0) + 2;
          const end: number =
            i < blocks.length - 1
              ? parseInt(blocks[i + 1][0], 0) - 1
              : lines.length;
          content[block[1]] = lines.slice(start, end).join('\n');
        });

        this._state.doc.blocks = this._docKeywords
          .filter((keyword: string) => content[keyword])
          .map((title: string) => {
            return {
              title,
              content: content[title],
            };
          });
      })
      .catch(() => {
        this._state.doc.blocks = [
          {
            content: `Sorry, there is no help for '${this._state.modelId}'.`,
          },
        ];
      });
  }

  /**
   * Check if file exists on Github
   */
  checkFileExistedGithub(): void {
    this._state.fileExistedGithub = this._app.model.state.filesGithub.some(
      (file: string) => file.includes('/' + this._state.modelId)
    );
  }

  /**
   * Update project view.
   */
  update(): void {
    this._state.project.network.networkChanges();
    this._state.project.activityGraph.update();
  }
}
