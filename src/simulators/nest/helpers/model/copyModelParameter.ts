// copyModelParameter.ts

import { BaseParameter, IParamProps } from '@/helpers/common/parameter';
import { ModelParameter } from '@/helpers/model/modelParameter';
import { TModel } from '@/types';

import { NESTCopyModel } from './copyModel';

export interface INESTCopyModelParamProps extends IParamProps {}

export class NESTCopyModelParameter extends BaseParameter {
  private _copyModel: NESTCopyModel;

  constructor(model: NESTCopyModel, paramProps: INESTCopyModelParamProps) {
    super(paramProps, { minLevel: 3 });
    this._copyModel = model;
  }

  get copyModel(): NESTCopyModel {
    return this._copyModel;
  }

  get model(): TModel {
    return this._copyModel.model as TModel;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }

  override get parent(): NESTCopyModel {
    return this.copyModel;
  }

  /**
   * Serialize for JSON.
   * @return model parameter object
   */
  override toJSON(): INESTCopyModelParamProps {
    const paramProps: INESTCopyModelParamProps = {
      id: this.id,
      component: this.component,
      label: this.label,
      unit: this.unit,
      value: this.value,
      // visible: this.visible as boolean,
    };

    if (this.component === "valueSlider") {
      paramProps.min = this.min;
      paramProps.max = this.max;
      paramProps.step = this.step;
    } else if (this.component === "tickSlider") {
      paramProps.ticks = this.ticks;
    }

    // Add rules for validation if existed.
    if (this.rules.length > 0) {
      paramProps.rules = this.rules;
    }

    return paramProps;
  }
}
