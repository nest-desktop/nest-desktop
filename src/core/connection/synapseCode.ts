import { Code } from '../code';
// import { Model } from '../model/model';
import { ModelParameter } from '../parameter/modelParameter';
import { Synapse } from './synapse';

export class SynapseCode extends Code {
  private _synapse: Synapse; // parent

  constructor(synapse: Synapse) {
    super();
    this._synapse = synapse;
  }

  /**
   * Write script of synapse specifications.
   */
  specs(): string {
    const specs: string[] = [];
    if (this._synapse.modelId !== 'static_synapse') {
      specs.push(`"model": "${this._synapse.modelId}"`);
    }

    this._synapse.filteredParams.forEach((param: ModelParameter) =>
      specs.push(`"${param.id}": ${param.toCode()}`)
    );

    let script = '';
    if (specs.length > 0) {
      script += ', syn_spec={' + this._();
      script += specs.join(',' + this._());
      script += this.end() + '}';
    }
    return script;
  }
}
