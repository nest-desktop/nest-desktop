import { reactive, UnwrapRef } from '@vue/composition-api';
import { sha1 } from 'object-hash';

import { Code } from '../common/code';
import { Project } from './project';

export class ProjectCode extends Code {
  private _hash: string;
  private _project: Project; // parent
  private _script: string;
  private _state: UnwrapRef<any>;

  constructor(project: Project, projectCode: any = {}) {
    super();
    this._project = project;
    this._state = reactive({
      codeInsite: false,
      blocks: projectCode.blocks
        ? projectCode.blocks
        : [
            'importModules',
            'resetKernel',
            'setKernel',
            'createNodes',
            'connectNodes',
            'runSimulation',
          ],
    });

    this.clean();
  }

  get isInsiteReady(): boolean {
    return this._project.app.backends.insiteAccess.state.ready;
  }

  get hash(): string {
    return this._hash;
  }

  get project(): Project {
    return this._project;
  }

  get runSimulationInsite(): boolean {
    return this._state.blocks.includes('runSimulationInsite');
  }

  get script(): string {
    return this._script;
  }

  set script(value: string) {
    this._script = value;
    this._hash = sha1(this._script);
  }

  /**
   * Returns the first six digits of the SHA-1 project code hash.
   * @returns 6-digit id value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : '';
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  /**
   * Clean project code.
   */
  clean(): void {
    if (!this.isInsiteReady) {
      this._state.blocks = this._state.blocks.filter(
        (item: string) => item !== 'runSimulationInsite'
      );
    }
  }

  /**
   * Generate script code.
   */
  generate(): void {
    let script = '';
    if (this._state.blocks.includes('importModules')) {
      script += this.importModules();
    }

    if (this._state.blocks.includes('resetKernel')) {
      script += 'nest.ResetKernel()\n';
    }

    if (this.runSimulationInsite) {
      script += '\n# "insitemodule" can only be loaded once.\n';
      script += 'try:';
      script += this._() + 'nest.Install("insitemodule")\n';
      script += 'except:';
      script += this._() + 'pass';
    }

    if (this._state.blocks.includes('setKernel')) {
      script += '\n\n# Simulation kernel\n';
      script += this._project.simulation.code.setKernelStatus();
    }

    // this._script += '\n\n# Copy models\n';
    // this.project.models.forEach((model: Model) => this._script += model.code.copyModel());

    if (this._state.blocks.includes('createNodes')) {
      script += '\n\n# Create nodes\n';
      script += this._project.network.code.createNodes({
        runSimulationInsite: this.runSimulationInsite,
      });
    }

    if (this._state.blocks.includes('connectNodes')) {
      script += '\n\n# Connect nodes\n';
      script += this._project.network.code.connectNodes();
    }

    if (this._state.blocks.includes('runSimulation')) {
      script += '\n\n# Run simulation\n';
      script += this._project.simulation.code.simulate();

      if (
        !this.runSimulationInsite &&
        this._project.network.recorders.length > 0
      ) {
        script += '\n\n# Get IDs of recorded node\n';
        script += this.defineGetNodeIds();

        if (this._project.network.hasSpatialNodes()) {
          script += '\n\n# Get node positions\n';
          script += this.defineGetNodePositions();
        }

        script += '\n\n# Collect response\n';
        script += this.response();
      }
    }

    this._state.codeInsite = this.runSimulationInsite;
    this._script = script;
    this._hash = sha1(this._script);
  }

  /**
   * Generate script to import modules.
   */
  importModules(): string {
    let script = '';
    script += 'import nest\n';
    script += 'import numpy\n';
    return script + '\n';
  }

  /**
   * Generate script to define a function to get node ids.
   */
  defineGetNodeIds(): string {
    let script = '';
    script += 'def getNodeIds(node):';
    script += this._() + 'if node.model == "spike_recorder":';
    script +=
      this._(2) + 'return list(nest.GetConnections(None, node).sources())';
    script += this._() + 'else:';
    script += this._(2) + 'return list(nest.GetConnections(node).targets())';
    return script + '\n';
  }

  /**
   * Generate script to define a function to get node positions.
   */
  defineGetNodePositions(): string {
    let script = 'def getPosition(node):';
    script +=
      this._() + 'return list(zip(node.tolist(), nest.GetPosition(node)))';
    return script + '\n';
  }

  /**
   *  Generate script for response data.
   */
  response(): string {
    let script = '';
    script += 'response = {';
    script += this._() + '"kernel": {';
    script += this._(2) + '"biological_time": nest.biological_time';
    script += this._() + '}';
    if (this._project.network.recorders.length > 0) {
      script +=
        ',' +
        this._() +
        '"activities": ' +
        this._project.network.code.getActivities();
      if (this._project.network.hasSpatialNodes()) {
        script +=
          ',' +
          this._() +
          '"positions": ' +
          this._project.network.code.getNodePositions();
      }
    }
    script += this.end() + '}';
    return script + '\n';
  }

  /**
   * Export script to file.
   */
  export(format: string = 'py'): void {
    let data: any;
    if (format === 'py') {
      data = this._script;
    } else if (format === 'ipynb') {
      const source: string[] = this._script
        .split('\n')
        .map((s: string) => s + '\n');

      data = JSON.stringify(
        {
          cells: [
            {
              cell_type: 'code',
              execution_count: null,
              id: 'nest-desktop',
              metadata: {},
              outputs: [],
              source,
            },
          ],
          metadata: {
            language_info: {
              codemirror_mode: {
                name: 'ipython',
                version: 3,
              },
              file_extension: '.py',
              mimetype: 'text/x-python',
              name: 'python',
              nbconvert_exporter: 'python',
              pygments_lexer: 'ipython3',
              version: '3.8.10',
            },
          },
          nbformat: 4,
          nbformat_minor: 5,
        },
        null,
        '\t'
      );
    }
    this._project.app.download(data, 'script', format);
  }

  toJSON(): any {
    return { blocks: this._state.blocks };
  }
}
