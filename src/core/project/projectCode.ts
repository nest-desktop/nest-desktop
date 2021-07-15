import { sha1 } from 'object-hash';
import { Code } from '../code';
import { Project } from './project';

export class ProjectCode extends Code {
  private _hash: string;
  private _project: Project; // parent
  private _script: string;

  constructor(project: Project) {
    super();
    this._project = project;
    this.generate();
  }

  get hash(): string {
    return this._hash;
  }

  get project(): Project {
    return this._project;
  }

  get script(): string {
    return this._script;
  }

  set script(value: string) {
    this._script = value;
    this._hash = sha1(this._script);
  }

  /**
   * Generate script code.
   */
  generate(): void {
    // console.log('Generate script');
    this._script = '';
    this._script += this.importModules();
    this._script += 'nest.ResetKernel()\n';

    if (this._project.config.simulateWithInsite) {
      this._script += 'nest.Install("insitemodule")';
    }

    this._script += '\n\n# Simulation kernel\n';
    this._script += this._project.simulation.code.setKernelStatus();

    // this._script += '\n\n# Copy models\n';
    // this.project.models.forEach((model: Model) => this._script += model.code.copyModel());

    this._script += '\n\n# Create nodes\n';
    this._script += this._project.network.code.createNodes();

    this._script += '\n\n# Connect nodes\n';
    this._script += this._project.network.code.connectNodes();

    this._script += '\n\n# Run simulation\n';
    this._script += this._project.simulation.code.simulate();

    if (!this._project.config.simulateWithInsite) {
      if (this._project.network.recorders.length > 0) {
        this._script += '\n\n# Get IDs of recorded node\n';
        this._script += this.defineGetNodeIds();

        if (this._project.network.hasSpatialNodes()) {
          this._script += '\n\n# Get node positions\n';
          this._script += this.defineGetNodePositions();
        }

        this._script += '\n\n# Collect response\n';
        this._script += this.response();
      }
    }

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
}
