// activityChartPanel.ts - 7 anys

import { UnwrapRef, reactive } from "vue";

import {
  ActivityChartPanelModel,
  IActivityChartPanelModelProps,
} from "./activityChartPanelModel";
import { ActivityChartGraph } from "./activityChartGraph";
import { BaseObj } from "../common/base";
import { SpikeTimesRasterPlotModel } from "./activityChartPanelModels/spikeTimesRasterPlotModel";
import { sum } from "../common/array";

export interface IActivityChartPanelProps {
  model?: IActivityChartPanelModelProps;
}

interface IActivityChartPanelLayoutProps {
  xaxis: { anchor?: string; showgrid: boolean; title: string; type?: string };
  yaxis: {
    domain?: number[];
    height: number;
    showgrid: boolean;
    title: string;
  };
}

interface IActivityChartPanelState {
  initialized: boolean;
  visible: boolean;
}

export const plotType = "scattergl"; // TODO: Production did not found webgl (use "scattergl")

export class ActivityChartPanel extends BaseObj {
  // private static readonly _name = 'ActivityGraphPanel';
  // private _activities: Activity[] = [];
  private _graph: ActivityChartGraph; // parent
  private _layout: IActivityChartPanelLayoutProps = {
    xaxis: {
      showgrid: true,
      title: "",
    },
    yaxis: {
      height: 10,
      showgrid: true,
      title: "",
    },
  };
  private _model: ActivityChartPanelModel;
  private _state: UnwrapRef<IActivityChartPanelState>;
  private _xAxis = 1;

  constructor(
    graph: ActivityChartGraph,
    panelProps: IActivityChartPanelProps = {}
  ) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._graph = graph;
    this._model = new SpikeTimesRasterPlotModel(this);

    this._state = reactive({
      initialized: false,
      visible: true,
    });

    this.selectModel(
      panelProps.model ? panelProps.model.id : "spikeTimesRasterPlot"
    );
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

  get params(): any[] {
    return [];
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
    if (this.height === 1) {
      return;
    }
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
  selectModel(
    modelId: string = "spikeTimesRasterPlot",
    modelProps: IActivityChartPanelModelProps = {}
  ): void {
    if (modelId) {
      const model: IActivityChartPanelModelProps | undefined =
        this._graph.models.find(
          (modelProps: IActivityChartPanelModelProps) =>
            modelProps.id === modelId
        );
      if (model) {
        // @ts-ignore - Property 'component' does not exist on type 'IActivityChartPanelModelProps'.
        this._model = new model.component(this, modelProps);
        this._state.initialized = true;
      }
    }

    if (!this._state.initialized) {
      this._model = new SpikeTimesRasterPlotModel(this, modelProps);
      this._state.initialized = true;
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
    const heights: number[] = panels.map(
      (panel: ActivityChartPanel) => panel.layout.yaxis.height
    );
    const heightTotal: number = sum(heights);
    heights.reverse();
    const heightCumSum: number[] = heights.map(
      (
        (sum: number) => (value: number) =>
          (sum += value)
      )(0)
    );
    const steps = heightCumSum.map((h: number) => h / heightTotal);
    steps.unshift(0);
    steps.reverse();
    const margin: number = this.xAxis === 1 ? 0.02 : 0.07;
    const domain: number[] = [
      steps[this.yAxis],
      steps[this.yAxis - 1] - margin,
    ];
    this.layout.yaxis.domain = domain;
    this.layout.xaxis.anchor = "y" + this.yAxis;
  }
}
