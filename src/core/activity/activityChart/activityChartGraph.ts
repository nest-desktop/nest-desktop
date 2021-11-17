import { Project } from '../../project/project';
import { ActivityChartPanel } from './activityChartPanel';

export class ActivityChartGraph {
  private _data: any[] = [];
  private _imageButtonOptions: any;
  private _layout: any = {};
  private _options: any = {};
  private _panels: ActivityChartPanel[] = [];
  private _project: Project;

  constructor(project: Project) {
    this._project = project;
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

    this.init();
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

  /**
   * Add panel.
   */
  addPanel(model: any = { id: 'spikeTimesRasterPlot' }): void {
    this._panels.push(new ActivityChartPanel(this, model));
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
  init(): void {
    // console.log('Init activity chart graph for', this.project.name);
    this._project.checkActivities();

    this._panels = [];
    if (this._project.hasSpikeActivities) {
      this.addPanel({ id: 'spikeTimesRasterPlot' });
      this.addPanel({ id: 'spikeTimesHistogram' });
    } else if (this._project.hasAnalogActivities) {
      this.addPanel({ id: 'analogSignalPlot' });
    }

    this.updateVisiblePanelsLayout();
  }

  /**
   * Initialize panel models.
   */
  initPanelModels(): void {
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
    this._layout = {
      margin: this._layout.margin,
      title: this._layout.title,
    };
  }

  /**
   * Updates chart graph with activities.
   */
  update(): void {
    // console.log('Update activity chart graph');
    this.updateVisiblePanelsLayout();
    this.resetLayout();

    this._data = [];
    this.panelsVisible.forEach((panel: ActivityChartPanel) => {
      this.updateData(panel);
      this.updateLayout(panel);
    });
  }

  /**
   * Update data of the chart graph
   */
  updateData(panel: ActivityChartPanel): void {
    panel.model.data.forEach((data: any) => {
      data.panelIdx = panel.idx;
      data.xaxis = 'x' + panel.xaxis;
      data.yaxis = 'y' + panel.yaxis;
      this._data.push(data);
    });
  }

  /**
   * Update layout of the chart graph
   */
  updateLayout(panel: ActivityChartPanel): void {
    this.layout['yaxis' + (panel.yaxis > 1 ? panel.yaxis : '')] =
      panel.layout.yaxis;
    this.layout['xaxis' + (panel.xaxis > 1 ? panel.xaxis : '')] =
      panel.layout.xaxis;
    if (panel.layout.barmode) {
      this.layout.barmode = panel.layout.barmode;
    }
  }

  /**
   * Update panel models.
   */
  updatePanelModels(): void {
    this._panels.forEach((panel: ActivityChartPanel) => panel.model.update());
  }

  /**
   * Update colors of the panel models.
   */
  updatePanelModelsColor(): void {
    this._panels.forEach((panel: ActivityChartPanel) =>
      panel.model.updateColor()
    );
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
