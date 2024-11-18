// projectState.ts

import { UnwrapRef, reactive } from "vue";

import { TProject } from "@/types";

export interface IProjectState {
  changes: boolean;
  editMode: boolean;
  stopwatch: {
    plotly: {
      react: number,
      restyle: number,
    },
    simulation: number;
  };
}

export class ProjectState {
  private _state: UnwrapRef<IProjectState>;
  private _project: TProject;
  private _selected: boolean = false;

  constructor(project: TProject) {
    this._project = project;

    this._state = reactive<IProjectState>({
      changes: false,
      editMode: false,
      stopwatch: {
        plotly: {
          react: 0,
          restyle: 0,
        },
        simulation: 0,
      },
    });
  }

  get changes(): boolean {
    return this._state.changes;
  }

  get editMode(): boolean {
    return this._state.editMode;
  }

  get plotly(): string {
    return `React: ${this._state.stopwatch.plotly.react / 1000}s; restyle: ${this._state.stopwatch.plotly.restyle / 1000}s`
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get visualization(): number {
    return this.state.stopwatch.plotly.react + this.state.stopwatch.plotly.restyle;
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
   * Reset state of this project.
   */
  reset(): void {
    this._selected = false;
  }
}
