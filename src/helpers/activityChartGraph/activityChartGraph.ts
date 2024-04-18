// activityChartGraph.ts

import { UnwrapRef, nextTick, reactive } from "vue";
import Plotly from "plotly.js-dist-min";
// @ts-ignore - Module '"plotly.js-dist-min"' has no exported member 'Partial'.
import { Partial } from "plotly.js-dist-min";

import {
  ActivityChartPanel,
  IActivityChartPanelProps,
} from "./activityChartPanel";
import { AnalogSignalHistogramModel } from "./activityChartPanelModels/analogSignalHistogramModel";
import { AnalogSignalPlotModel } from "./activityChartPanelModels/analogSignalPlotModel";
import { BaseObj } from "../common/base";
import { CVISIHistogramModel } from "./activityChartPanelModels/CVISIHistogramModel";
import { InterSpikeIntervalHistogramModel } from "./activityChartPanelModels/interSpikeIntervalHistogramModel";
import { SenderCVISIPlotModel } from "./activityChartPanelModels/senderCVISIPlotModel";
import { SenderMeanISIPlotModel } from "./activityChartPanelModels/senderMeanISIPlotModel";
import { SenderSpikeCountPlotModel } from "./activityChartPanelModels/senderSpikeCountPlotModel";
import { SpikeCountPlotModel } from "./activityChartPanelModels/spikeCountPlotModel";
import { SpikeTimesHistogramModel } from "./activityChartPanelModels/spikeTimesHistogramModel";
import { SpikeTimesRasterPlotModel } from "./activityChartPanelModels/spikeTimesRasterPlotModel";
import { TProject } from "@/types/projectTypes";
import { currentBackgroundColor, currentColor } from "../common/theme";
// import { SpikeActivity } from "../activity/spikeActivity";
// import { sum } from "../common/array";

export interface IActivityChartPanelModelProps {
  activityType: string;
  component: Object;
  id: string;
  icon: string;
  label: string;
}

interface IActivityChartGraphState {
  dialog: Boolean;
  gd?: Plotly.RootOrData;
  ref?: Plotly.Root;
}

const models: IActivityChartPanelModelProps[] = [
  {
    activityType: "analog",
    component: AnalogSignalPlotModel,
    id: "analogSignalPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "Analog signals",
  },
  {
    activityType: "analog",
    component: AnalogSignalHistogramModel,
    id: "analogSignalHistogram",
    icon: "mdi:mdi-chart-bar",
    label: "analog signals",
  },
  {
    activityType: "spike",
    component: SpikeTimesRasterPlotModel,
    id: "spikeTimesRasterPlot",
    icon: "mdi:mdi-chart-scatter-plot",
    label: "Spike times",
  },
  {
    activityType: "spike",
    component: SpikeTimesHistogramModel,
    id: "spikeTimesHistogram",
    icon: "mdi:mdi-chart-bar",
    label: "Spike times",
  },
  {
    activityType: "spike",
    component: SpikeCountPlotModel,
    id: "spikeCountPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "Spike count",
  },
  {
    activityType: "spike",
    component: InterSpikeIntervalHistogramModel,
    id: "interSpikeIntervalHistogram",
    icon: "mdi:mdi-chart-bar",
    label: "Inter-spike interval",
  },
  {
    activityType: "spike",
    component: CVISIHistogramModel,
    id: "CVISIHistogram",
    icon: "mdi:mdi-chart-bar",
    label: "CV of ISI",
  },
  {
    activityType: "spike",
    component: SenderSpikeCountPlotModel,
    id: "senderSpikeCountPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "Spike count in each sender",
  },
  {
    activityType: "spike",
    component: SenderMeanISIPlotModel,
    id: "senderMeanISIPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "Mean ISI in each sender",
  },
  {
    activityType: "spike",
    component: SenderCVISIPlotModel,
    id: "senderCVISIPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "CV ISI in each sender",
  },
];

export class ActivityChartGraph extends BaseObj {
  private _plotConfig: Partial<Plotly.Config> = {};
  private _plotData: Plotly.Data[] = [];
  private _plotLayout: Partial<Plotly.Layout> = {};
  private _models: IActivityChartPanelModelProps[] = models;
  private _panels: ActivityChartPanel[] = [];
  private _project: TProject;
  private _state: UnwrapRef<IActivityChartGraphState>;

  constructor(project: TProject, panelsProps?: IActivityChartPanelProps[]) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._project = project;
    this._plotConfig = {
      displaylogo: false,
      displayModeBar: true,
      responsive: true,
      editable: true,
      modeBarButtons: [
        [
          {
            name: "Download plot",
            icon: Plotly.Icons.camera,
            click: (gd: Plotly.RootOrData) => {
              this._state.gd = gd;
              this._state.dialog = true;
            },
          },
          // 'toImage',
        ],
        ["zoom2d", "pan2d"],
        ["zoomIn2d", "zoomOut2d", "autoScale2d", "resetScale2d"],
        ["hoverClosestCartesian", "hoverCompareCartesian", "toggleSpikelines"],
      ],
      scrollZoom: true,
    };

    this._plotLayout = {
      autosize: true,
      barmode: "overlay",
      font: {
        color: currentColor(),
      },
      margin: {
        t: 40,
      },
      paper_bgcolor: currentBackgroundColor(),
      plot_bgcolor: currentBackgroundColor(),
      title: {
        text: "",
        xref: "paper",
        x: 0,
      },
    };

    this._state = reactive({
      dialog: false,
    });

    this.addPanels(panelsProps);
  }

  get currentTime(): number {
    const simulationState = this._project.simulation.state;
    return simulationState.timeInfo.current > 0
      ? simulationState.timeInfo.current
      : simulationState.biologicalTime;
  }

  get endTime(): number {
    return this._project.simulation.state.biologicalTime;
  }

  get models(): IActivityChartPanelModelProps[] {
    return this._models;
  }

  get modelsAnalog(): IActivityChartPanelModelProps[] {
    return this._models.filter(
      (model: IActivityChartPanelModelProps) => model.activityType === "analog"
    );
  }

  get modelsSpike(): IActivityChartPanelModelProps[] {
    return this._models.filter(
      (model: IActivityChartPanelModelProps) => model.activityType === "spike"
    );
  }

  get panels(): ActivityChartPanel[] {
    return this._panels;
  }

  set panels(values: ActivityChartPanel[]) {
    this._panels = values;
    this.update();
  }

  get panelsVisible(): ActivityChartPanel[] {
    return this._panels.filter(
      (panel: ActivityChartPanel) => panel.state.visible
    );
  }

  get plotData(): Plotly.Data[] {
    return this._plotData;
  }

  get plotLayout(): Partial<Plotly.Layout> {
    return this._plotLayout;
  }

  get project(): TProject {
    return this._project;
  }

  get state(): UnwrapRef<IActivityChartGraphState> {
    return this._state;
  }

  /**
   * Add panel.
   * @param panelProps
   */
  addPanel(
    panelProps: IActivityChartPanelProps = {
      model: { id: "spikeTimesRasterPlot" },
    }
  ): void {
    this.logger.trace("add panel:", panelProps.model?.id);
    this._panels.push(new ActivityChartPanel(this, panelProps));
  }

  /**
   * Add panels.
   * @param panelsProps
   */
  addPanels(panelsProps?: IActivityChartPanelProps[]): void {
    this.logger.trace("add panels");

    if (panelsProps != undefined && panelsProps.length > 0) {
      panelsProps.forEach((panelProps: IActivityChartPanelProps) =>
        this.addPanel(panelProps)
      );
    } else {
      if (this._project.activities.state.hasSomeAnalogRecorders) {
        this.addPanel({ model: { id: "analogSignalPlot" } });
      }
      if (this._project.activities.state.hasSomeSpikeRecorders) {
        this.addPanel({ model: { id: "spikeTimesRasterPlot" } });
        this.addPanel({ model: { id: "spikeTimesHistogram" } });
      }
    }
  }

  /**
   * Download image of the activity chart graph.
   * @param options
   */
  downloadImage(options: Plotly.DownloadImgopts): void {
    this.logger.trace("download Image:", options);
    if (!this._state.gd) return;

    Plotly.downloadImage(this._state.gd, options);
  }

  /**
   * Empty graph data.
   */
  empty(): void {
    this._plotData = [];
  }

  /**
   * Gather data for the chart graph.
   * @param panel
   */
  gatherData(panel: ActivityChartPanel): void {
    panel.model.data.forEach((data: Partial<Plotly.Data>) => {
      data.dataIdx = this._plotData.length;
      data.panelIdx = panel.idx;
      data.xaxis = "x" + panel.xAxis;
      data.yaxis = "y" + panel.yAxis;
      // data.yaxis = "y" + index;
      this._plotData.push(data);
    });
  }

  /**
   * Initialize network chart graph.
   */
  init(): void {
    this.logger.trace("init");

    this.updateVisiblePanelsLayout();

    this.initPanelModels();

    this.react();
  }

  /**
   * Initialize Plotly events.
   */
  initEvents(): void {
    this.logger.trace("init events");
    if (!this._state.ref) return;

    // @ts-ignore - Property 'on' does not exist on type 'Root'. Property 'on' does not exist on type 'string'.
    this._state.ref.on("plotly_legendclick", (plot: any) => {
      nextTick(() => {
        if (plot && plot.data) {
          plot.data.forEach((d: Partial<Plotly.Data>) => {
            const panel = this._panels[d.panelIdx];
            if (d.id === "threshold") {
              panel.model.state.visibleThreshold = d.visible;
            } else {
              panel.model.state.visible = d.visible;
            }
          });
        }
      });
    });
  }

  /**
   * Initialize panel models.
   */
  initPanelModels(): void {
    this._panels.forEach((panel: ActivityChartPanel) => panel.model.init());
  }

  /**
   * Create new Plot of the DOM reference.
   * @param ref
   */
  newPlot(ref: Plotly.Root): void {
    this.logger.trace("new plot");
    this._state.ref = ref;

    Plotly.newPlot(
      this._state.ref,
      this._plotData,
      this._plotLayout,
      this._plotConfig
    ).then(() => {
      this.initEvents();
    });
  }

  /**
   * React plots to new updates.
   */
  react(): void {
    if (!this._state.ref) return;
    this.logger.trace("react");
    Plotly.react(this._state.ref, this._plotData, this._plotLayout);
  }

  /**
   * Relayout plots to new theme.
   */
  relayout(): void {
    if (!this._state.ref) return;
    this.logger.trace("relayout");
    this.updateThemeColor();
    Plotly.relayout(this._state.ref, this._plotLayout);
  }

  /**
   * Remove panel.
   * @param panel
   */
  removePanel(panel: ActivityChartPanel): void {
    this._panels = this._panels.filter((p: ActivityChartPanel) => p !== panel);
    this.update();
  }

  /**
   * Restyle plots with new updates.
   */
  restyle(): void {
    if (!this._state.ref) return;
    this.logger.trace("restyle");

    if (this.project.activities.state.hasSomeSpikeRecorders) {
      this.restyleMarkerHeightSpikeTimesRasterPlot();
    }
  }

  /**
   * Restyle marker height of spike times raster plot
   */
  restyleMarkerHeightSpikeTimesRasterPlot(): void {
    if (!this._state.ref) return;

    const dataSpikeTimeRasterPlot = this._plotData.filter(
      (d: Partial<Plotly.Data>) => d.modelId === "spikeTimesRasterPlot"
    );

    const markerSizes = dataSpikeTimeRasterPlot.map(
      (d: Partial<Plotly.Data>) => {
        const model = this._panels[d.panelIdx]
          .model as SpikeTimesRasterPlotModel;
        return model.markerSize;
      }
    );
    const update = {
      "marker.size": markerSizes,
    };

    const dataIndices = dataSpikeTimeRasterPlot.map(
      (d: Partial<Plotly.Data>) => d.dataIdx
    );

    Plotly.restyle(this._state.ref, update, dataIndices);
  }

  /**
   * Serialize for JSON.
   * @return activity chart graph object
   */
  toJSON(): IActivityChartPanelProps[] {
    return this._panels.map((panel: ActivityChartPanel) => panel.toJSON());
  }

  /**
   * Updates chart graph with activities.
   *
   * @remarks
   * It required network activities.
   */
  update(): void {
    if (!this._state.ref) return;
    this.logger.trace("update");
    this.empty();

    this._project.activities.checkActivities();

    this.updateVisiblePanelsLayout();
    this.updatePanelModels();
    // this.updateLayoutColor();

    this.updateVisiblePanelsData();

    this.react();
    this.restyle();
  }

  /**
   * Update activities in panel models.
   */
  updateActivities(): void {
    this.panelsVisible.forEach((panel: ActivityChartPanel) => {
      panel.model.updateActivities();
      panel.model.initAnalogRecords();
    });
  }

  /**
   * Update the theme color of the chart graph.
   */
  updateThemeColor(): void {
    this._panels.forEach((panel: ActivityChartPanel) =>
      panel.model.updateBackgroundColor()
    );

    this._plotLayout.font.color = currentColor();
    this._plotLayout.paper_bgcolor = currentBackgroundColor();
    this._plotLayout.plot_bgcolor = currentBackgroundColor();
  }

  /**
   * Update the layout of the chart graph from each panel.
   * @param panel
   */
  updateLayoutPanel(panel: ActivityChartPanel): void {
    this._plotLayout["yaxis" + (panel.yAxis > 1 ? panel.yAxis : "")] =
      panel.layout.yaxis;
    this._plotLayout["xaxis" + (panel.xAxis > 1 ? panel.xAxis : "")] =
      panel.layout.xaxis;
  }

  /**
   * Update data in visible panels.
   */
  updateVisiblePanelsData(): void {
    this.panelsVisible.forEach((panel: ActivityChartPanel) => {
      panel.model.activities; // TODO: check if it is required.
      this.gatherData(panel);
      this.updateLayoutPanel(panel);
    });
  }

  /**
   * Update panel models.
   */
  updatePanelModels(): void {
    this._panels.forEach((panel: ActivityChartPanel) => panel.model.update());
  }

  /**
   * Update color of records.
   *
   * @remarks
   * It renders new updates in activity plots.
   */
  updateRecordsColor(): void {
    this._panels.forEach((panel: ActivityChartPanel) =>
      panel.model.updateRecordsColor()
    );
    this.react();
  }

  /**
   * Update visible panel layout of the chart graph.
   */
  updateVisiblePanelsLayout(): void {
    this.panelsVisible.forEach((panel: ActivityChartPanel) =>
      panel.updateLayout()
    );
  }
}
