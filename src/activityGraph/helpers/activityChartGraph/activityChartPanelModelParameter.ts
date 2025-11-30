// activityChartPanelModelParameter.ts

import { BaseParameter, type IParamState } from "@/parameter";

export class ActivityChartPanelModelParameter<TParent = unknown> extends BaseParameter<TParent> {
  get activityChartPanelModel(): TParent {
    return this.parent;
  }

  /**
   * Save parameter of activity chart panel model to state.
   * @return parameter state
   */
  override save(): IParamState {
    const paramState: IParamState = {
      id: this.id,
      value: this.value,
    };

    return paramState;
  }
}
