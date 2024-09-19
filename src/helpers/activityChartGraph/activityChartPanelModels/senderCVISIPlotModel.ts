// senderCVISIPlotModel.ts

import { TParameter } from '@/types';

import { SpikeActivity } from '../../activity/spikeActivity';
import { currentBackgroundColor } from '../../common/theme';
import { ActivityChartPanel } from '../activityChartPanel';
import { IActivityChartPanelModelData } from '../activityChartPanelModel';
import { ActivityChartPanelModelParameter } from '../activityChartPanelModelParameter';
import { ISpikeTimesPanelModelProps, SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class SenderCVISIPlotModel extends SpikeTimesPanelModel {
  constructor(
    panel: ActivityChartPanel,
    modelProps: ISpikeTimesPanelModelProps = {}
  ) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "senderCVISIPlot";
    this.label = "CV of ISI in each sender";
    this.panel.xAxis = 4;

    this.initParams([
      {
        component: "select",
        id: "plotMode",
        items: ["lines", "lines+markers", "markers", "bar"],
        label: "Plot mode",
        value: "bar",
        handleOnUpdate: (param: TParameter) => {
          const p = param as ActivityChartPanelModelParameter;
          const paramValue = p.value as string;
          p.activityChartPanelModel.params.lineShape.visible =
            paramValue.includes("lines");
        },
      },
      {
        component: "select",
        id: "lineShape",
        items: [
          { title: "linear", value: "linear" },
          { title: "spline", value: "spline" },
          { title: "vertical-horizontal-vertical steps", value: "vhv" },
          { title: "horizontal-vertical-horizontal steps", value: "hvh" },
          { title: "vertical-horizontal steps", value: "vh" },
          { title: "horizontal-vertical steps", value: "hv" },
        ],
        label: "Line shape",
        value: "linear",
        visible: false,
      },
    ]);

    this.updateParams(modelProps.params);
  }

  /**
   * Add data of CV of ISI in each sender for histogram panel.
   * @param activity spike activity object
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    const x: number[] = activity.nodeIds;
    const isi: number[][] = activity.ISI();
    const y: number[] = isi.map((ii: number[]) =>
      ii.length > 1
        ? activity.getStandardDeviation(ii) / activity.getAverage(ii)
        : 0
    );

    const lineShape = this.params.lineShape.value as string;
    const plotMode = this.params.plotMode.value as string;
    const plotType = plotMode === "bar" ? plotMode : "scatter";

    this.data.push({
      activityIdx: activity.idx,
      hoverinfo: "x+y",
      legendgroup: "spikes" + activity.idx,
      line: {
        shape: lineShape,
      },
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: currentBackgroundColor(),
          width: x.length > 100 ? 0 : 1,
        },
      },
      mode: plotMode,
      name: "CV of ISI in each sender in" + activity.recorder.view.label,
      opacity: 0.6,
      showlegend: false,
      type: plotType,
      visible: this.state.visible,
      x,
      y,
    } as IActivityChartPanelModelData);
  }

  /**
   * Update layout label for mean ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.type = this.state.xaxisType;
    this.panel.layout.xaxis.title = "Senders";
    this.panel.layout.yaxis.title = "CV of ISI";
  }
}
