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
  private _config: any = {};
  private _data: any[] = [];
  private _hash: string;
  private _imageButtonOptions: any;
  private _layout: any = {};
  private _panels: ActivityGraphPanel[] = [];
  private _panelsVisible: string[] = [];
  private _project: Project;
  private _registerPanels: any[] = [];
  private _style: any = {};

  constructor(project: Project, registerPanels: any[] = []) {
    this._project = project;
    this._hash = project.hash;
    this._config = {
      scrollZoom: true,
      editable: true,
      // displayModeBar: true,
      displaylogo: false,
      responsive: true,
      // showLink: true,
      toImageButtonOptions: {
        format: 'svg', // png, svg, jpeg, webp
        width: 800,
        height: 600,
        scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
      },
      modeBarButtons: [
        // "zoom2d", "pan2d", "select2d", "lasso2d", "zoomIn2d", "zoomOut2d", "autoScale2d", "resetScale2d",
        // "hoverClosestCartesian", "hoverCompareCartesian", "zoom3d", "pan3d", "resetCameraDefault3d",
        // "resetCameraLastSave3d", "hoverClosest3d", "orbitRotation", "tableRotation", "zoomInGeo",
        // "zoomOutGeo", "resetGeo", "hoverClosestGeo", "toImage", "sendDataToCloud", "hoverClosestGl2d",
        // "hoverClosestPie", "toggleHover", "resetViews", "toggleSpikelines", "resetViewMapbox"
        [{
          name: 'graph-reload',
          title: 'Reload image graph',
          icon: PlotlyJS.Icons.undo,
          click: () => { this.init(); }
        }],
        // [this.imageButtonOptions, "toImage"],
        ['toImage'],
        ['zoom2d', 'pan2d'],
        ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
        ['hoverClosestCartesian', 'hoverCompareCartesian']
      ]
    };

    this._imageButtonOptions = {
      name: 'image_settings',
      title: 'Edit image settings',
      icon: PlotlyJS.Icons.pencil,
      click: (gd: any) => { }
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

    this._style = {
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 40px)',
    };

    this._registerPanels = [
      (graph: ActivityChartGraph) => new InputAnalogSignalPlotPanel(graph),
      (graph: ActivityChartGraph) => new NeuronAnalogSignalPlotPanel(graph),
      (graph: ActivityChartGraph) => new AnalogSignalHistogramPanel(graph),
      (graph: ActivityChartGraph) => new SpikeTimesRasterPlotPanel(graph),
      (graph: ActivityChartGraph) => new SpikeTimesHistogramPanel(graph),
      (graph: ActivityChartGraph) => new SpikeSendersHistogramPanel(graph),
      (graph: ActivityChartGraph) => new InterSpikeIntervalHistogramPanel(graph),
      (graph: ActivityChartGraph) => new CVISIHistogramPanel(graph),
    ];

    this.init(registerPanels);
  }

  get config(): any {
    return this._config;
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

  get hash(): string {
    return this._hash;
  }

  set hash(value: string) {
    this._hash = value;
  }

  get layout(): any {
    return this._layout;
  }

  get panels(): ActivityGraphPanel[] {
    return this._panels.filter((panel: ActivityGraphPanel) => panel.visible);
  }

  get panelsAll(): ActivityGraphPanel[] {
    return this._panels;
  }

  get panelsVisible(): string[] {
    return this._panelsVisible;
  }

  set panelsVisible(value: string[]) {
    this._panelsVisible = value;
    this.panelsAll.forEach((panel: ActivityGraphPanel) => {
      panel.visible = this.panelsVisible.includes(panel.name);
    });
  }

  get project(): Project {
    return this._project;
  }

  get style(): any {
    return this._style;
  }

  init(registerPanels: any[] = []): void {
    // console.log('Init activity chart graph for', this.project.name);
    if (registerPanels.length > 0) {
      this._registerPanels = registerPanels;
    }

    this._panels = [];
    for (const registerPanel of this._registerPanels) {
      const panel: ActivityGraphPanel = registerPanel(this);
      if (panel.hasActivities()) {
        this._panels.push(panel);
      }
    }
    this._panelsVisible = this.panels.map((panel: ActivityGraphPanel) => panel.name);
  }

  initPanels(): void {
    this._panels.forEach((panel: ActivityGraphPanel) => panel.init());
  }

  empty(): void {
    this._data = [];
  }

  update(): void {
    // console.log('Update activity chart graph');
    this._data = [];
    this.panels.forEach((panel: ActivityGraphPanel) => {
      panel.update();
      panel.updateLayout();
      this.layout['yaxis' + (panel.yaxis > 1 ? panel.yaxis : '')] = panel.layout.yaxis;
      this.layout['xaxis' + (panel.xaxis > 1 ? panel.xaxis : '')] = panel.layout.xaxis;
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
    this.hash = this.project.getHash();
  }

  updateColor(): void {
    this.panels.forEach((panel: ActivityGraphPanel) => panel.updateColor());
  }

  updateLayout(): void {
    this.panels.forEach((panel: ActivityGraphPanel) => panel.updateLayout());
  }

}
