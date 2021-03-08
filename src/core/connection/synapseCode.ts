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

  synSpec(): string {
    const synSpecList: string[] = [];
    if (this._synapse.modelId !== 'static_synapse') {
      synSpecList.push(this._() + `"model": "${this._synapse.modelId}"`);
    }
    this._synapse.params
      .filter((param: ModelParameter) => param.visible)
      .forEach((param: ModelParameter) => {
        if (!param.isRandom()) {
          synSpecList.push(
            this._() + `"${param.id}": ${this.format(param.value)}`
          );
        } else {
          const specs: string = param.specs
            .map(spec => this.format(spec.value))
            .join(', ');
          if (!param.type.startsWith('spatial')) {
            synSpecList.push(
              this._() + `"${param.id}": nest.${param.type}(${specs})`
            );
          } else if (param.type === 'spatial.distance') {
            let value = `nest.${param.type}`;
            if (param.specs[0].value !== 1) {
              value += ` * ${param.specs[0].value}`;
            }
            if (param.specs[1].value !== 0) {
              value += ` + ${param.specs[1].value}`;
            }
            synSpecList.push(this._() + `"${param.id}": ${value}`);
          } else {
            synSpecList.push(
              this._() +
                `"${param.id}": nest.${param.type}(nest.spatial.distance, ${specs})`
            );
          }
        }
      });

    let script = '';
    if (synSpecList.length > 0) {
      script += ', syn_spec={';
      script += synSpecList.join(',');
      script += this.end() + '}';
    }
    return script;
  }
}
