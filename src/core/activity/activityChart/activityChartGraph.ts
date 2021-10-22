import { Project } from '../../project/project';
import { ActivityChartPanel } from './activityChartPanel';

export class ActivityChartGraph {
  private _options: any = {};
  private _data: any[] = [];
  private _imageButtonOptions: any;
  private _layout: any = {};
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

  get options(): any {
    return this._options;
  }

  get data(): any[] {
    return this._data;
  }

  get endtime(): number {
    return this._project.simulation.kernel.biologicalTime;
  }

  get imageButtonOptions(): any {
    return this._imageButtonOptions;
  }

  get layout(): any {
    return this._layout;
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

    this.updatePanelsVisibleLayout();
  }

  /**
   * Initialize panels.
   */
  initPanels(): void {
    this._panels.forEach((panel: ActivityChartPanel) => panel.init());
  }

  /**
   * Add panel.
   */
  addPanel(model: any = { id: 'spikeTimesRasterPlot' }): void {
    this._panels.push(new ActivityChartPanel(this, model));
  }

  /**
   * Remove panel.
   */
  removePanel(panel: ActivityChartPanel): void {
    this._panels = this._panels.filter((p: ActivityChartPanel) => p !== panel);
    this.update();
  }

  /**
   * Update colors of the chart panels.
   */
  updateColor(): void {
    this._panels.forEach((panel: ActivityChartPanel) =>
      panel.model.updateColor()
    );
  }

  /**
   * Update panel layout of the chart graph.
   */
  updatePanelsVisibleLayout(): void {
    this.panelsVisible.forEach((panel: ActivityChartPanel) =>
      panel.updateLayout()
    );
  }

  /**
   * Updates chart graph with activities.
   */
  update(): void {
    // console.log('Update activity chart graph');
    this.updatePanelsVisibleLayout();
    this.resetLayout();

    this._data = [];
    this.panelsVisible.forEach((panel: ActivityChartPanel) => {
      panel.update();
      this.updateLayout(panel);
      this.updateData(panel);
    });
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

  updateLayout(panel: ActivityChartPanel): void {
    this.layout['yaxis' + (panel.yaxis > 1 ? panel.yaxis : '')] =
      panel.layout.yaxis;
    this.layout['xaxis' + (panel.xaxis > 1 ? panel.xaxis : '')] =
      panel.layout.xaxis;
    if (panel.layout.barmode) {
      this.layout.barmode = panel.layout.barmode;
    }
  }

  updateData(panel: ActivityChartPanel): void {
    panel.model.data.forEach((data: any) => {
      data.panelIdx = panel.idx;
      data.xaxis = 'x' + panel.xaxis;
      data.yaxis = 'y' + panel.yaxis;
      this._data.push(data);
    });
  }
}
