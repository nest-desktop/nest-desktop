import { Project } from './project';

export class ProjectView {
  private _activityStatsPanelId: number = 0;
  private _modeIdx: number;
  private _project: Project; // parent
  private _selected: boolean = false;
  private _withActivities: boolean = false;

  constructor(project: Project) {
    this._project = project;
  }

  get activityStatsPanelId(): number {
    return this._activityStatsPanelId;
  }

  set activityStatsPanelId(value: number) {
    this._activityStatsPanelId = value;
  }

  get modeIdx(): number {
    return this._modeIdx;
  }

  set modeIdx(value: number) {
    this._modeIdx = value;
  }

  get project(): Project {
    return this._project;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get withActivities(): boolean {
    return this._withActivities;
  }

  set withActivities(value: boolean) {
    this._selected = true;
    this._withActivities = value;
  }

  resetState(): void {
    this._selected = false;
    this._withActivities = false;
  }

  showActivityExplorer(): void {
    this._modeIdx = 1;
  }
}
