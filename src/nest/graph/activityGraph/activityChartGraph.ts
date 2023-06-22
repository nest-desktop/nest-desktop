// activityChartGraph.ts - 23 anys

import {
  Icons,
  downloadImage,
  newPlot,
  react,
  relayout,
  restyle,
} from "plotly.js-dist-min";

import { darkMode } from "@/utils/theme";

import {
  ActivityChartPanel,
  ActivityChartPanelProps,
} from "./activityChart/activityChartPanel";
import { ActivityChartPanelModel } from "./activityChart/activityChartPanelModel";
import { AnalogSignalHistogramModel } from "./activityChart/activityChartPanelModels/analogSignalHistogramModel";
import { AnalogSignalPlotModel } from "./activityChart/activityChartPanelModels/analogSignalPlotModel";
import { CVISIHistogramModel } from "./activityChart/activityChartPanelModels/CVISIHistogramModel";
import { InterSpikeIntervalHistogramModel } from "./activityChart/activityChartPanelModels/interSpikeIntervalHistogramModel";
import { Project } from "@nest/core/project/project";
import { SenderCVISIPlotModel } from "./activityChart/activityChartPanelModels/senderCVISIPlotModel";
import { SenderMeanISIPlotModel } from "./activityChart/activityChartPanelModels/senderMeanISIPlotModel";
import { SenderSpikeCountPlotModel } from "./activityChart/activityChartPanelModels/senderSpikeCountPlotModel";
import { SpikeCountPlotModel } from "./activityChart/activityChartPanelModels/spikeCountPlotModel";
import { SpikeTimesHistogramModel } from "./activityChart/activityChartPanelModels/spikeTimesHistogramModel";
import { SpikeTimesRasterPlotModel } from "./activityChart/activityChartPanelModels/spikeTimesRasterPlotModel";
import { debounce } from "@/utils/events";

export class ActivityChartGraph {
  private _config: any = {};
  private _data: any[] = [];
  private _imageButtonOptions: any;
  private _layout: any = {};
  private _models: any[] = [
    {
      activityType: "analog",
      component: AnalogSignalPlotModel,
      id: "analogSignalPlot",
      icon: "mdi-chart-bell-curve-cumulative",
      label: "Analog signals",
    },
    {
      activityType: "analog",
      component: AnalogSignalHistogramModel,
      id: "analogSignalHistogram",
      icon: "mdi-chart-bar",
      label: "analog signals",
    },
    {
      activityType: "spike",
      component: SpikeTimesRasterPlotModel,
      id: "spikeTimesRasterPlot",
      icon: "mdi-chart-scatter-plot",
      label: "Spike times",
    },
    {
      activityType: "spike",
      component: SpikeTimesHistogramModel,
      id: "spikeTimesHistogram",
      icon: "mdi-chart-bar",
      label: "Spike times",
    },
    {
      activityType: "spike",
      component: SpikeCountPlotModel,
      id: "spikeCountPlot",
      icon: "mdi-chart-bell-curve-cumulative",
      label: "Spike count",
    },
    {
      activityType: "spike",
      component: InterSpikeIntervalHistogramModel,
      id: "interSpikeIntervalHistogram",
      icon: "mdi-chart-bar",
      label: "Inter-spike interval",
    },
    {
      activityType: "spike",
      component: CVISIHistogramModel,
      id: "CVISIHistogram",
      icon: "mdi-chart-bar",
      label: "CV of ISI",
    },
    {
      activityType: "spike",
      component: SenderSpikeCountPlotModel,
      id: "senderSpikeCountPlot",
      icon: "mdi-chart-bell-curve-cumulative",
      label: "Spike count in each sender",
    },
    {
      activityType: "spike",
      component: SenderMeanISIPlotModel,
      id: "senderMeanISIPlot",
      icon: "mdi-chart-bell-curve-cumulative",
      label: "Mean ISI in each sender",
    },
    {
      activityType: "spike",
      component: SenderCVISIPlotModel,
      id: "senderCVISIPlot",
      icon: "mdi-chart-bell-curve-cumulative",
      label: "CV ISI in each sender",
    },
  ];
  private _options: any = {};
  private _panel: ActivityChartPanel;
  private _panels: ActivityChartPanel[] = [];
  private _project: Project;
  private _resizeObserver: ResizeObserver;
  private _state: any = {
    dialog: false,
    gd: undefined,
    ref: undefined,
  };

  constructor(project: Project, panels: ActivityChartPanelProps[] = []) {
    this._project = project;
    this._config = {
      displaylogo: false,
      displayModeBar: true,
      responsive: true,
      editable: true,
      modeBarButtons: [
        [
          {
            name: "Download plot",
            // @ts-ignore
            icon: Icons.camera,
            click: (gd: any) => {
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

    this._layout = {
      autosize: true,
      barmode: "overlay",
      font: {
        color: darkMode() ? "white" : "#121212",
      },
      margin: {
        t: 40,
      },
      paper_bgcolor: darkMode() ? "#121212" : "white",
      plot_bgcolor: darkMode() ? "#121212" : "white",
      title: {
        text: "",
        xref: "paper",
        x: 0,
      },
    };

    this._panel = new ActivityChartPanel(this);
    this.init(panels);

    this._resizeObserver = new ResizeObserver(
      debounce(() => {
        this.relayout();
      })
    );
  }

  get data(): any[] {
    return this._data;
  }

  get currenttime(): number {
    const simulationState = this._project.simulation.state;
    return simulationState.timeInfo.current > 0
      ? simulationState.timeInfo.current
      : simulationState.biologicalTime;
  }

  get endtime(): number {
    return this._project.simulation.state.biologicalTime;
  }

  get imageButtonOptions(): any {
    return this._imageButtonOptions;
  }

  get layout(): any {
    return this._layout;
  }

  get models(): ActivityChartPanelModel[] {
    return this._models;
  }

  get modelsAnalog(): ActivityChartPanelModel[] {
    return this._models.filter(
      (model: ActivityChartPanelModel) => model.activityType === "analog"
    );
  }

  get modelsSpike(): ActivityChartPanelModel[] {
    return this._models.filter(
      (model: ActivityChartPanelModel) =>
        model.activityType === "spike" &&
        "source" in model &&
        model.source != "elephant"
    );
  }

  get options(): any {
    return this._options;
  }

  get panel(): ActivityChartPanel {
    return this._panel;
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

  get project(): Project {
    return this._project;
  }

  get resizeObserver(): ResizeObserver {
    return this._resizeObserver;
  }

  get state(): any {
    return this._state;
  }

  /**
   * Add panel.
   */
  addPanel(panel: any = { model: "spikeTimesRasterPlot" }): void {
    this._panels.push(new ActivityChartPanel(this, panel));
  }

  /**
   * Download image of the activity chart graph.
   */
  downloadImage(options: any): void {
    if (this._state.gd == null) return;
    downloadImage(this._state.gd, options);
  }

  /**
   * Empty graph data.
   */
  empty(): void {
    this._data = [];
  }

  /**
   * Gather data for the chart graph
   */
  gatherData(panel: ActivityChartPanel): void {
    panel.model.data.forEach((data: any) => {
      data.dataIdx = this._data.length;
      data.panelIdx = panel.idx;
      data.xaxis = "x" + panel.xaxis;
      data.yaxis = "y" + panel.yaxis;
      this._data.push(data);
    });
  }

  /**
   * Initialize network chart graph.
   */
  init(panels: any[] = []): void {
    this._project.activities.checkActivities();

    this._panels = [];
    if (panels.length > 0) {
      panels.forEach((panel: any) => this.addPanel(panel));
    } else {
      if (this._project.activities.state.hasSomeAnalogRecorders) {
        this.addPanel({ model: { id: "analogSignalPlot" } });
      }
      if (this._project.activities.state.hasSomeSpikeRecorders) {
        this.addPanel({ model: { id: "spikeTimesRasterPlot" } });
        this.addPanel({ model: { id: "spikeTimesHistogram" } });
      }
    }

    this.updateVisiblePanelsLayout();

    this.react();
  }

  /**
   * Initialize Plotly events.
   */
  initEvents(): void {
    this._state.ref.on("plotly_legendclick", (plot: any) => {
      setTimeout(() => {
        if (plot != null && plot.data != null) {
          plot.data.forEach((d: any) => {
            const panel = this._panels[d.panelIdx];
            if (d.id === "threshold") {
              panel.model.state.visibleThreshold = d.visible;
            } else {
              panel.model.state.visible = d.visible;
            }
          });
        }
      }, 1000);
    });
  }

  /**
   * Initialize panels.
   */
  initPanels(): void {
    this._panels.forEach((panel: ActivityChartPanel) => panel.model.init());
  }

  /**
   * Create new Plot of the DOM reference.
   */
  newPlot(ref: string): void {
    this._state.ref = ref;
    newPlot(this._state.ref, this._data, this._layout, this._config).then(
      () => {
        this.initEvents();
      }
    );
  }

  /**
   * React plots to new updates.
   */
  react(): void {
    if (this._state.ref == null) return;
    react(this._state.ref, this._data, this._layout);
  }

  relayout(): void {
    const dark = darkMode();
    this._layout.font.color = dark ? "white" : "#121212";
    this._layout.paper_bgcolor = dark ? "#121212" : "white";
    this._layout.plot_bgcolor = dark ? "#121212" : "white";
    relayout(this._state.ref, this._layout);
  }

  /**
   * Remove panel.
   */
  removePanel(panel: ActivityChartPanel): void {
    this._panels = this._panels.filter((p: ActivityChartPanel) => p !== panel);
    this.update();
  }

  /**
   * Restyle plots with new updates.
   */
  restyle(): void {
    if (this._state.ref == null) return;
    if (this.project.activities.state.hasSomeSpikeRecorders) {
      this.restyleMarkerHeightSpikeTimesRasterPlot();
    }
  }

  /**
   * Restyle marker height of spike times raster plot
   */
  restyleMarkerHeightSpikeTimesRasterPlot() {
    const dataSpikeTimeRasterPlot = this._data.filter(
      (d: any) => d.modelId === "spikeTimesRasterPlot"
    );

    const markerSizes = dataSpikeTimeRasterPlot.map(
      // @ts-ignore
      (d: any) => this._panels[d.panelIdx].model.markerSize
    );
    const update = {
      "marker.size": markerSizes,
    };

    const dataIndices = dataSpikeTimeRasterPlot.map((d: any) => d.dataIdx);

    restyle(this._state.ref, update, dataIndices);
  }

  /**
   * Serialize for JSON.
   * @return activity chart graph object
   */
  toJSON(): ActivityChartPanelProps[] {
    return this._panels.map((panel: ActivityChartPanel) => panel.toJSON());
  }

  /**
   * Updates chart graph with activities.
   *
   * @remarks
   * It required network activities.
   */
  update(): void {
    console.log("Update activity chart graph");
    this.empty();

    this.updateVisiblePanelsLayout();
    this.updatePanelModels();
    this.updateLayoutColor();

    this.panelsVisible.forEach((panel: ActivityChartPanel) => {
      this.gatherData(panel);
      this.updateLayoutPanel(panel);
    });

    this.react();
    this.restyle();
  }

  /**
   * Update the layout color of the chart graph.
   */
  updateLayoutColor(): void {
    this._layout.font.color = darkMode() ? "white" : "#121212";
    this._layout.paper_bgcolor = darkMode() ? "#121212" : "white";
    this._layout.plot_bgcolor = darkMode() ? "#121212" : "white";
  }

  /**
   * Update the layout of the chart graph from each panel.
   */
  updateLayoutPanel(panel: ActivityChartPanel): void {
    this._layout["yaxis" + (panel.yaxis > 1 ? panel.yaxis : "")] =
      panel.layout.yaxis;
    this._layout["xaxis" + (panel.xaxis > 1 ? panel.xaxis : "")] =
      panel.layout.xaxis;
  }

  /**
   * Update panel models.
   */
  updatePanelModels(): void {
    this._panels.forEach((panel: ActivityChartPanel) => panel.model.update());
  }

  /**
   * Update records color.
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
      panel.updatePanelLayout()
    );
  }
}
