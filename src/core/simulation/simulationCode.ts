import { reactive, UnwrapRef } from '@vue/composition-api';
import { sha1 } from 'object-hash';
import Mustache from 'mustache';

import { Simulation } from './simulation';

export class SimulationCode {
  private _hash: string;
  private _script: string;
  private _simulation: Simulation; // parent
  private _state: {
    codeInsite: boolean;
    blocks: String[];
    version: string;
  };

  constructor(simulation: Simulation, simulationCode: any = {}) {
    this._simulation = simulation;
    this._state = reactive({
      codeInsite: false,
      blocks: simulationCode.blocks
        ? simulationCode.blocks
        : [
            'importModules',
            'resetKernel',
            'setKernel',
            'createNodes',
            'connectNodes',
            'runSimulation',
          ],
      version: '3.2',
    });

    this.clean();
  }

  get createNodes(): boolean {
    return this._state.blocks.includes('createNodes');
  }

  get connectNodes(): boolean {
    return this._state.blocks.includes('connectNodes');
  }

  get hash(): string {
    return this._hash;
  }

  get importModules(): boolean {
    return this._state.blocks.includes('importModules');
  }

  get isInsiteReady(): boolean {
    return this._simulation.project.app.backends.insiteAccess.state.ready;
  }

  get resetKernel(): boolean {
    return this._state.blocks.includes('resetKernel');
  }

  get runSimulation(): boolean {
    return this._state.blocks.includes('runSimulation');
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

  get setKernelStatus(): boolean {
    return this._state.blocks.includes('setKernel');
  }

  /**
   * Returns the first six digits of the SHA-1 project code hash.
   * @returns 6-digit id value
   */
  get shortHash(): string {
    return this._hash ? this._hash.slice(0, 6) : '';
  }

  get simulation(): Simulation {
    return this._simulation;
  }

  get state(): UnwrapRef<any> {
    return this._state;
  }

  /**
   * Clean the simulation code.
   */
  clean(): void {
    if (!this.isInsiteReady) {
      this._state.blocks = this._state.blocks.filter(
        (item: string) => item !== 'runSimulationInsite'
      );
    }
  }

  /**
   * Renders the script and generates the hash.
   */
  generate(): void {
    const template =
      require(`./simulationCodes/nest${this._state.version}.code`).default;

    const data = this._simulation.project;
    this._script = Mustache.render(template, data);
    this._hash = sha1(this._script);
  }

  /**
   * Export the script to file.
   */
  export(format: string = 'py'): void {
    let data: string;
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
    this._simulation.project.app.download(data, 'script', format);
  }

  toJSON(): any {
    return { blocks: this._state.blocks };
  }
}
