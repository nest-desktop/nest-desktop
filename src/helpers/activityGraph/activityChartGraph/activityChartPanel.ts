// activityChartPanel.ts

import { UnwrapRef, reactive } from "vue";

import { sum } from "../../../utils/array";
import { BaseObj } from "../../common/base";
import { ActivityChartGraph } from "./activityChartGraph";
import { ActivityChartPanelModel, IActivityChartPanelModelProps } from "./activityChartPanelModel";
import { SpikeTimesRasterPlotModel } from "./activityChartPanelModels/spikeTimesRasterPlotModel";

export interface IActivityChartPanelProps {
  model?: IActivityChartPanelModelProps;
}

interface IActivityChartPanelLayoutProps {
  shapes: {
    label?: {
      font: { size: number };
      text: string;
      textposition: string;
    };
    line?: {
      color: string;
      dash: string;
      width: number;
    };
    type: string;
    x0: number;
    x1: number;
    xref?: string;
    y0: number;
    y1: number;
    yref?: string;
  }[];
  xaxis: { anchor?: string; showgrid: boolean; title: { text: string }; type?: string };
  yaxis: {
    domain?: number[];
    height: number;
    showgrid: boolean;
    title: { text: string };
  };
}

interface IActivityChartPanelState {
  visible: boolean;
}

export class ActivityChartPanel extends BaseObj {
  // private static readonly _name = 'ActivityGraphPanel';
  // private _activities: Activity[] = [];
  private _graph: ActivityChartGraph; // parent
  private _layout: IActivityChartPanelLayoutProps = {
    shapes: [],
    xaxis: {
      showgrid: true,
      title: {
        text: "x label",
      },
    },
    yaxis: {
      height: 10,
      showgrid: true,
      title: {
        text: "y label",
      },
    },
  };
  private _model: ActivityChartPanelModel;
  private _state: UnwrapRef<IActivityChartPanelState>;
  private _xAxis = 1;

  constructor(graph: ActivityChartGraph, panelProps: IActivityChartPanelProps = {}) {
    super();

    this._graph = graph;
    this._model = new SpikeTimesRasterPlotModel(this);

    this._state = reactive<IActivityChartPanelState>({
      visible: true,
    });

    this.selectModel(panelProps.model ? panelProps.model.id : "spikeTimesRasterPlot", panelProps.model);
  }

  get graph(): ActivityChartGraph {
    return this._graph;
  }

  get height(): number {
    return this._layout.yaxis.height;
  }

  set height(value: number) {
    this._layout.yaxis.height = value;
  }

  get idx(): number {
    return this.graph.panels.indexOf(this);
  }

  get layout(): IActivityChartPanelLayoutProps {
    return this._layout;
  }

  get model(): ActivityChartPanelModel {
    return this._model;
  }

  get state(): UnwrapRef<IActivityChartPanelState> {
    return this._state;
  }

  get xAxis(): number {
    return this._xAxis;
  }

  set xAxis(value: number) {
    this._xAxis = value;
  }

  get yAxis(): number {
    return this.graph.panelsVisible.indexOf(this) + 1;
  }

  /**
   * Capitalize text.
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Decrease panel height.
   */
  decreaseHeight(): void {
    if (this.height === 1) return;

    this.height -= 1;
    this._graph.update();
  }

  /**
   * Increase panel height.
   */
  increaseHeight(): void {
    this.height += 1;
    this._graph.update();
  }

  /**
   * Remove this panel.
   */
  remove(): void {
    this._graph.removePanel(this);
  }

  /**
   * Select panel model.
   * @param modelId
   * @param modelProps
   */
  selectModel(modelId: string = "spikeTimesRasterPlot", modelProps: IActivityChartPanelModelProps = {}): void {
    if (modelId) {
      const model: IActivityChartPanelModelProps | undefined = this._graph.models.find(
        (modelProps: IActivityChartPanelModelProps) => modelProps.id === modelId,
      );
      if (model) {
        // @ts-expect-error Property 'component' does not exist on type 'IActivityChartPanelModelProps'.
        this._model = new model.component(this, modelProps);
      }
    }
  }

  /**
   * Toggle panel visibility.
   */
  toggleVisible(): void {
    this._state.visible = !this._state.visible;
    this._graph.update();
  }

  /**
   * Serialize for JSON.
   * @return activity chart panel object
   */
  toJSON(): IActivityChartPanelProps {
    return { model: this._model.toJSON() };
  }

  /**
   * Update layout of the panel.
   */
  updateLayout(): void {
    const panels: ActivityChartPanel[] = this.graph.panelsVisible;
    const heights: number[] = panels.map((panel: ActivityChartPanel) => panel.layout.yaxis.height);
    const heightTotal: number = sum(heights);
    heights.reverse();
    const heightCumSum: number[] = heights.map(
      (
        (sum: number) => (value: number) =>
          (sum += value)
      )(0),
    );
    const steps = heightCumSum.map((h: number) => h / heightTotal);
    steps.unshift(0);
    steps.reverse();
    const margin: number = this.xAxis === 1 ? 0.02 : 0.07;
    const domain: number[] = [steps[this.yAxis], steps[this.yAxis - 1] - margin];
    this.layout.yaxis.domain = domain;
    this.layout.xaxis.anchor = "y" + this.yAxis;
  }
}
