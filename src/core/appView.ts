import { reactive } from '@vue/composition-api';
import axios from 'axios';

import { App } from './app';
import { Project } from './project/project';

export class AppView {
  private _activity: any;
  private _app: App; // parent
  private _model: any;
  private _project: any;

  constructor(app: App) {
    this._app = app;
    this._activity = {
      graphMode: 'chart',
    };
    this._model = {
      repoURL:
        'https://api.github.com/repos/nest-desktop/nest-desktop-models/git/trees/main?recursive=true',
      state: reactive({
        filesGithub: [],
        filterTags: ['installed'],
        modelId: '',
        modelsNEST: [],
        searchTerm: '',
      }),
    };
    this._project = {
      searchTerm: '',
      state: reactive({
        activityGraph: 'abstract',
        modeIdx: 0,
        tool: undefined,
        toolOpened: false,
      }),
      tools: [
        {
          icon: '$network',
          minWidth: 440,
          name: 'networkParamEdit',
          title: 'Network',
          width: 440,
        },
        {
          icon: 'mdi-engine-outline',
          minWidth: 440,
          name: 'simulationKernel',
          title: 'Kernel',
          width: 440,
        },
        {
          icon: 'mdi-code-braces',
          minWidth: 575,
          name: 'dataJSON',
          title: 'Data',
          devMode: true,
          width: 575,
        },
        {
          icon: 'mdi-xml',
          minWidth: 575,
          name: 'codeEditor',
          title: 'Code',
          width: 575,
        },
        {
          icon: 'mdi-chart-scatter-plot',
          minWidth: 440,
          name: 'activityEdit',
          title: 'Activity',
          width: 440,
        },
        {
          icon: 'mdi-table-large',
          minWidth: 440,
          name: 'activityStats',
          title: 'Statistics',
          width: 440,
        },
      ],
    };
  }

  get activity(): any {
    return this._activity;
  }

  get filteredProjects(): Project[] {
    if (this._project.searchTerm === '') {
      return this._app.projects;
    }
    return this._app.projects.filter(
      (project: Project) =>
        project.name
          .toLowerCase()
          .indexOf(this._project.searchTerm.toLowerCase()) > -1
    );
  }

  get model(): any {
    return this._model;
  }

  get project(): any {
    return this._project;
  }

  /**
   * Fetch files hosted on GitHub.
   */
  fetchModelsNEST(): void {
    // Fetch models from NEST Simulator.
    const url = `${this._app.NESTSimulator.url}/api/Models`;
    axios.get(url).then(resp => {
      this._model.state.modelsNEST = resp.data;
    });
  }

  /**
   * Fetch model files hosted on GitHub.
   */
  fetchModelFilesGithub(): void {
    axios.get(this._model.repoURL).then((response: any) => {
      this._model.state.filesGithub = response.data.tree
        .filter((tree: any) => tree.path.endsWith('.json'))
        .map((tree: any) => tree.path);
    });
  }
}
