// projectState.ts

import { reactive, UnwrapRef } from "vue";

import { TProject } from "@/types/projectTypes";

type TAction = {
  onClick: object;
  text: string;
};

type TSnackbar = {
  actions: TAction[];
  important: boolean;
  show: boolean;
  text: string;
};

export interface IProjectState {
  changes: boolean;
  editMode: boolean;
}

export class ProjectState {
  private _state: UnwrapRef<IProjectState>;
  private _project: TProject;
  private _selected: boolean = false;
  private _snackbar: TSnackbar;

  constructor(project: TProject) {
    this._project = project;

    this._state = reactive({
      changes: false,
      editMode: false,
    });

    this._snackbar = {
      actions: [],
      important: false,
      show: false,
      text: "",
    };
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

  get snackbar(): TSnackbar {
    return this._snackbar;
  }

  get state(): UnwrapRef<IProjectState> {
    return this._state;
  }

  /**
   * Check the changes in project.
   */
  checkChanges(): void {
    this._state.changes =
      // this._project.id !== this._project.doc.id ||
      this._project.hash !== this._project.doc.hash;
  }

  /**
   * Close snackbar.
   */
  closeSnackbar(): void {
    this._snackbar = {
      actions: [],
      important: false,
      show: false,
      text: "",
    };
  }

  /**
   * Reset state of this project.
   */
  reset(): void {
    this._selected = false;
  }

  /**
   * Show snackbar.
   */
  showSnackbar(
    text: string,
    actions: TAction[] = [],
    important: boolean = false
  ): void {
    this._snackbar.text = text;
    this._snackbar.actions = actions;
    this._snackbar.important = important;
    this._snackbar.show = true;
  }
}
