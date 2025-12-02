// projectState.ts

import { type UnwrapRef, reactive } from "vue";

import type { BaseProject } from "../project";

export interface IProjectRefState {
  changes: boolean;
  editMode: boolean;
  stopwatch: {
    simulation: number;
    visualization: number;
  };
}

export class ProjectState<TProject extends BaseProject = BaseProject> {
  private _state: UnwrapRef<IProjectRefState>;
  private _project: TProject;
  private _selected: boolean = false;

  constructor(project: TProject) {
    this._project = project;

    this._state = reactive<IProjectRefState>({
      changes: false,
      editMode: false,
      stopwatch: {
        simulation: 0,
        visualization: 0,
      },
    });
  }

  get changes(): boolean {
    return this._state.changes;
  }

  get editMode(): boolean {
    return this._state.editMode;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get state(): UnwrapRef<IProjectRefState> {
    return this._state;
  }

  /**
   * Check the changes in project.
   */
  checkChanges(): void {
    this._state.changes = false;
    // this._project.id !== this._project.doc.id ||
    // this._project.hash !== this._project.doc.hash;
  }

  /**
   * Reset state of this project.
   */
  reset(): void {
    this._selected = false;
  }
}
