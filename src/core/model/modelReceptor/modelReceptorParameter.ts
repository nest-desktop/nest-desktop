import { ModelParameter } from '../modelParameter';
import { ModelReceptor } from './modelReceptor';

export class ModelReceptorParameter extends ModelParameter {
  constructor(modelReceptor: ModelReceptor, param: any) {
    super(modelReceptor, param);
  }

  get modelReceptor(): ModelReceptor {
    return this.parent as ModelReceptor;
  }

  /**
   * TODO: Correct this options to get options for input
   * Get options from model receptor component.
   */
  override get options(): ModelReceptorParameter {
    const param: ModelReceptorParameter = this.modelReceptor.params.find(
      (p: ModelReceptorParameter) => p.id === this.id
    );
    return param;
  }

  /**
   * Trigger changes when parameter is changed.
   */
  override paramChanges(): void {
    this.modelReceptor.modelChanges();
  }
}
