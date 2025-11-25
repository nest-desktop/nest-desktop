// activityChartPanelModelParameter.ts

import { BaseParameter, type IParamState } from "@/helpers/common/parameter";

import { ActivityChartPanelModel } from "./activityChartPanelModel";

export class ActivityChartPanelModelParameter extends BaseParameter {
  public _activityChartPanelModel: ActivityChartPanelModel;

  constructor(activityChartPanelModel: ActivityChartPanelModel) {
    super();

    this._activityChartPanelModel = activityChartPanelModel;
  }

  get activityChartPanelModel(): ActivityChartPanelModel {
    return this._activityChartPanelModel;
  }

  override get parent(): ActivityChartPanelModel {
    return this.activityChartPanelModel;
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
