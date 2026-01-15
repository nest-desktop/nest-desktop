// projectCode.ts

import type { IEditorState } from "@baklavajs/core";
import { PythonCode } from "@babsey/code-graph";

import type { BaseProject } from "@/project";

export interface IProjectCodeState {
  editor: IEditorState;
}

export class ProjectCode<TProject extends BaseProject = BaseProject> extends PythonCode {
  private _project: TProject;

  constructor(project: TProject) {
    super();

    this._project = project;
  }

  get project(): TProject {
    return this._project;
  }

  /**
   * Load project code  from state
   * @param state code state
   */
  load(state: IProjectCodeState): void {
    if (this.viewModel) this.viewModel.loadEditor(state.editor);
  }

  /**
   * Save project code to state.
   * @returns project code state.
   */
  save(): IProjectCodeState | undefined {
    if (!this.viewModel) return;

    return {
      editor: this.viewModel.editor.save(),
    };
  }
}
