import { Code } from '../code';
import { Model } from '../model/model';
import { Parameter } from '../parameter';
import { Synapse } from './synapse';


export class SynapseCode extends Code {
  private _synapse: Synapse;                 // parent

  constructor(synapse: Synapse) {
    super();
    this._synapse = synapse;
  }

  synSpec(): string {
    const synSpecList: string[] = [];
    if (this._synapse.modelId !== 'static_synapse') {
      synSpecList.push(this._() + `"model": "${this._synapse.modelId}"`);
    }
    this._synapse.params
      .filter((param: Parameter) => param.visible)
      .forEach((param: Parameter) => synSpecList.push(
        this._() + `"${param.id}": ${this.format(param.value)}`
      ));

    let script = '';
    if (synSpecList.length > 0) {
      script += ', syn_spec={';
      script += synSpecList.join(',');
      script += this.end() + '}';
    }
    return script;
  }

}
