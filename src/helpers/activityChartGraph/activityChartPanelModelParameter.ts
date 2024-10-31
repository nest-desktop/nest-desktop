// activityChartPanelModelParameter.ts

import { BaseParameter, IParamProps } from '../common/parameter';
import { ActivityChartPanelModel } from './activityChartPanelModel';

export interface IActivityChartPanelModelParamProps extends IParamProps {}

export class ActivityChartPanelModelParameter extends BaseParameter {
  public _activityChartPanelModel: ActivityChartPanelModel;

  constructor(
    activityChartPanelModel: ActivityChartPanelModel,
    paramProps: IActivityChartPanelModelParamProps
  ) {
    super(paramProps, { minLevel: 3 });

    this._activityChartPanelModel = activityChartPanelModel;
  }

  get activityChartPanelModel(): ActivityChartPanelModel {
    return this._activityChartPanelModel;
  }

  override get parent(): ActivityChartPanelModel {
    return this.activityChartPanelModel;
  }

  /**
   * Serialize for JSON.
   * @return parameter props
   */
  override toJSON(): IActivityChartPanelModelParamProps {
    const paramProps: IActivityChartPanelModelParamProps = {
      id: this.id,
      value: this.value,
    };

    return paramProps;
  }
}
