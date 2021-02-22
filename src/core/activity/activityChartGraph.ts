import * as PlotlyJS from 'plotly.js-dist';

import { Project } from '../project/project';

import { ActivityGraphPanel } from './plotPanels/activityGraphPanel';
import { AnalogSignalHistogramPanel } from './plotPanels/analogSignalHistogramPanel';
import { NeuronAnalogSignalPlotPanel } from './plotPanels/neuronAnalogSignalPlotPanel';
import { InputAnalogSignalPlotPanel } from './plotPanels/inputAnalogSignalPlotPanel';
import { SpikeTimesRasterPlotPanel } from './plotPanels/spikeTimesRasterPlotPanel';
import { SpikeTimesHistogramPanel } from './plotPanels/spikeTimesHistogramPanel';
import { SpikeSendersHistogramPanel } from './plotPanels/spikeSendersHistogramPanel';
import { InterSpikeIntervalHistogramPanel } from './plotPanels/interSpikeIntervalHistogramPanel';
import { CVISIHistogramPanel } from './plotPanels/CVISIHistogramPanel';

export class ActivityChartGraph {
  private _options: any = {};
  private _data: any[] = [];
  private _imageButtonOptions: any;
  private _layout: any = {};
  private _panels: ActivityGraphPanel[] = [];
  private _panelsAll: ActivityGraphPanel[] = [];
  private _project: Project;
  private _registerPanels: any[] = [];

  constructor(project: Project, registerPanels: any[] = []) {
    this._project = project;
    this._options = {
      toImageButtonOptions: {
        filename: 'nest-desktop',
        format: 'svg', // png, svg, jpeg, webp
        height: 600,
        scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
        width: 800,
      },
      // showLink: true,

      // modeBarButtons: [
      // "zoom2d", "pan2d", "select2d", "lasso2d", "zoomIn2d", "zoomOut2d", "autoScale2d", "resetScale2d",
      // "hoverClosestCartesian", "hoverCompareCartesian", "zoom3d", "pan3d", "resetCameraDefault3d",
      // "resetCameraLastSave3d", "hoverClosest3d", "orbitRotation", "tableRotation", "zoomInGeo",
      // "zoomOutGeo", "resetGeo", "hoverClosestGeo", "toImage", "sendDataToCloud", "hoverClosestGl2d",
      // "hoverClosestPie", "toggleHover", "resetViews", "toggleSpikelines", "resetViewMapbox"
      // [
      //   {
      //     name: 'graph-reload',
      //     title: 'Reload image graph',
      //     icon: PlotlyJS.Icons.undo,
      //     click: () => {
      //       this.init();
      //     },
      //   },
      // ],
      // [this.imageButtonOptions, "toImage"],
      // ['toImage'],
      // ['zoom2d', 'pan2d'],
      // ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
      // ['hoverClosestCartesian', 'hoverCompareCartesian'],
      // ],
    };

    this._imageButtonOptions = {
      name: 'image_settings',
      title: 'Edit image settings',
      icon: PlotlyJS.Icons.pencil,
      click: (_: any) => {},
    };

    this._layout = {
      margin: {
        t: 40,
      },
      title: {
        text: '',
        xref: 'paper',
        x: 0,
      },
    };

    this._registerPanels = [
      (graph: ActivityChartGraph) => new InputAnalogSignalPlotPanel(graph),
      (graph: ActivityChartGraph) => new NeuronAnalogSignalPlotPanel(graph),
      (graph: ActivityChartGraph) => new AnalogSignalHistogramPanel(graph),
      (graph: ActivityChartGraph) => new SpikeTimesRasterPlotPanel(graph),
      (graph: ActivityChartGraph) => new SpikeTimesHistogramPanel(graph),
      (graph: ActivityChartGraph) => new SpikeSendersHistogramPanel(graph),
      (graph: ActivityChartGraph) =>
        new InterSpikeIntervalHistogramPanel(graph),
      (graph: ActivityChartGraph) => new CVISIHistogramPanel(graph),
    ];

    this.init(registerPanels);
  }

  get options(): any {
    return this._options;
  }

  get data(): any[] {
    return this._data;
  }

  get endtime(): number {
    return this._project.simulation.kernel.time;
  }

  get imageButtonOptions(): any {
    return this._imageButtonOptions;
  }

  get layout(): any {
    return this._layout;
  }

  get panels(): ActivityGraphPanel[] {
    return this._panels;
  }

  set panels(values: ActivityGraphPanel[]) {
    this._panels = values;
    this.update();
  }

  get panelsAll(): ActivityGraphPanel[] {
    return this._panelsAll;
  }

  get panelsInvisible(): ActivityGraphPanel[] {
    return this._panelsAll.filter(
      (panel: ActivityGraphPanel) => !panel.visible
    );
  }

  get project(): Project {
    return this._project;
  }

  empty(): void {
    this._data = [];
  }

  init(registerPanels: any[] = []): void {
    // console.log('Init activity chart graph for', this.project.name);
    if (registerPanels.length > 0) {
      this._registerPanels = registerPanels;
    }

    this._panelsAll = [];
    for (const registerPanel of this._registerPanels) {
      const panel: ActivityGraphPanel = registerPanel(this);
      if (panel.hasActivities()) {
        this._panelsAll.push(panel);
      }
    }
    this._panels = this._panelsAll.filter(
      (panel: ActivityGraphPanel) => panel.visible
    );
    this.updateLayout();
  }

  initPanels(): void {
    this._panels.forEach((panel: ActivityGraphPanel) => panel.init());
  }

  addPanel(panel: ActivityGraphPanel): void {
    panel.visible = true;
    this._panels.push(panel);
    this.update();
  }

  removePanel(panel: ActivityGraphPanel): void {
    panel.visible = false;
    this._panels = this._panels.filter(
      (panel: ActivityGraphPanel) => panel.visible
    );
    this.update();
  }

  updateColor(): void {
    this._panels.forEach((panel: ActivityGraphPanel) => panel.updateColor());
  }

  resetLayout(): void {
    this._layout = {
      margin: this._layout.margin,
      title: this._layout.title,
    };
  }

  updateLayout(): void {
    this._panels.forEach((panel: ActivityGraphPanel) => panel.updateLayout());
  }

  // With data

  update(): void {
    // console.log('Update activity chart graph');
    const date: string = new Date().toISOString();
    this._options.toImageButtonOptions.filename = `nest_desktop-${this.project.name}-${date}`;
    this._data = [];
    this.resetLayout();
    this._panels.forEach((panel: ActivityGraphPanel) => {
      panel.update();
      panel.updateLayout();
      this.layout['yaxis' + (panel.yaxis > 1 ? panel.yaxis : '')] =
        panel.layout.yaxis;
      this.layout['xaxis' + (panel.xaxis > 1 ? panel.xaxis : '')] =
        panel.layout.xaxis;
      if (panel.layout.barmode) {
        this.layout.barmode = panel.layout.barmode;
      }
      panel.data.forEach((data: any) => {
        data.panelIdx = panel.idx;
        data.xaxis = 'x' + panel.xaxis;
        data.yaxis = 'y' + panel.yaxis;
        this._data.push(data);
      });
    });
  }
}
