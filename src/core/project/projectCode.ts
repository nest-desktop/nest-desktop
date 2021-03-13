import { sha1 } from 'object-hash';
import { Code } from '../code';
import { Project } from './project';

export class ProjectCode extends Code {
  private _project: Project; // parent
  private _script: string;
  private _hash: string;

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

    this._script +=
      '\n\n# Define function getting activity from the recorder\n';
    this._script += this.defineGetActivity();

    if (this._project.network.hasSpatialNodes()) {
      this._script += '\n\n# Define function getting node positions\n';
      this._script += this.defineGetNodePositions();
    }

    this._script += '\n\n# Collect activities\n';
    this._script += this.response();

    this._hash = sha1(this._script);
  }

  /**
   * Script to import modules.
   */
  importModules(): string {
    let script = '';
    script += 'import nest\n';
    script += 'import numpy\n';
    return script + '\n';
  }

  /**
   * Script to define function to get activity.
   */
  defineGetActivity(): string {
    let script = '';
    script += 'def getActivity(node):';
    script += this._() + 'activity = {}';
    script += this._() + 'activity["events"] = node.get("events")';
    script += this._() + 'if node.get("model") == "spike_recorder":';
    script += this._(2) + 'activity["nodeIds"] = list(';
    script += this._(3) + 'nest.GetConnections(None, node).sources()';
    script += this._(2) + ')';
    script += this._() + 'else:';
    script += this._(2) + 'activity["nodeIds"] = list(';
    script += this._(3) + 'nest.GetConnections(node).targets()';
    script += this._(2) + ')';
    script += this._() + 'return activity';
    return script;
  }

  /**
   * Script to define function to get node positions.
   */
  defineGetNodePositions(): string {
    let script = 'def getPosition(node):';
    script +=
      this._() + 'return list(zip(node.tolist(), nest.GetPosition(node)))';
    return script + '\n';
  }

  /**
   * Script for response data.
   */
  response(): string {
    let script = '';
    script += 'response = {';
    script += this._() + '"kernel": {"time": nest.GetKernelStatus("time")},';
    script +=
      this._() + '"activities": ' + this._project.network.code.getActivities();
    if (this._project.network.hasSpatialNodes()) {
      script +=
        ',' +
        this._() +
        '"positions": ' +
        this._project.network.code.getNodePositions();
    }
    script += this.end() + '}';
    return script + '\n';
  }
}
