import { Code } from '../code';
import { Model } from './model';
import { ModelParameter } from '../parameter/modelParameter';

export class ModelCode extends Code {
  private _model: Model;

  constructor(model: Model) {
    super();
    this._model = model;
  }

  /**
   * Write script to copy model.
   */
  copyModel(): string {
    let script = '';
    script += `nest.CopyModel("${this._model.existing}", "${this._model.id}"`;
    script += this.modelParams();
    script += ')';
    return script + '\n';
  }

  /**
   * Write script for model parameters.
   */
  modelParams(): string {
    let script = '';
    if (this._model.params == undefined || this._model.params.length === 0) {
      return script;
    }
    const paramsList: string[] = [];
    this._model.params
      .filter((param: ModelParameter) => param.visible)
      .map((param: ModelParameter) => {
        if (param.id === 'record_from') {
          paramsList.push(
            this._() + `"${param.id}": [${param.value.join(',')}]`
          );
        } else {
          paramsList.push(this._() + `"${param.id}": ${param.value}`);
        }
      });
    if (paramsList.length > 0) {
      script += ', params={';
      script += paramsList.join(',');
      script += this.end() + '}';
    }
    return script;
  }
}
