// copyModelParameter.ts

import { IParamProps, Parameter } from "@/helpers/common/parameter";
import { ModelParameter } from "@/helpers/model/modelParameter";
import { TModel } from "@/types";

import { NESTCopyModel } from "./copyModel";

export interface INESTCopyModelParamProps extends IParamProps {}

export class NESTCopyModelParameter extends Parameter {
  private _copyModel: NESTCopyModel;

  constructor(model: NESTCopyModel, paramProps: INESTCopyModelParamProps) {
    super(paramProps, { minLevel: 1 });
    this._copyModel = model;
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

  get copyModel(): NESTCopyModel {
    return this._copyModel;
  }

  get visible(): boolean {
    return this.model.paramsVisible.includes(this.id);
  }

  set visible(value: boolean) {
    const isVisible = this.model.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.model.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.model.paramsVisible = this.model.paramsVisible.filter(
        (paramId: string) => paramId !== this.id
      );
    }
  }

  /**
   * Hide this parameter.
   */
  hide(): void {
    this.visible = false;
  }

  /**
   * Observer for parameter changes.
   *
   * @remarks
   * It emits model changes.
   */
  override changes(): void {
    this._copyModel.changes();
  }

  /**
   * Show this parameter.
   */
  show(): void {
    this.visible = true;
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
