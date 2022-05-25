import { sha1 } from 'object-hash';

import { Activity } from '../activity/activity';
import { Project } from './project';

type actionType = {
  onClick: object;
  text: string;
};

type activitiesType = {
  hasSomeAnalogRecorders: boolean;
  hasSomeEvents: boolean;
  hasSomeSpatialActivities: boolean;
  hasSomeSpikeRecorders: boolean;
};

type snackbarType = {
  actions: actionType[];
  important: boolean;
  show: boolean;
  text: string;
};

export class ProjectState {
  private _activities: activitiesType;
  private _activityStatsPanelId: number = 0;
  private _hash: string;
  private _project: Project;
  private _selected: boolean = false;
  private _snackbar: snackbarType;

  private _withActivities: boolean = false;

  constructor(project: Project) {
    this._project = project;

    this._activities = {
      hasSomeAnalogRecorders: false,
      hasSomeEvents: false,
      hasSomeSpatialActivities: false,
      hasSomeSpikeRecorders: false,
    };

    this._snackbar = {
      actions: [],
      important: false,
      show: false,
      text: '',
    };
  }

  get activities(): activitiesType {
    return this._activities;
  }

  get activityStatsPanelId(): number {
    return this._activityStatsPanelId;
  }

  set activityStatsPanelId(value: number) {
    this._activityStatsPanelId = value;
  }

  get hash(): string {
    return this._hash;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get snackbar(): snackbarType {
    return this._snackbar;
  }

  get withActivities(): boolean {
    return this._withActivities;
  }

  set withActivities(value: boolean) {
    this._withActivities = value;
  }

  /**
   * Check whether the project has some events in activities.
   */
  checkActivities(): void {
    const activities: Activity[] = this._project.activities;

    // Check if it has some activities.
    this._activities.hasSomeEvents =
      activities.length > 0
        ? activities.some((activity: Activity) => activity.hasEvents)
        : false;

    // Check if it contains some analog recorder.
    this._activities.hasSomeAnalogRecorders =
      activities.length > 0
        ? activities.some(
            (activity: Activity) => activity.recorder.model.isAnalogRecorder
          )
        : false;

    // Check if it contains some spike recorder.
    this._activities.hasSomeSpikeRecorders =
      activities.length > 0
        ? activities.some(
            (activity: Activity) => activity.recorder.model.isSpikeRecorder
          )
        : false;

    // Check if it has spatial activities.
    this._activities.hasSomeSpatialActivities = this._activities.hasSomeEvents
      ? activities.some(
          (activity: Activity) =>
            activity.hasEvents && activity.nodePositions.length > 0
        )
      : false;
  }

  /**
   * Close snackbar.
   */
  closeSnackbar(): void {
    this._snackbar = {
      actions: [],
      important: false,
      show: false,
      text: '',
    };
  }

  /**
   * Reset state of this project.
   */
  reset(): void {
    this._selected = false;
    this._withActivities = false;
  }

  /**
   * Show snackbar.
   */
  showSnackbar(
    text: string,
    actions: actionType[] = [],
    important: boolean = false
  ): void {
    this._snackbar.text = text;
    this._snackbar.actions = actions;
    this._snackbar.important = important;
    this._snackbar.show = true;
  }

  /**
   * Calculate hash of this component.
   */
  updateHash(): void {
    this._hash = sha1({
      description: this._project.description,
      name: this._project.name,
      network: this._project.network.toJSON(),
      simulation: this._project.simulation.toJSON(),
    });
  }
}
