import * as Plotly from 'plotly.js-dist-min';

import { ActivityChartPanel } from './activityChartPanel';
import { Project } from '../../project/project';

export class ActivityChartGraph {
  private _config: any = {};
  private _data: any[] = [];
  private _imageButtonOptions: any;
  private _layout: any = {};
  private _options: any = {};
  private _panel: ActivityChartPanel;
  private _panels: ActivityChartPanel[] = [];
  private _project: Project;
  private _state: any = {
    dialog: false,
    gd: undefined,
    ref: undefined,
  };

  constructor(project: Project, panels: any = []) {
    this._project = project;
    this._config = {
      autoResize: true,
      autoSizable: true,
      displaylogo: false,
      displayModeBar: true,
      editable: true,
      modeBarButtons: [
        [
          {
            name: 'Download plot',
            // @ts-ignore
            icon: Plotly.Icons.camera,
            click: (gd: any) => {
              this._state.gd = gd;
              this._state.dialog = true;
            },
          },
          // 'toImage',
        ],
        ['zoom2d', 'pan2d'],
        ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
        ['hoverClosestCartesian', 'hoverCompareCartesian'],
      ],
      scrollZoom: true,
    };

    const darkMode: boolean = this._project.app.darkMode;
    this._layout = {
      autosize: true,
      barmode: 'overlay',
      font: {
        color: darkMode ? 'white' : '#121212',
      },
      margin: {
        t: 40,
      },
      paper_bgcolor: darkMode ? '#121212' : 'white',
      plot_bgcolor: darkMode ? '#121212' : 'white',
      title: {
        text: '',
        xref: 'paper',
        x: 0,
      },
    };

    this._panel = new ActivityChartPanel(this);
    this.init(panels);
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

  get state(): any {
    return this._state;
  }

  /**
   * Add panel.
   */
  addPanel(panel: any = { model: 'spikeTimesRasterPlot' }): void {
    this._panels.push(new ActivityChartPanel(this, panel));
  }

  /**
   * Empty graph data.
   */
  empty(): void {
    this._data = [];
  }

  /**
   * Initialize network chart graph.
   */
  init(panels: any[] = []): void {
    this._project.state.checkActivities();

    this._panels = [];
    if (panels.length > 0) {
      panels.forEach((panel: any) => this.addPanel(panel));
    } else {
      if (this._project.state.activities.hasSomeAnalogRecorders) {
        this.addPanel({ model: { id: 'analogSignalPlot' } });
      }
      if (this._project.state.activities.hasSomeSpikeRecorders) {
        this.addPanel({ model: { id: 'spikeTimesRasterPlot' } });
        this.addPanel({ model: { id: 'spikeTimesHistogram' } });
      }
    }

    this.updateVisiblePanelsLayout();

    this.react();
  }

  /**
   * Initialize Plotly events.
   */
  initEvents(): void {
    this._state.ref.on('plotly_legendclick', (plot: any) => {
      setTimeout(() => {
        if (plot != null && plot.data != null) {
          plot.data.forEach((d: any) => {
            const panel = this._panels[d.panelIdx];
            if (d.id === 'threshold') {
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
   * Remove panel.
   */
  removePanel(panel: ActivityChartPanel): void {
    this._panels = this._panels.filter((p: ActivityChartPanel) => p !== panel);
    this.update();
  }

  /**
   * Reset layout of the chart graph.
   */
  resetLayout(): void {
    this._layout = Object.assign({}, this._layout);
  }

  /**
   * Updates chart graph with activities.
   *
   * @remarks
   * It required network activities.
   */
  update(): void {
    this.empty();
    this.resetLayout();

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
   * Gather data for the chart graph
   */
  gatherData(panel: ActivityChartPanel): void {
    panel.model.data.forEach((data: any) => {
      data.dataIdx = this._data.length;
      data.panelIdx = panel.idx;
      data.xaxis = 'x' + panel.xaxis;
      data.yaxis = 'y' + panel.yaxis;
      this._data.push(data);
    });
  }

  /**
   * Update the layout color of the chart graph.
   */
  updateLayoutColor(): void {
    const darkMode: boolean = this._project.app.darkMode;
    this._layout.font.color = darkMode ? 'white' : '#121212';
    this._layout.paper_bgcolor = darkMode ? '#121212' : 'white';
    this._layout.plot_bgcolor = darkMode ? '#121212' : 'white';
  }

  /**
   * Update the layout of the chart graph from each panel.
   */
  updateLayoutPanel(panel: ActivityChartPanel): void {
    this._layout['yaxis' + (panel.yaxis > 1 ? panel.yaxis : '')] =
      panel.layout.yaxis;
    this._layout['xaxis' + (panel.xaxis > 1 ? panel.xaxis : '')] =
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

  /**
   * Create new Plot of the DOM reference.
   */
  newPlot(ref: string): void {
    this._state.ref = ref;
    Plotly.newPlot(
      this._state.ref,
      this._data,
      this._layout,
      this._config
    ).then(() => {
      this.initEvents();
    });
  }

  /**
   * React plots to new updates.
   */
  react(): void {
    if (this._state.ref == null) return;
    Plotly.react(this._state.ref, this._data, this._layout);
  }

  /**
   * Restyle plots with new updates.
   */
  restyle(): void {
    if (this._state.ref == null) return;
    if (this.project.state.activities.hasSomeSpikeRecorders) {
      this.restyleMarkerHeightSpikeTimesRasterPlot();
    }
  }

  /**
   * Restyle marker height of spike times raster plot
   */
  restyleMarkerHeightSpikeTimesRasterPlot() {
    const dataSpikeTimeRasterPlot = this._data.filter(
      (d: any) => d.modelId === 'spikeTimesRasterPlot'
    );

    const markerSizes = dataSpikeTimeRasterPlot.map(
      (d: any) => this._panels[d.panelIdx].model['markerSize']
    );
    const update = {
      'marker.size': markerSizes,
    };

    const dataIndices = dataSpikeTimeRasterPlot.map((d: any) => d.dataIdx);

    Plotly.restyle(this._state.ref, update, dataIndices);
  }

  /**
   * Download image of the activity chart graph.
   */
  downloadImage(options: any): void {
    if (this._state.gd == null) return;
    Plotly.downloadImage(this._state.gd, options);
  }

  /**
   * Serialize for JSON.
   * @return activity chart graph object
   */
  toJSON(): any {
    return {
      panels: this._panels.map((panel: ActivityChartPanel) => panel.toJSON()),
    };
  }
}
