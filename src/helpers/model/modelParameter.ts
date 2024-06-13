// modelParameter.ts

import { TModel } from "@/types";

import { IParamProps, Parameter } from "../common/parameter";

export interface IModelParamProps extends IParamProps {}

export class ModelParameter extends Parameter {
  private _model: TModel;

  constructor(model: TModel, paramProps: IModelParamProps) {
    super(paramProps, { minLevel: 3 });
    this._model = model;
  }

  get model(): TModel {
    return this._model;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
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
    this._model.changes();
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
