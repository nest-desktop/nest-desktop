import { Code } from '../code';
import { Project } from './project';

export class ProjectCode extends Code {
  private _project: Project; // parent
  private _script: string;

  constructor(project: Project) {
    super();
    this._project = project;
    this.generate();
  }

  get script(): string {
    return this._script;
  }

  set script(value: string) {
    this._script = value;
  }

  generate(): void {
    // console.log('Generate script');
    this._script = '';
    this._script += this.importModules();
    this._script += 'nest.ResetKernel()\n';

    this._script += '\n\n# Simulation kernel\n';
    this._script += this._project.simulation.code.setRandomSeed();
    this._script += this._project.simulation.code.setKernelStatus();

    // this._script += '\n\n# Copy models\n';
    // this.project.models.forEach((model: Model) => this._script += model.code.copyModel());

    this._script += '\n\n# Create nodes\n';
    this._script += this._project.network.code.createNodes();

    this._script += '\n\n# Connect nodes\n';
    this._script += this._project.network.code.connectNodes();

    this._script += '\n\n# Run simulation\n';
    this._script += this._project.simulation.code.simulate();

    this._script += '\n\n# Collect activities\n';
    this._script += this._project.network.code.getActivities();
  }

  importModules(): string {
    let script = '';
    script += 'import nest\n';
    script += 'import numpy\n';
    return script + '\n';
  }
}
