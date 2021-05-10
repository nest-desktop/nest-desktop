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
  synSpec(): string {
    const synSpecList: string[] = [];
    if (this._synapse.modelId !== 'static_synapse') {
      synSpecList.push(`"model": "${this._synapse.modelId}"`);
    }

    this._synapse.filteredParams.forEach((param: ModelParameter) =>
      synSpecList.push(`"${param.id}": ${param.toCode()}`)
    );

    let script = '';
    if (synSpecList.length > 0) {
      script += ', syn_spec={' + this._();
      script += synSpecList.join(',' + this._());
      script += this.end() + '}';
    }
    return script;
  }
}
