import { Activity } from '../activity';
import { ActivityChartPanel } from './activityChartPanel';

export abstract class ActivityChartPanelModel {
  // private static readonly _name = 'ActivityGraphPanel';
  private _activities: Activity[] = [];
  private _activityType: string = '';
  private _data: any[] = [];
  private _icon: string = '';
  private _id: string = '';
  private _label: string = '';
  private _panel: ActivityChartPanel; // parent
  private _params: any[] = [];
  private _state = {
    records: [],
    time: {
      end: 0,
      start: 0,
    },
  };

  constructor(panel: ActivityChartPanel) {
    this._id = 'activityChart';
    this._panel = panel;
    this.init();
  }

  get activities(): Activity[] {
    return this._activities;
  }

  set activities(value: Activity[]) {
    this._activities = value;
  }

  get activityType(): string {
    return this._activityType;
  }

  set activityType(value: string) {
    this._activityType = value;
  }

  get data(): any[] {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get panel(): ActivityChartPanel {
    return this._panel;
  }

  get params(): any[] {
    return this._params;
  }

  set params(value: any[]) {
    this._params = value;
  }

  get state(): any {
    return this._state;
  }

  /**
   * Capitalize axis label.
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Check if it has any activities.
   */
  hasActivities(): boolean {
    return this.activities.length > 0;
  }

  /**
   * Initialize activity panel model.
   *
   * @remarks
   * This method will be overwritten in child classes.
   */
  init(): void {
    this.initState();
  }

  /**
   * Initialize state for activity panel model.
   */
  initState(): void {
    this.state.records = new Array(this.activities.length).fill([]);
  }

  /**
   * Reset activity panel model.
   */
  reset(): any {
    // console.log('Reset panels for activity.');
    this.data = [];
  }

  /**
   * Update data activities.
   *
   * @remarks
   * It requires activity data.
   */
  update(): any {
    // console.log('Update panels for activity.');
    this.updateState();

    this.data = [];
    this.activities.forEach((activity: Activity) => {
      this.updateData(activity);
    });

    this.updateLayoutLabel();
  }

  /**
   * Update marker color for activities.
   */
  updateColor(): void {
    this.activities.forEach((activity: Activity) => {
      const data: any = this.data.find(
        (d: any) => d.activityIdx === activity.idx
      );
      if (data !== undefined) {
        data.marker.color = activity.recorder.view.color;
      }
    });
  }

  /**
   * Update activity graph panel.
   *
   * @remarks
   * It requires activity data.
   * It is a replacement for abstract component.
   */
  updateData(activity: Activity): void {
    activity;
  }

  /**
   * Update layout label.
   *
   * @remarks
   * It is a replacement for abstract component.
   */
  updateLayoutLabel(records: any = undefined): void {
    records;
  }

  /**
   * Update state of the panel model.
   *
   * @remarks
   * It needs activity data.
   */
  updateState(): void {
    // console.log('Update state');

    // Update time
    this.state.time.start = 0;
    this.state.time.end = Math.max(
      this.state.time.end,
      this._panel.graph.endtime + 1
    );

    // Update records
    this.state.records = this.activities.map(
      (activity: Activity) => activity.records
    );
  }
}
