// modelParameter.ts

import { Parameter, IParamProps } from "../common/parameter";
import { TModel } from "@/types/modelTypes";

export interface IModelParamProps extends IParamProps {}

export class ModelParameter extends Parameter {
  private _parent: TModel;

  constructor(model: TModel, paramProps: IModelParamProps) {
    super(paramProps, { minLevel: 3 });
    this._parent = model;
  }

  get model(): TModel {
    return this._parent as TModel;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }

  get parent(): TModel {
    return this._parent;
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
   * Observer for parameter changes.
   *
   * @remarks
   * It emits model changes.
   */
  override changes(): void {
    this._parent.changes();
  }

  /**
   * Serialize for JSON.
   * @return model parameter object
   */
  override toJSON(): IModelParamProps {
    const paramProps: IModelParamProps = {
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
