import * as math from 'mathjs';

import { Activity } from '../activity';
import { ActivityChartGraph } from '../activityChartGraph';
import { Config } from '../../config';

export abstract class ActivityGraphPanel extends Config {
  // private static readonly _name = 'ActivityGraphPanel';
  private _activities: Activity[] = [];
  private _data: any[] = [];
  private _graph: ActivityChartGraph; // parent
  private _icon = 'mdi-chart-bell-curve-cumulative';
  private _label = 'graph panel of activity';
  private _layout: any = {
    xaxis: {
      showgrid: true,
      title: '',
    },
    yaxis: {
      height: 1,
      showgrid: true,
      title: '',
    },
  };
  private _name = '';
  private _visible = true;
  private _xaxis = 1;

  constructor(graph: ActivityChartGraph, configName: string = null) {
    super(configName || 'ActivityGraphPanel');
    this.name = configName;
    this._graph = graph;
  }

  get activities(): Activity[] {
    return this._activities;
  }

  set activities(value: Activity[]) {
    this._activities = value;
  }

  get data(): any[] {
    return this._data;
  }

  set data(value: any[]) {
    this._data = value;
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

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get idx(): number {
    return this.graph.panels.indexOf(this);
  }

  get layout(): any {
    return this._layout;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get state(): any {
    return {};
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  get xaxis(): number {
    return this._xaxis;
  }

  set xaxis(value: number) {
    this._xaxis = value;
  }

  get yaxis(): number {
    return this.graph.panels.indexOf(this) + 1;
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
   * Initialize activity graph panel.
   *
   * @remarks
   * This method will be overwritten in child classes.
   */
  abstract init(): void;

  /**
   * Update panels for activities.
   *
   * @remarks
   * It requires activity data.
   */
  update(): void {
    // console.log('Update panels for activity.');
    this.activities.forEach((activity: Activity) => {
      this.updateStates(activity);
    });

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
   * Update layout in activity graph panel.
   */
  updateLayout(): void {
    const panels: ActivityGraphPanel[] = this.graph.panels;
    const heights: number[] = panels.map(
      (panel: ActivityGraphPanel) => panel.layout.yaxis.height
    );
    const heightTotal: number = math.sum(heights);
    heights.reverse();
    const heightCumsum: number[] = heights.map(
      (
        (sum: number) => (value: number) =>
          (sum += value)
      )(0)
    );
    const steps = heightCumsum.map((h: number) => h / heightTotal);
    steps.unshift(0);
    steps.reverse();
    const margin: number = this.xaxis === 1 ? 0.02 : 0.07;
    const domain: number[] = [
      steps[this.yaxis],
      steps[this.yaxis - 1] - margin,
    ];
    this.layout.yaxis.domain = domain;
    this.layout.xaxis.anchor = 'y' + this.yaxis;
  }

  /**
   * Update layout label.
   *
   * @remarks
   * It is a replacement for abstract component.
   */
  updateLayoutLabel(data: any = undefined): void {
    data;
  }

  /**
   * Update states of activity graph panel.
   *
   * @remarks
   * It requires activity data.
   * It is a replacement for abstract component.
   */
  updateStates(activity: Activity): void {
    activity;
  }
}
